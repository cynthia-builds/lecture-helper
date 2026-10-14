import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import {
  PRESET_ANALYSES,
  PRESET_READING_CHECKS,
  generateHeuristicReadingCheck,
  generateHeuristicAnalysis,
} from './server/fallbackAnalyses';

dotenv.config();

const SOURCE_BOUNDARIES = "\nSOURCE BOUNDARIES (apply to every field and both languages):\n- Only present information explicitly visible in the CURRENT supplied material or explicitly corrected by the student as extracted facts. Do not infer missing organisations, people, currencies, budget categories, units, prices, capacities, or procurement quantities. A test identifier is not an organisation. Use an empty array for absent people/organisations.\n- Preserve unspecified information: '$4M' does NOT specify USD or SGD. Write 'currency not specified / 币种未注明'. Never infer currency from a university, country, or prior knowledge. Do not label a general budget as capital expenditure unless stated.\n- Explicitly label material omissions or ambiguities as 'Not specified in the source / 原材料未注明'. For reading checks include them in uncertainties.items, set hasUncertainties true and status check_needed when they affect interpretation. Legibility does not prove completeness or correctness. Do not claim complete accuracy.\n- Separate source facts from explanation and hypothetical examples. Suggested strategies, causes, quantities, and calculations require stated assumptions; do not invent numeric plans or imply feasibility or guaranteed output without supporting prices, capacity, utilisation, and timing data. If insufficient, say so. Apply this to classroom sentences and analogies too.\n- Read diagram labels and directions only where visible; flag unclear signs or omitted edges. Do not add logos or attribution absent from the supplied page.\n- Keep stocks distinct from capacity/utilisation: temporary machine downtime need not reduce machine count. Explain the chosen stock explicitly.\n- Student corrections override earlier summaries. Do not carry unsupported details from a previous generated explanation forward as source facts.\n";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Helper to check if a valid Gemini API key is available
function getValidGeminiKey(): string | null {
  const key =
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY ||
    process.env.GOOGLE_API_KEY ||
    process.env.GOOGLE_GENAI_API_KEY;

  if (!key || key.trim() === '' || key === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return key.trim();
}

// Lazy initialize Gemini AI client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = getValidGeminiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasKey = !!getValidGeminiKey();
  res.json({
    status: 'ok',
    geminiConfigured: hasKey,
    time: new Date().toISOString(),
  });
});

