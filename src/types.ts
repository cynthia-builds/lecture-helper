export type ReadingCheckStatus = 'ready' | 'check_needed' | 'unreadable';

export interface WhatIReadSection {
  title: string;
  peopleAndOrganisations: string[];
  importantFacts: string[]; // Specific facts, numbers, places, names, metrics
  mainProblemIdentified: string;
  rawExtractedSnippet?: string;
}

export interface UnderstandingSummarySection {
  englishSummary: string; // 2-3 sentences explaining what AI believes material is actually about
  chineseSummary: string; // Natural Chinese version
}

export interface UncertaintiesSection {
  hasUncertainties: boolean;
  items: string[]; // List of specific warnings or "✓ No major reading problems detected."
}

export interface MissingContentSection {
  hasMissingContent: boolean;
  items: string[]; // List of specific warnings or "✓ No important missing content detected."
}

export interface AIReadingCheck {
  status: ReadingCheckStatus;
  statusTitle: string; // e.g. "Ready to analyse | 可以开始分析"
  statusDescription: string;
  whatIRead: WhatIReadSection;
  understandingSummary: UnderstandingSummarySection;
  uncertainties: UncertaintiesSection;
  missingContent: MissingContentSection;
  isCaseStudy?: boolean;
}

export interface KeyTerm {
  term: string;
  phonetic: string;
  definition: string;
  chineseMeaning?: string;
  inContext?: string;
}

export interface ClassroomSentence {
  phrase: string;
  usageTip: string;
  chineseTranslation?: string;
}

export interface ExtractedContent {
  documentType?: string;
  extractedKeyFacts: string[]; // Specific names, numbers, companies, people, places, problems
  rawSummaryOrText: string;
}

export interface CaseAnalysis {
  isCaseStudy: boolean;
  background?: string;
  mainProblems?: string[];
  keyEvidenceAndFacts?: string[];
  possibleCauses?: string[];
  discussionQuestions?: string[];
}

export interface LectureAnalysis {
  isContentReadable?: boolean;
  unreadableMessage?: string;
  verifiedReadingCheck?: AIReadingCheck;
  extractedContent?: ExtractedContent;
  mainIdea: string;
  mainIdeaChinese?: string;
  plainChineseExplanation: string;
  simpleEnglishExplanation: string;
  isCaseStudy?: boolean;
  caseAnalysis?: CaseAnalysis;
  difficultySummary?: string;
  keyTerms: KeyTerm[];
  simpleExample: string;
  simpleExampleChinese?: string;
  classroomSentences: ClassroomSentence[];
}

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  base64Data?: string;
  mimeType?: string;
  textContent?: string;
  previewUrl?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  snippet: string;
  fileName?: string;
  analysis: LectureAnalysis;
}

export interface SampleLecture {
  id: string;
  title: string;
  subject: string;
  text: string;
}
