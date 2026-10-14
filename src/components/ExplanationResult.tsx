import React, { useState } from 'react';
import {
  Target,
  BookOpen,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  Send,
  Loader2,
  Volume1,
  Languages,
  Layers,
  GraduationCap,
  ArrowRight,
  FileSearch,
  Building2,
  AlertTriangle,
  FileCheck2,
  TrendingDown,
  BrainCircuit,
  MessageCircleQuestion,
  CheckCircle2,
} from 'lucide-react';
import { LectureAnalysis } from '../types';
import { SpeechAssistant } from '../utils/speech';

interface ExplanationResultProps {
  analysis: LectureAnalysis;
  originalText: string;
  playbackRate: number;
}

export const ExplanationResult: React.FC<ExplanationResultProps> = ({
  analysis,
  originalText,
  playbackRate,
}) => {
  const [speakingSection, setSpeakingSection] = useState<string | null>(null);
  const [copiedPhraseIndex, setCopiedPhraseIndex] = useState<number | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [copiedFull, setCopiedFull] = useState(false);
  const [meaningViewMode, setMeaningViewMode] = useState<'both' | 'chinese' | 'english'>('both');

  // Follow-up Q&A state
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [followUpAnswers, setFollowUpAnswers] = useState<Array<{ question: string; answer: string }>>([]);
  const [isAskingDoubt, setIsAskingDoubt] = useState(false);
  const [doubtError, setDoubtError] = useState<string | null>(null);

  const chineseExplanation = analysis.plainChineseExplanation || '';
  const englishExplanation = analysis.simpleEnglishExplanation || '';

  const handleSpeak = (text: string, sectionId: string) => {
    if (speakingSection === sectionId) {
      SpeechAssistant.stop();
      setSpeakingSection(null);
      return;
    }

    setSpeakingSection(sectionId);
    SpeechAssistant.speak(text, {
      rate: playbackRate,
      onEnd: () => setSpeakingSection(null),
      onError: () => setSpeakingSection(null),
    });
  };

  const handleCopyText = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyPhrase = (phrase: string, index: number) => {
    navigator.clipboard.writeText(phrase);
    setCopiedPhraseIndex(index);
    setTimeout(() => setCopiedPhraseIndex(null), 2000);
  };

  const handleCopyAll = () => {
    const caseSection = analysis.caseAnalysis
      ? `\n【案例深度分析 | Case Analysis】
1. 背景 (Background): ${analysis.caseAnalysis.background || 'N/A'}
2. 主要痛点 (Main Problems):
${analysis.caseAnalysis.mainProblems?.map((p) => `  • ${p}`).join('\n') || 'N/A'}
3. 关键数据与证据 (Key Evidence & Facts):
${analysis.caseAnalysis.keyEvidenceAndFacts?.map((f) => `  • ${f}`).join('\n') || 'N/A'}
4. 潜在根源 (Possible Causes):
${analysis.caseAnalysis.possibleCauses?.map((c) => `  • ${c}`).join('\n') || 'N/A'}
5. 课堂解题方向 (Expected Discussion):
${analysis.caseAnalysis.discussionQuestions?.map((q) => `  • ${q}`).join('\n') || 'N/A'}\n`
      : '';

    const content = `--- LECTURE HELPER GROUNDED ACADEMIC ANALYSIS ---

【提取核心事实 | Extracted Content & Facts】
${analysis.extractedContent?.extractedKeyFacts?.map((fact) => `• ${fact}`).join('\n') || 'N/A'}

【核心主旨 | Main Idea】
${analysis.mainIdea}
${analysis.mainIdeaChinese ? `(${analysis.mainIdeaChinese})` : ''}

【通俗中文精讲 | Plain Chinese Explanation】
${chineseExplanation}

【简单英文解析 | Simple English Explanation】
${englishExplanation}
${caseSection}
【重点学术词汇 | Key Academic Terms】
${analysis.keyTerms
  .map(
    (t) =>
      `• ${t.term} [${t.phonetic}] - ${t.chineseMeaning ? t.chineseMeaning + ' | ' : ''}${t.definition}${
        t.inContext ? ` (In context: ${t.inContext})` : ''
      }`
  )
  .join('\n')}

【生动实际例子 | Simple Real-World Example】
${analysis.simpleExample}
${analysis.simpleExampleChinese ? `\n中文释义: ${analysis.simpleExampleChinese}` : ''}

【课堂实用句型 | Classroom Sentences】
${analysis.classroomSentences
  .map((s) => `• "${s.phrase}" (${s.usageTip})${s.chineseTranslation ? ` - ${s.chineseTranslation}` : ''}`)
  .join('\n')}
`;
    navigator.clipboard.writeText(content);
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2000);
  };

  const handleAskDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpQuestion.trim() || isAskingDoubt) return;

    setIsAskingDoubt(true);
    setDoubtError(null);

    try {
      const response = await fetch('/api/ask-doubt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lectureText: originalText,
          previousExplanation: `Main Idea: ${analysis.mainIdea}\nChinese: ${chineseExplanation}\nEnglish: ${englishExplanation}`,
          question: followUpQuestion.trim(),
        }),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        throw new Error(`Server returned status ${response.status}. Please try asking again.`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      setFollowUpAnswers((prev) => [
        ...prev,
        { question: followUpQuestion.trim(), answer: data.answer },
      ]);
      setFollowUpQuestion('');
    } catch (err: any) {
      setDoubtError(err.message || 'Something went wrong.');
    } finally {
      setIsAskingDoubt(false);
    }
  };

  // If the document could not be reliably read
  if (analysis.isContentReadable === false) {
    return (
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6 sm:p-8 space-y-4 animate-in fade-in">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-amber-950">
              Cannot Reliably Read Uploaded Content | 无法清晰提取上传内容
            </h2>
            <p className="text-sm sm:text-base text-amber-900 font-medium leading-relaxed">
              {analysis.unreadableMessage ||
                'I cannot reliably read the specific content in this upload. Please upload a clearer image or paste the text.'}
            </p>
            <p className="text-xs text-amber-800/80">
              提示：为确保学术分析的严谨性与真实性，AI 不会使用通用的模板伪造内容。请重新上传更高分辨率的图片、PDF或直接复制粘贴文本内容。
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Status & Copy bar */}
      <div className="flex items-center justify-between px-1 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Grounded Content Analysis Ready</span>
          {analysis.extractedContent?.documentType && (
            <span className="bg-stone-200/80 text-stone-700 px-2 py-0.5 rounded-md font-semibold text-[11px]">
              {analysis.extractedContent.documentType}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleCopyAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-xs"
        >
          {copiedFull ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Copied Full Breakdown</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Full Breakdown (完整解析)</span>
            </>
          )}
        </button>
      </div>

      {/* STEP 1: Extracted Content & Key Facts (GROUNDING EVIDENCE) */}
      {(analysis.verifiedReadingCheck || analysis.extractedContent) && (
        <section className="bg-stone-900 text-stone-100 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 border border-stone-800">
          <div className="flex items-center justify-between gap-3 border-b border-stone-800 pb-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-xs">
                <FileSearch className="w-4 h-4" />
              </span>
              <div>
                <h2 className="text-xs font-bold tracking-wider uppercase text-amber-400 flex items-center gap-2">
                  <span>STEP 1: Verified Reading Ground Truth</span>
                  <span className="text-[10px] text-stone-400 font-normal lowercase bg-stone-800 px-2 py-0.5 rounded-full">
                    已确认的提取事实与数据
                  </span>
                </h2>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>100% Grounded in AI Reading Check</span>
            </span>
          </div>

          {/* If verified reading check is available */}
          {analysis.verifiedReadingCheck && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/70 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
                  Verified Topic / Title:
                </span>
                <p className="text-xs sm:text-sm font-bold text-amber-200">
                  {analysis.verifiedReadingCheck.whatIRead.title}
                </p>
              </div>

              <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700/70 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-stone-400" />
                  People / Organisations:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {analysis.verifiedReadingCheck.whatIRead.peopleAndOrganisations?.map((org, i) => (
                    <span
                      key={i}
                      className="text-xs bg-stone-700 text-stone-100 font-medium px-2 py-0.5 rounded-md"
                    >
                      {org}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Key Facts Tag Cloud */}
          {((analysis.verifiedReadingCheck?.whatIRead.importantFacts &&
            analysis.verifiedReadingCheck.whatIRead.importantFacts.length > 0) ||
            (analysis.extractedContent?.extractedKeyFacts &&
              analysis.extractedContent.extractedKeyFacts.length > 0)) && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-stone-400">Verified Facts, Metrics & Key Dilemmas:</p>
              <div className="flex flex-wrap gap-2">
                {(
                  analysis.verifiedReadingCheck?.whatIRead.importantFacts ||
                  analysis.extractedContent?.extractedKeyFacts ||
                  []
                ).map((fact, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800/90 border border-stone-700/80 text-xs font-medium text-amber-200"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Main Problem Identified from Reading Check */}
          {analysis.verifiedReadingCheck?.whatIRead.mainProblemIdentified && (
            <div className="bg-stone-950/70 rounded-xl p-3.5 border border-stone-800 text-xs text-stone-300 leading-relaxed">
              <span className="text-amber-400 font-semibold uppercase tracking-wider block mb-1">
                Core Problem / Dilemma Grounding:
              </span>
              {analysis.verifiedReadingCheck.whatIRead.mainProblemIdentified}
            </div>
          )}

          {/* Raw / Factual Summary excerpt */}
          {!analysis.verifiedReadingCheck && analysis.extractedContent?.rawSummaryOrText && (
            <div className="bg-stone-950/70 rounded-xl p-3.5 border border-stone-800 text-xs text-stone-300 leading-relaxed">
              <span className="text-stone-500 font-semibold uppercase tracking-wider block mb-1">
                Factual Document Summary:
              </span>
              {analysis.extractedContent.rawSummaryOrText}
            </div>
          )}
        </section>
      )}

      {/* STEP 2: The Main Idea */}
      <section className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs shadow-xs">
                <Target className="w-4 h-4" />
              </span>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-950 flex items-center gap-2">
                <span>STEP 2: The Main Idea</span>
                <span className="text-[11px] font-normal text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-full">
                  一句话核心要点
                </span>
              </h2>
            </div>

            <p className="text-base sm:text-lg font-semibold text-stone-900 leading-snug pt-1">
              {analysis.mainIdea}
            </p>

            {analysis.mainIdeaChinese && (
              <p className="text-sm font-medium text-amber-950/85 pt-1 border-t border-amber-200/60">
                💡 {analysis.mainIdeaChinese}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSpeak(analysis.mainIdea, 'mainIdea')}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              speakingSection === 'mainIdea'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm animate-pulse'
                : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/60'
            }`}
            title="Listen to Main Idea in English"
          >
            {speakingSection === 'mainIdea' ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </section>

      {/* STEP 3 & STEP 4: Understand the Meaning (Plain Chinese + Simple English) */}
      <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
        {/* Section Header with View Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-200/70 font-bold text-sm">
              <BookOpen className="w-4.5 h-4.5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>STEP 3 & 4: Understand the Meaning</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900 border border-amber-200/80">
                  通俗精讲
                </span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                结合上传材料的具体事实与数据，用通俗大白话讲透本质与逻辑
              </p>
            </div>
          </div>

          {/* View Mode Toggle: Both | Chinese | English */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 self-start sm:self-auto text-xs font-medium">
            <button
              type="button"
              onClick={() => setMeaningViewMode('both')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                meaningViewMode === 'both'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>中英双解 (Both)</span>
            </button>
            <button
              type="button"
              onClick={() => setMeaningViewMode('chinese')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                meaningViewMode === 'chinese'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>纯中文 (Chinese)</span>
            </button>
            <button
              type="button"
              onClick={() => setMeaningViewMode('english')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                meaningViewMode === 'english'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>纯英文 (English)</span>
            </button>
          </div>
        </div>

        {/* 3A. Plain Chinese Explanation */}
        {(meaningViewMode === 'both' || meaningViewMode === 'chinese') && (
          <div className="rounded-xl bg-stone-50 border border-stone-200/90 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-sm font-bold text-stone-900">
                  STEP 3: Plain Chinese Explanation | 通俗中文精讲
                </h3>
                <span className="text-[11px] font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  结合实际案例数据
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleCopyText(chineseExplanation, 'chinese')}
                className="text-stone-500 hover:text-stone-800 p-1.5 rounded-lg hover:bg-stone-200/60 transition-colors text-xs flex items-center gap-1"
                title="Copy Chinese Explanation"
              >
                {copiedSection === 'chinese' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="text-sm sm:text-base text-stone-800 leading-relaxed whitespace-pre-line font-normal">
              {chineseExplanation}
            </div>
          </div>
        )}

        {/* 3B. Simple English Explanation */}
        {(meaningViewMode === 'both' || meaningViewMode === 'english') && (
          <div className="rounded-xl bg-blue-50/40 border border-blue-100 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-sm font-bold text-stone-900">
                  STEP 4: Simple English Explanation | 简单英文解析
                </h3>
                <span className="text-[11px] font-medium text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md">
                  Preserving All Facts & Metrics
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSpeak(englishExplanation, 'englishExp')}
                  className={`p-1.5 rounded-lg border transition-all text-xs flex items-center gap-1 ${
                    speakingSection === 'englishExp'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-blue-50'
                  }`}
                  title="Listen in English"
                >
                  {speakingSection === 'englishExp' ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">Listen</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyText(englishExplanation, 'english')}
                  className="text-stone-500 hover:text-stone-800 p-1.5 rounded-lg hover:bg-blue-100/60 transition-colors text-xs"
                  title="Copy English Explanation"
                >
                  {copiedSection === 'english' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="text-sm sm:text-base text-stone-800 leading-relaxed whitespace-pre-line font-normal">
              {englishExplanation}
            </div>
          </div>
        )}
      </section>

      {/* STEP 5: CASE ANALYSIS SECTION (Mandatory for Case Studies) */}
      {(analysis.isCaseStudy || analysis.caseAnalysis) && analysis.caseAnalysis && (
        <section className="bg-white border-2 border-amber-500/30 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500 text-white font-bold text-sm shadow-xs">
                <Building2 className="w-4.5 h-4.5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>STEP 5: Case Analysis | 案例深度剖析</span>
                </h2>
                <p className="text-xs text-stone-500">
                  背景、核心痛点、关键数据证据、潜在根源及课堂讨论方向
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* 1. Background */}
            {analysis.caseAnalysis.background && (
              <div className="bg-stone-50/80 border border-stone-200 rounded-xl p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <span>Background | 案例背景</span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed pl-7">
                  {analysis.caseAnalysis.background}
                </p>
              </div>
            )}

            {/* 2. Main Problem(s) */}
            {analysis.caseAnalysis.mainProblems && analysis.caseAnalysis.mainProblems.length > 0 && (
              <div className="bg-red-50/50 border border-red-200/80 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-red-950 font-bold text-sm">
                  <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  <span>Main Problem(s) | 主要痛点与核心困境</span>
                </div>
                <ul className="space-y-1.5 pl-7">
                  {analysis.caseAnalysis.mainProblems.map((prob, i) => (
                    <li key={i} className="text-sm text-red-900 flex items-start gap-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{prob}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. Important Evidence & Facts */}
            {analysis.caseAnalysis.keyEvidenceAndFacts &&
              analysis.caseAnalysis.keyEvidenceAndFacts.length > 0 && (
                <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-amber-950 font-bold text-sm">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs flex items-center justify-center font-bold">
                      3
                    </span>
                    <span>Important Evidence & Facts | 关键数据与证据链 (Facts & Metrics)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1">
                    {analysis.caseAnalysis.keyEvidenceAndFacts.map((fact, i) => (
                      <div
                        key={i}
                        className="bg-white border border-amber-200/80 rounded-lg p-2.5 text-xs text-amber-950 font-medium flex items-start gap-2 shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* 4. Possible Causes */}
            {analysis.caseAnalysis.possibleCauses &&
              analysis.caseAnalysis.possibleCauses.length > 0 && (
                <div className="bg-stone-50/80 border border-stone-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                    <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 text-xs flex items-center justify-center font-bold">
                      4
                    </span>
                    <span>Possible Causes | 潜在根源与诱因分析</span>
                  </div>
                  <ul className="space-y-1.5 pl-7">
                    {analysis.caseAnalysis.possibleCauses.map((cause, i) => (
                      <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                        <span className="text-stone-400 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* 5. What Students Are Expected to Discuss or Solve */}
            {analysis.caseAnalysis.discussionQuestions &&
              analysis.caseAnalysis.discussionQuestions.length > 0 && (
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs flex items-center justify-center font-bold">
                      5
                    </span>
                    <span>Expected Student Discussion & Solutions | 课堂研讨与解题方向</span>
                  </div>
                  <ul className="space-y-1.5 pl-7">
                    {analysis.caseAnalysis.discussionQuestions.map((q, i) => (
                      <li key={i} className="text-sm text-emerald-900 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">→</span>
                        <span className="font-medium">{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
          </div>
        </section>
      )}

      {/* 6. Key Academic Vocabulary */}
      {analysis.keyTerms && analysis.keyTerms.length > 0 && (
        <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 border border-emerald-200/70 font-bold text-sm">
                <Sparkles className="w-4.5 h-4.5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>Key Academic Vocabulary</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    重点学术词汇
                  </span>
                </h2>
                <p className="text-xs text-stone-500">
                  附自然拼读音标与具体语境含义
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {analysis.keyTerms.map((term, index) => (
              <div
                key={index}
                className="bg-stone-50/70 hover:bg-stone-50 border border-stone-200/90 rounded-xl p-4 transition-all space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-stone-900 text-base">{term.term}</span>
                      <span className="text-xs text-stone-600 bg-white px-2 py-0.5 rounded-md border border-stone-200 font-mono">
                        /{term.phonetic}/
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSpeak(term.term, `term-${index}`)}
                      className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                        speakingSection === `term-${index}`
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                      }`}
                      title="Pronounce Term"
                    >
                      <Volume1 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {term.chineseMeaning && (
                    <p className="text-xs font-semibold text-amber-900 bg-amber-50 px-2 py-1 rounded-md border border-amber-100 inline-block">
                      {term.chineseMeaning}
                    </p>
                  )}

                  <p className="text-xs text-stone-600 leading-relaxed">{term.definition}</p>
                </div>

                {term.inContext && (
                  <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 italic">
                    <span className="font-medium text-stone-700 not-italic">In this case:</span> &quot;
                    {term.inContext}&quot;
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Relatable Everyday Example */}
      {analysis.simpleExample && (
        <section className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                <Lightbulb className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <span>Real-World Analogy | 生动实际例子</span>
              </h2>
            </div>

            <button
              type="button"
              onClick={() => handleSpeak(analysis.simpleExample, 'example')}
              className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1 ${
                speakingSection === 'example'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100/60'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Listen</span>
            </button>
          </div>

          <div className="space-y-2">
            <p className="text-sm sm:text-base text-stone-900 font-medium leading-relaxed bg-white/70 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/60">
              {analysis.simpleExample}
            </p>

            {analysis.simpleExampleChinese && (
              <p className="text-xs sm:text-sm text-amber-950 font-normal leading-relaxed pl-1">
                💡 <span className="font-semibold">中文对照：</span>
                {analysis.simpleExampleChinese}
              </p>
            )}
          </div>
        </section>
      )}

      {/* 8. Classroom Spoken Sentences */}
      {analysis.classroomSentences && analysis.classroomSentences.length > 0 && (
        <section className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-purple-500/10 text-purple-700 border border-purple-200/70 font-bold text-sm">
                <MessageSquare className="w-4.5 h-4.5" />
              </span>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                  <span>Raise Your Hand in Class</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                    课堂高频发言句型
                  </span>
                </h2>
                <p className="text-xs text-stone-500">
                  专为本案例/话题设计的提问句式，自信开口发言
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {analysis.classroomSentences.map((sentence, index) => (
              <div
                key={index}
                className="group bg-stone-50/70 hover:bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 sm:p-4 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <p className="text-sm sm:text-base font-semibold text-stone-900 font-serif tracking-tight">
                    &quot;{sentence.phrase}&quot;
                  </p>

                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="text-stone-500 font-medium">
                      🎯 <span className="font-semibold text-stone-700">Usage:</span> {sentence.usageTip}
                    </span>
                  </div>

                  {sentence.chineseTranslation && (
                    <p className="text-xs text-stone-600 bg-white/80 px-2.5 py-1 rounded-md border border-stone-200/60 inline-block font-normal">
                      中文意思: {sentence.chineseTranslation}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSpeak(sentence.phrase, `sentence-${index}`)}
                    className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                      speakingSection === `sentence-${index}`
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                    title="Listen to phrase"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Pronounce</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopyPhrase(sentence.phrase, index)}
                    className="p-2 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 transition-colors text-xs"
                    title="Copy phrase"
                  >
                    {copiedPhraseIndex === index ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. Follow-Up Doubt Assistant */}
      <section className="bg-stone-900 text-white rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 border border-stone-800">
        <div className="flex items-center gap-2.5 pb-3 border-b border-stone-800">
          <span className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
            <HelpCircle className="w-4.5 h-4.5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Have a specific doubt about this case?</span>
              <span className="text-xs font-normal text-stone-400">课后随问随答</span>
            </h2>
            <p className="text-xs text-stone-400">
              Ask anything about numbers, why students churn, or clarifying concepts.
            </p>
          </div>
        </div>

        {/* Answers List */}
        {followUpAnswers.length > 0 && (
          <div className="space-y-3 pt-1">
            {followUpAnswers.map((item, idx) => (
              <div key={idx} className="bg-stone-800/80 rounded-xl p-4 border border-stone-700/70 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 font-bold text-xs uppercase tracking-wider bg-amber-400/10 px-2 py-0.5 rounded-md mt-0.5">
                    Q:
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-stone-100">{item.question}</p>
                </div>
                <div className="text-xs sm:text-sm text-stone-300 leading-relaxed pl-6 border-l-2 border-amber-500/40 whitespace-pre-line">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Question Form */}
        <form onSubmit={handleAskDoubt} className="flex gap-2">
          <input
            type="text"
            value={followUpQuestion}
            onChange={(e) => setFollowUpQuestion(e.target.value)}
            placeholder="e.g. &quot;Why did the 30% tutor turnover lead to student churn?&quot; or &quot;这个沉没成本具体怎么算？&quot;"
            className="flex-1 rounded-xl bg-stone-950 border border-stone-800 px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            disabled={isAskingDoubt}
          />
          <button
            type="submit"
            disabled={!followUpQuestion.trim() || isAskingDoubt}
            className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-stone-950 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 text-xs sm:text-sm shadow-xs shrink-0"
          >
            {isAskingDoubt ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Ask</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {doubtError && <p className="text-xs text-red-400">{doubtError}</p>}
      </section>
    </div>
  );
};
