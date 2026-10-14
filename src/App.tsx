/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { LectureInput } from './components/LectureInput';
import { AIReadingCheckCard } from './components/AIReadingCheckCard';
import { ExplanationResult } from './components/ExplanationResult';
import { HistoryModal } from './components/HistoryModal';
import { LectureAnalysis, AIReadingCheck, HistoryItem, UploadedFile } from './types';
import {
  AlertCircle,
  GraduationCap,
  Sparkles,
  FileSearch,
  BookCheck,
  ArrowLeft,
  CheckCircle2,
  FileText,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'lecture_helper_history_v1';

export default function App() {
  const [lectureText, setLectureText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [activeSampleId, setActiveSampleId] = useState<string | undefined>(undefined);

  // Workflow state: 'input' -> 'reading_check' -> 'analysis'
  const [currentStep, setCurrentStep] = useState<'input' | 'reading_check' | 'analysis'>('input');

  const [readingCheck, setReadingCheck] = useState<AIReadingCheck | null>(null);
  const [verifiedReadingCheck, setVerifiedReadingCheck] = useState<AIReadingCheck | null>(null);
  const [analysis, setAnalysis] = useState<LectureAnalysis | null>(null);

  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [lastAnalyzedFileName, setLastAnalyzedFileName] = useState<string | undefined>(undefined);

  const [isReadingCheckLoading, setIsReadingCheckLoading] = useState(false);
  const [isAnalyzingLoading, setIsAnalyzingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Audio playback rate (default: 0.85x for ESL learners)
  const [playbackRate, setPlaybackRate] = useState<number>(0.8);

  // History state
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Save history on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Invalidate results and in-flight responses whenever the source changes.
  const materialRevision = useRef(0);
  const resetMaterialResults = () => {
    materialRevision.current += 1;
    setReadingCheck(null);
    setVerifiedReadingCheck(null);
    setAnalysis(null);
    setLastAnalyzedText('');
    setLastAnalyzedFileName(undefined);
    setIsReadingCheckLoading(false);
    setIsAnalyzingLoading(false);
    setError(null);
    setCurrentStep('input');
  };

  // STEP 2: Trigger AI Reading Check
  const handleStartReadingCheck = async () => {
    const hasText = lectureText.trim().length > 0;
    const hasFile = uploadedFile !== null;

    if ((!hasText && !hasFile) || isReadingCheckLoading) return;

    const revision = ++materialRevision.current;
    setReadingCheck(null);
    setVerifiedReadingCheck(null);
    setAnalysis(null);
    setIsReadingCheckLoading(true);
    setError(null);
    setCurrentStep('reading_check');

    try {
      const payload: any = {};
      if (hasText) {
        payload.lectureText = lectureText.trim();
      }
      if (hasFile && uploadedFile) {
        payload.file = {
          name: uploadedFile.name,
          mimeType: uploadedFile.mimeType || uploadedFile.type,
          base64: uploadedFile.base64Data,
        };
      }
      if (activeSampleId) {
        payload.sampleId = activeSampleId;
      }

      const response = await fetch('/api/check-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        throw new Error(`Server returned status ${response.status}. Please check your input or connection.`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to perform AI Reading Check.');
      }

      if (!data.readingCheck) {
        throw new Error('No reading check returned from server.');
      }

      if (revision !== materialRevision.current) return;
      setReadingCheck(data.readingCheck);
    } catch (err: any) {
      if (revision !== materialRevision.current) return;
      console.error('Error in AI Reading Check:', err);
      setError(
        err.message ||
          'Could not complete the AI Reading Check. Please verify your upload or try again.'
      );
      // Stay on reading check or revert if severe
    } finally {
      if (revision === materialRevision.current) setIsReadingCheckLoading(false);
    }
  };

  // STEP 3 -> 4: User verified or edited facts -> Start Full Grounded Analysis
  const handleConfirmAndAnalyze = async (verifiedCheck: AIReadingCheck) => {
    if (isAnalyzingLoading) return;

    const revision = materialRevision.current;
    setAnalysis(null);
    setIsAnalyzingLoading(true);
    setError(null);
    setVerifiedReadingCheck(verifiedCheck);

    try {
      const payload: any = {
        verifiedReadingCheck: verifiedCheck,
      };
      if (lectureText.trim()) {
        payload.lectureText = lectureText.trim();
      }
      if (uploadedFile) {
        payload.file = {
          name: uploadedFile.name,
          mimeType: uploadedFile.mimeType || uploadedFile.type,
          base64: uploadedFile.base64Data,
        };
      }
      if (activeSampleId) {
        payload.sampleId = activeSampleId;
      }

      const response = await fetch('/api/explain-lecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        throw new Error(`Server returned status ${response.status}. Please check your connection.`);
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to explain the lecture.');
      }

      if (!data.result) {
        throw new Error('No analysis result returned from server.');
      }

      if (revision !== materialRevision.current) return;
      const newAnalysis: LectureAnalysis = data.result;
      newAnalysis.verifiedReadingCheck = verifiedCheck;

      setAnalysis(newAnalysis);
      setCurrentStep('analysis');
      setLastAnalyzedText(
        lectureText.trim() || (uploadedFile ? `Material from ${uploadedFile.name}` : '')
      );
      setLastAnalyzedFileName(uploadedFile?.name);

      // Prepend to history
      const snippet =
        verifiedCheck.whatIRead.title ||
        lectureText.trim().slice(0, 160) ||
        (uploadedFile ? `[File] ${uploadedFile.name}` : 'Lecture Material');

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        snippet,
        fileName: uploadedFile?.name,
        analysis: newAnalysis,
      };

      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 19)]);
    } catch (err: any) {
      if (revision !== materialRevision.current) return;
      console.error('Error analyzing lecture:', err);
      setError(
        err.message ||
          'Could not connect to the analysis service. Please check your internet or try again.'
      );
    } finally {
      if (revision === materialRevision.current) setIsAnalyzingLoading(false);
    }
  };

  const handleReupload = () => {
    resetMaterialResults();
  };

  const handleSelectHistory = (item: HistoryItem) => {
    resetMaterialResults();
    setVerifiedReadingCheck(item.analysis.verifiedReadingCheck || null);
    setAnalysis(item.analysis);
    if (item.analysis.verifiedReadingCheck) {
      setReadingCheck(item.analysis.verifiedReadingCheck);
    }
    setLastAnalyzedText(item.snippet);
    setLastAnalyzedFileName(item.fileName);
    setCurrentStep('analysis');
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-800 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Header
        playbackRate={playbackRate}
        setPlaybackRate={setPlaybackRate}
        historyCount={history.length}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Friendly Welcome Banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="text-sm sm:text-base font-semibold text-stone-900 flex items-center gap-2 flex-wrap">
              <span>English Lecture Breakdown for International Students</span>
              <span className="text-xs font-medium text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-md">
                AI阅读确认 + 通俗中文精讲 + 简单英文解析
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Designed for ESL university students: upload lecture slides, case studies, PDFs, or photos. We first perform an <strong>AI Reading Check</strong> to verify extracted facts and numbers, then provide plain Chinese breakdowns and classroom vocabulary.
            </p>
          </div>
        </div>

        {/* 3-Step Process Stepper Indicator */}
        <div className="bg-white rounded-xl border border-stone-200/90 p-3 shadow-2xs flex items-center justify-between text-xs font-semibold">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => {
              if (currentStep !== 'input') setCurrentStep('input');
            }}
            className={`flex items-center gap-2 transition-colors ${
              currentStep === 'input'
                ? 'text-amber-800 font-bold'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'input'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              1
            </span>
            <span className="hidden sm:inline">Upload Material (上传资料)</span>
            <span className="sm:hidden">1. Upload</span>
          </button>

          <span className="text-stone-300">→</span>

          {/* Step 2 */}
          <button
            type="button"
            disabled={!readingCheck}
            onClick={() => {
              if (readingCheck) setCurrentStep('reading_check');
            }}
            className={`flex items-center gap-2 transition-colors ${
              currentStep === 'reading_check'
                ? 'text-amber-800 font-bold'
                : readingCheck
                ? 'text-stone-600 hover:text-stone-800'
                : 'text-stone-300 cursor-not-allowed'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'reading_check'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : readingCheck
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              2
            </span>
            <span className="hidden sm:inline">AI Reading Check (AI阅读确认)</span>
            <span className="sm:hidden">2. Verify</span>
          </button>

          <span className="text-stone-300">→</span>

          {/* Step 3 */}
          <button
            type="button"
            disabled={!analysis}
            onClick={() => {
              if (analysis) setCurrentStep('analysis');
            }}
            className={`flex items-center gap-2 transition-colors ${
              currentStep === 'analysis'
                ? 'text-amber-800 font-bold'
                : analysis
                ? 'text-stone-600 hover:text-stone-800'
                : 'text-stone-300 cursor-not-allowed'
            }`}
          >
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                currentStep === 'analysis'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : analysis
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-stone-100 text-stone-400'
              }`}
            >
              3
            </span>
            <span className="hidden sm:inline">Full Analysis (完整解析)</span>
            <span className="sm:hidden">3. Analysis</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 text-rose-900 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <p className="font-semibold">Operation Notice</p>
              <p className="mt-0.5">{error}</p>
              <button
                type="button"
                onClick={handleStartReadingCheck}
                className="mt-2 text-xs font-semibold text-rose-800 underline hover:text-rose-950"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: Input Form */}
        {currentStep === 'input' && (
          <div className="space-y-6">
            <LectureInput
              lectureText={lectureText}
              setLectureText={(text) => {
                resetMaterialResults();
                setLectureText(text);
                setActiveSampleId(undefined);
              }}
              uploadedFile={uploadedFile}
              setUploadedFile={(file) => {
                resetMaterialResults();
                setUploadedFile(file);
                setActiveSampleId(undefined);
              }}
              onExplain={handleStartReadingCheck}
              isLoading={isReadingCheckLoading}
            />

            {/* Empty State Helper when no analysis yet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-stone-600">
              <div className="bg-white/60 border border-stone-200/80 rounded-xl p-4 text-center space-y-1.5 hover:bg-white transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h4 className="text-xs font-semibold text-stone-900">AI Reading Check</h4>
                <p className="text-[11px] text-stone-500">
                  Verifies extracted facts, numbers, and uncertainties before generating full breakdowns.
                </p>
              </div>

              <div className="bg-white/60 border border-stone-200/80 rounded-xl p-4 text-center space-y-1.5 hover:bg-white transition-colors">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 mx-auto flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h4 className="text-xs font-semibold text-stone-900">Plain Chinese First</h4>
                <p className="text-[11px] text-stone-500">
                  Master the underlying business or lecture logic in natural, conversational Chinese.
                </p>
              </div>

              <div className="bg-white/60 border border-stone-200/80 rounded-xl p-4 text-center space-y-1.5 hover:bg-white transition-colors">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 mx-auto flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h4 className="text-xs font-semibold text-stone-900">Simple English & Vocab</h4>
                <p className="text-[11px] text-stone-500">
                  Clear English phrasing, academic pronunciation guides, and ready-to-use classroom sentences.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State for Step 2 Reading Check */}
        {isReadingCheckLoading && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center animate-bounce">
              <FileSearch className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                AI is Reading & Verifying Uploaded Material...
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Extracting specific names, numbers, headcounts, percentages, and checking for text clarity.
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-2 pt-2">
              <div className="h-3 bg-stone-100 rounded-full animate-pulse w-full"></div>
              <div className="h-3 bg-stone-100 rounded-full animate-pulse w-5/6 mx-auto"></div>
              <div className="h-3 bg-stone-100 rounded-full animate-pulse w-4/6 mx-auto"></div>
            </div>
          </div>
        )}

        {/* STEP 2: AI Reading Check Card Review */}
        {currentStep === 'reading_check' && readingCheck && !isReadingCheckLoading && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleReupload}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Upload Area (返回上传)</span>
            </button>

            <AIReadingCheckCard
              readingCheck={readingCheck}
              onConfirmAndAnalyze={handleConfirmAndAnalyze}
              onReupload={handleReupload}
              isAnalyzing={isAnalyzingLoading}
            />
          </div>
        )}

        {/* Loading State for Step 3 Full Analysis */}
        {isAnalyzingLoading && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center animate-spin">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Generating Grounded Academic Breakdown...
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Synthesizing plain Chinese logic, simple English, and classroom phrases based on verified facts.
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-2 pt-2">
              <div className="h-3 bg-emerald-50 rounded-full animate-pulse w-full"></div>
              <div className="h-3 bg-emerald-50 rounded-full animate-pulse w-5/6 mx-auto"></div>
            </div>
          </div>
        )}

        {/* STEP 3: Full Grounded Analysis Results */}
        {currentStep === 'analysis' && analysis && !isAnalyzingLoading && (
          <div className="space-y-4">
            {/* Top Bar with Re-check Grounding button */}
            <div className="bg-white p-3 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-stone-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Analysis grounded in verified data: <strong>{analysis.verifiedReadingCheck?.whatIRead.title || 'Extracted Document'}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCurrentStep('reading_check')}
                className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1 shrink-0"
              >
                <FileSearch className="w-3.5 h-3.5 text-amber-600" />
                <span>View / Edit Reading Check</span>
              </button>
            </div>

            <ExplanationResult
              analysis={analysis}
              originalText={lastAnalyzedText}
              playbackRate={playbackRate}
            />
          </div>
        )}
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
      />

      {/* Simple Footer */}
      <footer className="border-t border-stone-200 bg-white/60 py-4 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Lecture Helper • Designed for International & ESL University Students</span>
          <span>Powered by Gemini Multimodal AI</span>
        </div>
      </footer>
    </div>
  );
}