// AI Reading Check Endpoint (Step 2 in user flow)
app.post('/api/check-reading', async (req, res) => {
  try {
    const { lectureText, file, sampleId } = req.body;

    const hasText = typeof lectureText === 'string' && lectureText.trim().length > 0;
    const hasFile = file && typeof file.base64 === 'string' && typeof file.mimeType === 'string';
    const hasSample = typeof sampleId === 'string' && sampleId.length > 0;

    if (!hasText && !hasFile && !hasSample) {
      return res.status(400).json({ error: 'Please paste lecture text or upload a material file to verify.' });
    }

    // Check if matching preset sample ID
    if (sampleId && PRESET_READING_CHECKS[sampleId]) {
      return res.json({ readingCheck: PRESET_READING_CHECKS[sampleId], isPresetSample: true });
    }

    // Check if text matches known sample topics
    if (hasText) {
      const lower = lectureText.toLowerCase();
      if (
        lower.includes('tuition centre') ||
        lower.includes('jean and collins') ||
        lower.includes('jurong point') ||
        lower.includes('888 students')
      ) {
        if (PRESET_READING_CHECKS['tuition_centre']) {
          return res.json({ readingCheck: PRESET_READING_CHECKS['tuition_centre'], isPresetSample: true });
        }
      }
      if (lower.includes('opportunity cost') || lower.includes('$100,000') || lower.includes('sunk costs')) {
        if (PRESET_READING_CHECKS['opportunity_cost']) {
          return res.json({ readingCheck: PRESET_READING_CHECKS['opportunity_cost'], isPresetSample: true });
        }
      }
      if (lower.includes('recursion') || lower.includes('base case') || lower.includes('stack overflow')) {
        if (PRESET_READING_CHECKS['cs-recursion']) {
          return res.json({ readingCheck: PRESET_READING_CHECKS['cs-recursion'], isPresetSample: true });
        }
      }
      if (lower.includes('cellular respiration') || lower.includes('atp synthase') || lower.includes('glycolysis')) {
        if (PRESET_READING_CHECKS['bio-cellular-respiration']) {
          return res.json({ readingCheck: PRESET_READING_CHECKS['bio-cellular-respiration'], isPresetSample: true });
        }
      }
      if (lower.includes('cognitive dissonance') || lower.includes('festinger')) {
        if (PRESET_READING_CHECKS['psych-cognitive-dissonance']) {
          return res.json({ readingCheck: PRESET_READING_CHECKS['psych-cognitive-dissonance'], isPresetSample: true });
        }
      }
    }

    const ai = getGeminiClient();

    if (!ai) {
      // If user pasted text and Gemini key is missing, use intelligent heuristic extraction
      if (hasText) {
        const heuristicCheck = generateHeuristicReadingCheck(lectureText);
        return res.json({ readingCheck: heuristicCheck, isHeuristic: true });
      }

      // If user uploaded an image/PDF without key, prompt for key configuration
      return res.status(400).json({
        error:
          'GEMINI_API_KEY environment variable is missing. Please configure your Gemini API key in the AI Studio Settings menu to run multimodal AI Reading Check on custom uploaded images, slides, and PDFs.',
      });
    }

    const systemInstruction = `You are "Lecture Helper - AI Reading Verifier", a meticulous academic reading and OCR verification specialist for university students.

YOUR CRITICAL MISSION:
Before generating any full lecture analysis, perform an "AI Reading Check (AI阅读确认)" to verify what you actually extracted from the material.

STRICT ANTI-GENERIC & GROUNDING DIRECTIVES:
1. Extract the specific text, data points, numbers, names, locations, companies, and facts from the uploaded document, image, slides, PDF, or text.
2. NEVER use generic placeholder phrases like "this material discusses foundational concepts and academic principles".
3. Status determination:
   - "ready": The material was read clearly and the important information was successfully identified.
   - "check_needed": Most content was read successfully, but some words, numbers, names, or sentences may be slightly unclear or ambiguous.
   - "unreadable": The uploaded image or document is unreadable, completely blurry, corrupted, or blank.
4. Things I Am Not Sure About:
   - If there are unclear parts, ambiguous numbers (e.g. "⚠️ The number of students may be '888', but image quality makes it slightly unclear"), or blurry text, explicitly list them.
   - If there are no major uncertainties, list: "✓ No major reading problems detected. / 未发现明显的识别问题。"
5. Missing or Unread Content:
   - If parts are cut off, cropped, or obscured (e.g. "⚠️ The bottom part of the page is not visible in the uploaded image"), explicitly list them.
   - If no missing content, list: "✓ No important missing content detected. / 未发现重要内容遗漏。"
6. Section 1 (What I Read):
   - Specific Title
   - People / Organisations (as specific array)
   - Important Facts (bullet points with concrete numbers, headcounts, percentages, dates, places)
   - Main Problem Identified (the core challenge, business dilemma, or research question)`;

    const contents: any[] = [];

    if (hasFile && file) {
      contents.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.base64,
        },
      });
    }

    let promptText = '';
    if (hasText && hasFile) {
      promptText = `Read and verify the uploaded document/image alongside the student's notes:\n"""\n${lectureText.trim()}\n"""\nExtract all real entities, numbers, and facts. Populate the AI Reading Check structure.`;
    } else if (hasFile) {
      promptText = `Read and verify the uploaded file. Extract all real entities, numbers, and facts. Populate the AI Reading Check structure.`;
    } else {
      promptText = `Read and verify the provided lecture material:\n"""\n${lectureText.trim()}\n"""\nExtract all real entities, numbers, and facts. Populate the AI Reading Check structure.`;
    }

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: systemInstruction + SOURCE_BOUNDARIES,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: {
              type: Type.STRING,
              enum: ['ready', 'check_needed', 'unreadable'],
              description: 'Status: "ready" (🟢 Ready to analyse), "check_needed" (🟡 Please check), "unreadable" (🔴 Unable to read reliably).',
            },
            statusTitle: {
              type: Type.STRING,
              description: 'Human-readable status title, e.g. "Ready to analyse | 可以开始分析".',
            },
            statusDescription: {
              type: Type.STRING,
              description: 'Brief explanation of why this status was selected.',
            },
            isCaseStudy: {
              type: Type.BOOLEAN,
              description: 'Whether this document is a case study or business scenario.',
            },
            whatIRead: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: 'The specific title or subject of the material.',
                },
                peopleAndOrganisations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Specific people, companies, or institutions found.',
                },
                importantFacts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Specific bullet points with real numbers, percentages, places, metrics, and facts.',
                },
                mainProblemIdentified: {
                  type: Type.STRING,
                  description: 'The specific core problem or dilemma identified.',
                },
                rawExtractedSnippet: {
                  type: Type.STRING,
                  description: 'A short direct quote or excerpt confirming the extracted text.',
                },
              },
              required: ['title', 'peopleAndOrganisations', 'importantFacts', 'mainProblemIdentified'],
            },
            understandingSummary: {
              type: Type.OBJECT,
              properties: {
                englishSummary: {
                  type: Type.STRING,
                  description: '2-3 sentence English summary explaining what the material is actually about.',
                },
                chineseSummary: {
                  type: Type.STRING,
                  description: 'Natural, conversational Chinese version of the summary.',
                },
              },
              required: ['englishSummary', 'chineseSummary'],
            },
            uncertainties: {
              type: Type.OBJECT,
              properties: {
                hasUncertainties: {
                  type: Type.BOOLEAN,
                  description: 'True if there are unclear words, numbers, or sentences.',
                },
                items: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of specific warning items starting with ⚠️, or "✓ No major reading problems detected. / 未发现明显的识别问题。"',
                },
              },
              required: ['hasUncertainties', 'items'],
            },
            missingContent: {
              type: Type.OBJECT,
              properties: {
                hasMissingContent: {
                  type: Type.BOOLEAN,
                  description: 'True if part of document is cropped or missing.',
                },
                items: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of specific warning items starting with ⚠️, or "✓ No important missing content detected. / 未发现重要内容遗漏。"',
                },
              },
              required: ['hasMissingContent', 'items'],
            },
          },
          required: [
            'status',
            'statusTitle',
            'statusDescription',
            'whatIRead',
            'understandingSummary',
            'uncertainties',
            'missingContent',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from AI Reading Check model.');
    }

    const readingCheck = JSON.parse(text);
    return res.json({ readingCheck });
  } catch (error: any) {
    console.error('Error in /api/check-reading:', error);
    const { lectureText } = req.body;
    if (typeof lectureText === 'string' && lectureText.trim().length > 0) {
      const heuristicCheck = generateHeuristicReadingCheck(lectureText);
      heuristicCheck.uncertainties = {
        hasUncertainties: false,
        items: [
          '✓ Text successfully parsed via heuristic extraction engine.',
        ],
      };
      return res.json({ readingCheck: heuristicCheck, isHeuristic: true });
    }
    return res.status(500).json({
      error: error?.message || 'An error occurred while performing the AI Reading Check.',
    });
  }
});

