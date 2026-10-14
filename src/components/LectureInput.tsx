import React, { useRef, useState } from 'react';
import {
  ArrowRight,
  Sparkles,
  X,
  Lightbulb,
  FileText,
  UploadCloud,
  CornerDownLeft,
  Paperclip,
} from 'lucide-react';
import { SAMPLE_LECTURES } from '../data/sampleLectures';
import { SampleLecture, UploadedFile } from '../types';
import { FileUploadZone } from './FileUploadZone';

interface LectureInputProps {
  lectureText: string;
  setLectureText: (text: string) => void;
  uploadedFile: UploadedFile | null;
  setUploadedFile: (file: UploadedFile | null) => void;
  onExplain: () => void;
  isLoading: boolean;
}

export const LectureInput: React.FC<LectureInputProps> = ({
  lectureText,
  setLectureText,
  uploadedFile,
  setUploadedFile,
  onExplain,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wordCount = lectureText.trim() ? lectureText.trim().split(/\s+/).length : 0;
  const canSubmit = !isLoading && (lectureText.trim().length > 0 || uploadedFile !== null);

  const handleSelectSample = (sample: SampleLecture) => {
    setActiveTab('text');
    setLectureText(sample.text);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (canSubmit) {
        onExplain();
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-6 transition-all duration-200">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-600" />
            Lecture Content & Course Materials
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Paste confusing speech excerpts, or upload lecture slides, notes, photos, and recordings.
          </p>
        </div>

        {/* Tab Switcher: Paste Text vs Upload File */}
        <div className="flex items-center bg-stone-100/90 p-1 rounded-xl border border-stone-200/80 self-start sm:self-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'text'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Text</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('file')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'file'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
            {uploadedFile && (
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
            )}
          </button>
        </div>
      </div>

      {/* Tab 1: Paste Text Mode */}
      {activeTab === 'text' && (
        <div className="space-y-3">
          {/* Active Attached File Banner if attached in other tab */}
          {uploadedFile && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  Attached file: <strong>{uploadedFile.name}</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setUploadedFile(null)}
                className="text-amber-700 hover:text-amber-950 font-medium hover:underline text-[11px]"
              >
                Remove
              </button>
            </div>
          )}

          {/* Text Area */}
          <div className="relative">
            <textarea
              id="lecture-textarea"
              ref={textareaRef}
              value={lectureText}
              onChange={(e) => setLectureText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={5}
              placeholder="e.g. &quot;During aerobic respiration, glucose undergoes glycolysis in the cytoplasm, followed by the citric acid cycle...&quot;"
              className="w-full rounded-xl border border-stone-200/90 bg-stone-50/50 p-4 text-stone-800 text-sm sm:text-base leading-relaxed focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-stone-400 resize-y min-h-[140px]"
            />

            {lectureText.length > 0 && (
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="text-xs text-stone-400 bg-white/80 px-2 py-0.5 rounded-md border border-stone-200/60 backdrop-blur-xs font-medium">
                  {wordCount} words
                </span>
                <button
                  type="button"
                  onClick={() => setLectureText('')}
                  className="text-stone-400 hover:text-stone-600 p-1 rounded-md bg-white/80 hover:bg-stone-100 border border-stone-200/60 transition-colors"
                  title="Clear text"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Quick Example Samples */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-stone-500">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Try a sample lecture snippet:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_LECTURES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample)}
                  className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-800 text-stone-600 transition-all font-medium flex items-center gap-1.5"
                >
                  <span className="text-stone-400">#</span>
                  <span>{sample.subject}: {sample.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Upload File Mode */}
      {activeTab === 'file' && (
        <div className="space-y-4">
          <FileUploadZone
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            onTextExtracted={(extractedText) => {
              if (!lectureText.trim()) {
                setLectureText(extractedText);
              }
            }}
            disabled={isLoading}
          />

          {/* Optional notes with uploaded file */}
          <div className="space-y-1.5">
            <label
              htmlFor="file-notes"
              className="text-xs font-medium text-stone-600 flex items-center justify-between"
            >
              <span>Optional: Focus area or specific questions about this file</span>
              <span className="text-stone-400 font-normal">Optional</span>
            </label>
            <input
              id="file-notes"
              type="text"
              value={lectureText}
              onChange={(e) => setLectureText(e.target.value)}
              placeholder="e.g. Focus on Slide 4, or explain the main formula"
              className="w-full rounded-xl border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
            />
          </div>
        </div>
      )}

      {/* Primary Explain Button & Shortcuts */}
      <div className="mt-5 pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-stone-400 flex items-center gap-1 hidden sm:flex">
          <CornerDownLeft className="w-3.5 h-3.5" />
          <span>Press <strong>Cmd + Enter</strong> to explain</span>
        </div>

        <button
          type="button"
          onClick={onExplain}
          disabled={!canSubmit}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
            !canSubmit
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white shadow-amber-600/20 hover:shadow-md'
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Lecture Content...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>
                {uploadedFile && !lectureText.trim()
                  ? `Verify & Explain ${uploadedFile.name}`
                  : 'Start AI Reading Check (开始AI阅读确认)'}
              </span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