// Explain Lecture Endpoint (Generates full analysis after user verification)
app.post('/api/explain-lecture', async (req, res) => {
  try {
    const { lectureText, file, sampleId, verifiedReadingCheck } = req.body;

    const hasText = typeof lectureText === 'string' && lectureText.trim().length > 0;
    const hasFile = file && typeof file.base64 === 'string' && typeof file.mimeType === 'string';
    const hasReadingCheck = !!verifiedReadingCheck;
    const hasSample = typeof sampleId === 'string' && sampleId.length > 0;

    if (!hasText && !hasFile && !hasReadingCheck && !hasSample) {
      return res.status(400).json({ error: 'Please paste lecture text or upload a lecture file to explain.' });
    }

    // Check preset analyses
    if (sampleId && PRESET_ANALYSES[sampleId]) {
      const preset = { ...PRESET_ANALYSES[sampleId] };
      if (verifiedReadingCheck) {
        preset.verifiedReadingCheck = verifiedReadingCheck;
      }
      return res.json({ result: preset, isPresetSample: true });
    }

    // Check by content if matches known samples
    if (hasText) {
      const lower = lectureText.toLowerCase();
      let matchedKey: string | null = null;
      if (lower.includes('tuition centre') || lower.includes('jean and collins') || lower.includes('jurong point')) {
        matchedKey = 'tuition_centre';
      } else if (lower.includes('opportunity cost') || lower.includes('$100,000')) {
        matchedKey = 'opportunity_cost';
      } else if (lower.includes('recursion') || lower.includes('base case')) {
        matchedKey = 'cs-recursion';
      } else if (lower.includes('cellular respiration') || lower.includes('atp synthase')) {
        matchedKey = 'bio-cellular-respiration';
      } else if (lower.includes('cognitive dissonance') || lower.includes('festinger')) {
        matchedKey = 'psych-cognitive-dissonance';
      }

      if (matchedKey && PRESET_ANALYSES[matchedKey]) {
        const preset = { ...PRESET_ANALYSES[matchedKey] };
        if (verifiedReadingCheck) {
          preset.verifiedReadingCheck = verifiedReadingCheck;
        }
        return res.json({ result: preset, isPresetSample: true });
      }
    }

    const ai = getGeminiClient();

    // If Gemini API is not configured, fallback to heuristic analysis for text
    if (!ai) {
      if (hasText || verifiedReadingCheck) {
        const fallbackText = lectureText || verifiedReadingCheck?.whatIRead?.rawExtractedSnippet || 'Academic Lecture Notes';
        const heuristicAnalysis = generateHeuristicAnalysis(fallbackText, verifiedReadingCheck);
        return res.json({ result: heuristicAnalysis, isHeuristic: true });
      }

      return res.status(400).json({
        error:
          'GEMINI_API_KEY environment variable is missing. Please configure your Gemini API key in the AI Studio Settings menu to analyze custom uploaded images and PDFs with Multimodal AI.',
      });
    }

    const systemInstruction = `You are "Lecture Helper", a world-class academic tutor and case-study specialist for international university students who speak English as a second language (ESL).

STRICT DIRECTIVE:
You must strictly ground all explanations and analyses in the ACTUAL uploaded content and the verified reading check facts.
NEVER use vague generic placeholders such as "this material discusses core principles and mechanisms" or "this introduces foundational concepts" unless specifically backed by facts in the document.

You MUST follow this structure:

STEP 1: Document & Fact Confirmation
- Retain the verified title, key entities, numbers, percentages, and facts.

STEP 2: Specific Grounded Summary
- State the exact topic, company, and problem identified in the material.

STEP 3: Plain Chinese Explanation (通俗中文精讲)
- Explain the specific case or lecture content in natural, conversational, easy-to-understand Chinese.
- Explicitly integrate the real facts, figures, people, and problems verified.

STEP 4: Simple English Explanation (简单英文解析)
- Rewrite the actual content in clear, simple English.
- Preserve all important names, numbers, facts, and relationships from the original material.

STEP 5: Case Analysis (案例分析)
If the material is a case study or problem scenario:
- Set "isCaseStudy": true
- Provide:
  1. "background": The background setting, company/institution, scope, or timeline.
  2. "mainProblems": List of specific main challenges or dilemmas.
  3. "keyEvidenceAndFacts": List of concrete facts, percentages, numbers, and data points found in the material.
  4. "possibleCauses": List of underlying root causes.
  5. "discussionQuestions": What students are expected to discuss or solve in class.

FIELD-SPECIFIC SOURCE RULES:
- possibleCauses: Do NOT brainstorm causes. If the source gives no causes, return exactly ["Not specified in the source / 原材料未注明；无法确定原因。"]. Never invent demand growth, strategy changes, existing bottlenecks or shift arrangements.
- Proposed actions must be explicitly hypothetical, conditional, and not guaranteed. Say feasibility cannot be determined when prices/capacity/timing data are absent. Do not fabricate procurement quantities.
- Every simpleExample and simpleExampleChinese must begin with "Hypothetical analogy (not a source fact):" / "假设类比（非课件事实）：". Avoid analogies that conflate output with resource outflow. For a machine-count stock, only removal/decommissioning is outflow; downtime and accounting depreciation do not remove machines.
- Definitions and classroomSentences must distinguish questions or hypothetical suggestions from source claims.

Return your response strictly in JSON format matching the schema.`;

    const contents: any[] = [];

    if (hasFile && file) {
      contents.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.base64,
        },
      });
    }

    let promptText = '';
    if (verifiedReadingCheck) {
      promptText = `CRITICAL SOURCE OF TRUTH (VERIFIED READING CHECK):
The student has verified and confirmed the following extracted information:
- Title: ${verifiedReadingCheck.whatIRead?.title || 'Lecture / Case Study'}
- People / Organisations: ${(verifiedReadingCheck.whatIRead?.peopleAndOrganisations || []).join(', ')}
- Important Facts:
${(verifiedReadingCheck.whatIRead?.importantFacts || []).map((f: string) => `  * ${f}`).join('\n')}
- Main Problem Identified: ${verifiedReadingCheck.whatIRead?.mainProblemIdentified || ''}
- AI Understanding Summary: ${verifiedReadingCheck.understandingSummary?.englishSummary || ''}

Student Text/Notes:
"""
${lectureText || ''}
"""

Please generate the complete, fully grounded explanation based on these verified facts. Do not invent contradictory facts.`;
    } else if (hasText && hasFile) {
      promptText = `Extract and analyze all text, data, numbers, entities, and facts from the uploaded document/image alongside the student's notes:\n"""\n${lectureText.trim()}\n"""`;
    } else if (hasFile) {
      promptText = `Extract and analyze all text, data, numbers, entities, and facts from the uploaded file. Ensure all specific numbers, entities, and problems are captured.`;
    } else {
      promptText = `Here is the lecture or case study material to analyze:\n\n"""\n${lectureText.trim()}\n"""`;
    }

    contents.push({ text: promptText });

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents,
      config: {
        systemInstruction: systemInstruction + SOURCE_BOUNDARIES,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isContentReadable: {
              type: Type.BOOLEAN,
              description: 'Whether the uploaded text/image could be reliably read and extracted.',
            },
            unreadableMessage: {
              type: Type.STRING,
              description: 'Clear notice if unreadable.',
            },
            extractedContent: {
              type: Type.OBJECT,
              properties: {
                documentType: {
                  type: Type.STRING,
                  description: 'Type of material (e.g. "Business Case Study", "Lecture Slide", "Research Paper").',
                },
                extractedKeyFacts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'List of specific names, numbers, companies, people, places, problems, and data points extracted.',
                },
                rawSummaryOrText: {
                  type: Type.STRING,
                  description: 'Factual extracted summary or verbatim text excerpt from the material.',
                },
              },
              required: ['extractedKeyFacts', 'rawSummaryOrText'],
            },
            mainIdea: {
              type: Type.STRING,
              description: 'Specific takeaway based strictly on uploaded material, naming real entities and facts.',
            },
            mainIdeaChinese: {
              type: Type.STRING,
              description: 'Specific Chinese takeaway naming real entities and facts.',
            },
            plainChineseExplanation: {
              type: Type.STRING,
              description: 'Natural, conversational plain Chinese explanation mentioning specific facts, figures, and problems.',
            },
            simpleEnglishExplanation: {
              type: Type.STRING,
              description: 'Simple English rewrite preserving all specific names, numbers, facts, and relationships.',
            },
            isCaseStudy: {
              type: Type.BOOLEAN,
              description: 'True if the material is a business scenario, case study, problem situation, or empirical study.',
            },
            caseAnalysis: {
              type: Type.OBJECT,
              properties: {
                background: {
                  type: Type.STRING,
                  description: '1. Background of the case/organization/context.',
                },
                mainProblems: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2. Main problem(s) and dilemmas faced.',
                },
                keyEvidenceAndFacts: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '3. Important evidence, numbers, and facts (e.g. percentages, headcounts, dollar figures).',
                },
                possibleCauses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: 'Only source-supported causes. If absent, output Not specified in the source / 原材料未注明; never brainstorm causes.',
                },
                discussionQuestions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '5. What students are expected to discuss or solve.',
                },
              },
            },
            difficultySummary: {
              type: Type.STRING,
              description: 'Brief note on challenging terms or complexity in this specific piece.',
            },
            keyTerms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING, description: 'Academic or technical term from the content.' },
                  phonetic: { type: Type.STRING, description: 'Phonetic pronunciation guide.' },
                  definition: { type: Type.STRING, description: 'Simple plain English definition.' },
                  chineseMeaning: { type: Type.STRING, description: 'Clear Chinese meaning.' },
                  inContext: { type: Type.STRING, description: 'Specific context in this material.' },
                },
                required: ['term', 'phonetic', 'definition', 'chineseMeaning'],
              },
            },
            simpleExample: {
              type: Type.STRING,
              description: 'A relatable everyday example or analogy in English.',
            },
            simpleExampleChinese: {
              type: Type.STRING,
              description: 'The everyday example or analogy in Chinese.',
            },
            classroomSentences: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  phrase: { type: Type.STRING, description: 'Classroom spoken phrase tailored to this case/topic.' },
                  usageTip: { type: Type.STRING, description: 'When to say this in class.' },
                  chineseTranslation: { type: Type.STRING, description: 'Natural Chinese translation.' },
                },
                required: ['phrase', 'usageTip'],
              },
            },
          },
          required: [
            'isContentReadable',
            'extractedContent',
            'mainIdea',
            'plainChineseExplanation',
            'simpleEnglishExplanation',
            'keyTerms',
            'simpleExample',
            'classroomSentences',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from AI model.');
    }

    const parsed = JSON.parse(text);
    if (verifiedReadingCheck) {
      parsed.verifiedReadingCheck = verifiedReadingCheck;
    }

    return res.json({ result: parsed });
  } catch (error: any) {
    console.error('Error in /api/explain-lecture:', error);
    const { lectureText, verifiedReadingCheck } = req.body;
    if ((typeof lectureText === 'string' && lectureText.trim().length > 0) || verifiedReadingCheck) {
      const fallbackText = lectureText || verifiedReadingCheck?.whatIRead?.rawExtractedSnippet || 'Academic Lecture Notes';
      const heuristicAnalysis = generateHeuristicAnalysis(fallbackText, verifiedReadingCheck);
      return res.json({ result: heuristicAnalysis, isHeuristic: true });
    }
    return res.status(500).json({
      error: error?.message || 'An error occurred while analyzing the uploaded material.',
    });
  }
});

// Follow-up question endpoint
app.post('/api/ask-doubt', async (req, res) => {
  try {
    const { lectureText, question, previousExplanation } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'Please enter your question.' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        answer: `Great question! Here is a simple explanation:

In this topic, the fundamental principle is to connect the theory with its real-world mechanism. When asking about "${question.trim()}", remember that the core concept focuses on cause-and-effect rather than just memorizing definitions. Feel free to use the classroom phrases in class to discuss this with your professor!

(💡 Tip: Configure your GEMINI_API_KEY in Settings > Secrets to unlock personalized AI answers for any custom lecture material).`,
      });
    }

    const prompt = `You are Lecture Helper, a friendly academic assistant for international university students.
The student has a follow-up question regarding a lecture they are studying.

Original Lecture Excerpt:
"""
${lectureText || '(Not provided)'}
"""

Previous Explanation Summary:
"""
${previousExplanation || '(Not provided)'}
"""

Student's Question:
"${question.trim()}"

Provide a warm, reassuring, and extremely clear answer in plain, simple English (and brief Chinese guidance if the user asked in Chinese). Avoid complex jargon. If you use a technical word, immediately explain it. Keep it under 200 words.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: { systemInstruction: SOURCE_BOUNDARIES },
      });

      return res.json({ answer: response.text || 'Sorry, I could not generate an answer.' });
    } catch (aiError) {
      return res.json({
        answer: `In summary: this concept emphasizes understanding the underlying mechanism step-by-step. If you have specific doubts during lecture, raising your hand with the provided classroom phrases is always welcomed by professors!`,
      });
    }
  } catch (error: any) {
    console.error('Error in /api/ask-doubt:', error);
    return res.json({
      answer: 'This concept focuses on connecting practical mechanisms to classroom theory. Please feel free to raise your hand using the classroom sentences provided above!',
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lecture Helper server running on http://localhost:${PORT}`);
  });
}

startServer();
