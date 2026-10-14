import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Edit3,
  RefreshCw,
  ArrowRight,
  Sparkles,
  Building2,
  ListChecks,
  HelpCircle,
  FileSearch,
  Check,
  Plus,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { AIReadingCheck, ReadingCheckStatus } from '../types';

interface AIReadingCheckCardProps {
  readingCheck: AIReadingCheck;
  onConfirmAndAnalyze: (verifiedCheck: AIReadingCheck) => void;
  onReupload: () => void;
  isAnalyzing: boolean;
}

export const AIReadingCheckCard: React.FC<AIReadingCheckCardProps> = ({
  readingCheck,
  onConfirmAndAnalyze,
  onReupload,
  isAnalyzing,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Editable draft state
  const [draftTitle, setDraftTitle] = useState(readingCheck.whatIRead.title);
  const [draftPeople, setDraftPeople] = useState(
    readingCheck.whatIRead.peopleAndOrganisations.join(', ')
  );
  const [draftFacts, setDraftFacts] = useState<string[]>(
    readingCheck.whatIRead.importantFacts || []
  );
  const [newFactInput, setNewFactInput] = useState('');
  const [draftMainProblem, setDraftMainProblem] = useState(
    readingCheck.whatIRead.mainProblemIdentified
  );
  const [draftEnglishSummary, setDraftEnglishSummary] = useState(
    readingCheck.understandingSummary.englishSummary
  );
  const [draftChineseSummary, setDraftChineseSummary] = useState(
    readingCheck.understandingSummary.chineseSummary
  );

  const getStatusBadge = (status: ReadingCheckStatus) => {
    switch (status) {
      case 'ready':
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          containerClass: 'bg-emerald-50/70 border-emerald-200',
          title: '🟢 Ready to analyse | 可以开始分析',
          desc: 'The material was read clearly and the important information was successfully identified.',
          dotColor: 'bg-emerald-500',
        };
      case 'check_needed':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          containerClass: 'bg-amber-50/70 border-amber-200',
          title: '🟡 Please check | 建议检查',
          desc: 'Most content was read successfully, but some words, numbers, names, or sentences may be incorrect or unclear.',
          dotColor: 'bg-amber-500',
        };
      case 'unreadable':
      default:
        return {
          icon: <AlertOctagon className="w-5 h-5 text-rose-600 shrink-0" />,
          badgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
          containerClass: 'bg-rose-50/70 border-rose-200',
          title: '🔴 Unable to read reliably | 无法可靠识别',
          desc: 'The uploaded material is too unclear or incomplete. The AI should not continue with a full analysis without clearer input or manual edits.',
          dotColor: 'bg-rose-500',
        };
    }
  };

  const statusConfig = getStatusBadge(readingCheck.status);

  const handleAddFact = () => {
    if (newFactInput.trim()) {
      setDraftFacts([...draftFacts, newFactInput.trim()]);
      setNewFactInput('');
    }
  };

  const handleRemoveFact = (index: number) => {
    setDraftFacts(draftFacts.filter((_, idx) => idx !== index));
  };

  const handleFactChange = (index: number, val: string) => {
    const updated = [...draftFacts];
    updated[index] = val;
    setDraftFacts(updated);
  };

  const buildVerifiedCheck = (): AIReadingCheck => {
    return {
      ...readingCheck,
      status: 'ready', // User has reviewed and corrected it
      statusTitle: 'Ready to analyse | 可以开始分析 (User Verified)',
      whatIRead: {
        ...readingCheck.whatIRead,
        title: draftTitle.trim() || readingCheck.whatIRead.title,
        peopleAndOrganisations: draftPeople
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        importantFacts: draftFacts.filter((f) => f.trim().length > 0),
        mainProblemIdentified:
          draftMainProblem.trim() || readingCheck.whatIRead.mainProblemIdentified,
      },
      understandingSummary: {
        englishSummary: draftEnglishSummary.trim() || readingCheck.understandingSummary.englishSummary,
        chineseSummary: draftChineseSummary.trim() || readingCheck.understandingSummary.chineseSummary,
      },
    };
  };

  const handleSaveAndAnalyze = () => {
    const verified = buildVerifiedCheck();
    setIsEditing(false);
    onConfirmAndAnalyze(verified);
  };

  const handleApplyEditsOnly = () => {
    setIsEditing(false);
  };

  return (
    <div
      id="ai-reading-check-card"
      className="bg-white rounded-2xl border border-stone-200 shadow-md p-5 sm:p-7 space-y-6 animate-fadeIn"
    >
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <FileSearch className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>AI Reading Check</span>
                <span className="text-xs font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md">
                  AI阅读确认
                </span>
              </h2>
            </div>
          </div>
          <p className="text-xs text-stone-500">
            Step 2 of 3: Verify what the AI extracted from your upload before generating the full breakdown.
          </p>
        </div>

        {/* Readability Status Pill */}
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold self-start sm:self-auto shadow-2xs ${statusConfig.badgeClass}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusConfig.dotColor} animate-pulse`} />
          <span>{readingCheck.statusTitle || statusConfig.title}</span>
        </div>
      </div>

      {/* Status Notice Box */}
      <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${statusConfig.containerClass}`}>
        {statusConfig.icon}
        <div className="space-y-0.5 text-xs sm:text-sm">
          <p className="font-semibold text-stone-900">
            {readingCheck.status === 'ready'
              ? 'Material read clearly — ready to generate explanation'
              : readingCheck.status === 'check_needed'
              ? 'Material mostly read — please check details below'
              : 'Uploaded material is unclear or incomplete'}
          </p>
          <p className="text-stone-600 leading-relaxed">
            {readingCheck.statusDescription || statusConfig.desc}
          </p>
        </div>
      </div>

      {/* Normal View vs Edit Mode */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* SECTION 1 — What I Read | 我读到了什么 */}
          <div className="bg-stone-50/80 rounded-xl p-4 sm:p-5 border border-stone-200/90 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-amber-600" />
                <span>SECTION 1 — What I Read</span>
                <span className="text-stone-400 font-normal">| 我读到了什么</span>
              </h3>
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                Grounded Extraction
              </span>
            </div>

            {/* Title & Entities */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-white p-3 rounded-lg border border-stone-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                  Document / Topic Title:
                </span>
                <p className="text-sm font-bold text-stone-900">
                  {readingCheck.whatIRead.title || 'Untitled Lecture Material'}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-stone-200/80 space-y-1">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-stone-500" />
                  People / Organisations:
                </span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {readingCheck.whatIRead.peopleAndOrganisations &&
                  readingCheck.whatIRead.peopleAndOrganisations.length > 0 ? (
                    readingCheck.whatIRead.peopleAndOrganisations.map((org, i) => (
                      <span
                        key={i}
                        className="text-xs bg-stone-100 text-stone-800 font-semibold px-2 py-0.5 rounded-md border border-stone-200"
                      >
                        {org}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-stone-400 italic">No specific names detected</span>
                  )}
                </div>
              </div>
            </div>

            {/* Important Facts */}
            <div className="bg-white p-3.5 sm:p-4 rounded-lg border border-stone-200/80 space-y-2">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
                Important Facts Extracted:
              </span>
              <ul className="space-y-2">
                {readingCheck.whatIRead.importantFacts &&
                readingCheck.whatIRead.importantFacts.length > 0 ? (
                  readingCheck.whatIRead.importantFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{fact}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-stone-400 italic">No specific facts extracted.</li>
                )}
              </ul>
            </div>

            {/* Main Problem / Dilemma */}
            {readingCheck.whatIRead.mainProblemIdentified && (
              <div className="bg-amber-50/50 p-3.5 rounded-lg border border-amber-200/70 space-y-1">
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                  Main Problem / Core Dilemma Identified:
                </span>
                <p className="text-xs sm:text-sm text-stone-900 font-medium leading-relaxed">
                  {readingCheck.whatIRead.mainProblemIdentified}
                </p>
              </div>
            )}
          </div>

          {/* SECTION 2 — AI Understanding Summary | AI理解总结 */}
          <div className="bg-stone-50/80 rounded-xl p-4 sm:p-5 border border-stone-200/90 space-y-3">
            <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>SECTION 2 — AI Understanding Summary</span>
              <span className="text-stone-400 font-normal">| AI理解总结</span>
            </h3>

            <div className="space-y-3">
              {/* English Summary */}
              <div className="bg-white p-3.5 rounded-lg border border-stone-200/80">
                <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block mb-1">
                  English Summary:
                </span>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
                  "{readingCheck.understandingSummary.englishSummary}"
                </p>
              </div>

              {/* Chinese Summary */}
              <div className="bg-amber-50/30 p-3.5 rounded-lg border border-amber-200/60">
                <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block mb-1">
                  中文通俗理解:
                </span>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans">
                  {readingCheck.understandingSummary.chineseSummary}
                </p>
              </div>
            </div>
          </div>

          {/* Grid of Section 3 & 4: Uncertainties & Missing Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SECTION 3 — Things I Am Not Sure About | 以下内容我不太确定 */}
            <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200/90 space-y-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>SECTION 3 — Things I Am Not Sure About</span>
              </h3>
              <p className="text-[11px] text-stone-500">以下内容我不太确定 (Uncertainties)</p>

              <div className="space-y-1.5 pt-1">
                {readingCheck.uncertainties.items.map((item, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                      item.includes('✓') || item.includes('No major')
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium'
                        : 'bg-amber-50 text-amber-950 border border-amber-200 font-medium'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 4 — Missing or Unread Content | 可能遗漏的内容 */}
            <div className="bg-stone-50/80 rounded-xl p-4 border border-stone-200/90 space-y-2.5">
              <h3 className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>SECTION 4 — Missing or Unread Content</span>
              </h3>
              <p className="text-[11px] text-stone-500">可能遗漏的内容 (Missing/Cropped)</p>

              <div className="space-y-1.5 pt-1">
                {readingCheck.missingContent.items.map((item, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg text-xs leading-relaxed ${
                      item.includes('✓') || item.includes('No important')
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-medium'
                        : 'bg-rose-50 text-rose-950 border border-rose-200 font-medium'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5 — User Verification | 请确认AI是否读对 */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-stone-50 border border-amber-500/30 rounded-xl p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-700" />
                  <span>SECTION 5 — User Verification</span>
                  <span className="text-amber-800 font-normal">| 请确认AI是否读对</span>
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">
                  The AI will NOT generate the full explanation until you confirm or edit the extracted facts.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              {/* Button 1: Looks Correct - Start Analysis */}
              <button
                type="button"
                id="btn-looks-correct"
                onClick={() => onConfirmAndAnalyze(readingCheck)}
                disabled={isAnalyzing || readingCheck.status === 'unreadable'}
                className={`flex-1 sm:flex-initial px-6 py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 shadow-sm ${
                  readingCheck.status === 'unreadable'
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-emerald-600/20 hover:shadow-md'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Full Analysis...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Looks Correct — Start Analysis</span>
                    <span className="text-xs font-normal opacity-90">(看起来正确，开始分析)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>

              {/* Button 2: Edit / Correct Information */}
              <button
                type="button"
                id="btn-edit-info"
                onClick={() => setIsEditing(true)}
                disabled={isAnalyzing}
                className="px-4 py-3 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Edit / Correct Info</span>
                <span className="text-xs text-stone-500 font-normal">(修改或补充内容)</span>
              </button>

              {/* Button 3: Upload a Clearer Version */}
              <button
                type="button"
                id="btn-reupload"
                onClick={onReupload}
                disabled={isAnalyzing}
                className="px-4 py-3 rounded-xl border border-stone-200 bg-stone-100 hover:bg-stone-200/80 text-stone-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
                <span>Upload Clearer Version</span>
                <span className="text-xs text-stone-500 font-normal">(重新上传)</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Edit Mode Form */
        <div className="bg-stone-50 rounded-xl p-5 border border-amber-300 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <span>Edit & Correct Extracted Facts (修改与校正信息)</span>
              </h3>
              <p className="text-xs text-stone-500">
                Any corrections made here will become the strict source of truth for the subsequent analysis.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="text-xs text-stone-500 hover:text-stone-800 font-semibold"
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Document / Case Title:
              </label>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                className="w-full text-sm font-medium px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* People & Organisations */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                People & Organisations (comma separated):
              </label>
              <input
                type="text"
                value={draftPeople}
                onChange={(e) => setDraftPeople(e.target.value)}
                placeholder="e.g. Jean, Collins, Excel Tutoring Centre"
                className="w-full text-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            {/* Important Facts List */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">
                Important Facts & Verified Numbers (e.g. 888 students, 30% staff turnover):
              </label>

              <div className="space-y-2">
                {draftFacts.map((fact, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={fact}
                      onChange={(e) => handleFactChange(index, e.target.value)}
                      className="flex-1 text-xs sm:text-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveFact(index)}
                      className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                      title="Remove fact"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add new fact */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newFactInput}
                  onChange={(e) => setNewFactInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddFact();
                    }
                  }}
                  placeholder="Add another fact or corrected number..."
                  className="flex-1 text-xs sm:text-sm px-3 py-2 bg-white border border-dashed border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30"
                />
                <button
                  type="button"
                  onClick={handleAddFact}
                  className="px-3 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-lg text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Fact</span>
                </button>
              </div>
            </div>

            {/* Main Problem Identified */}
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">
                Main Problem / Core Dilemma Identified:
              </label>
              <textarea
                rows={2}
                value={draftMainProblem}
                onChange={(e) => setDraftMainProblem(e.target.value)}
                className="w-full text-xs sm:text-sm px-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>
          </div>

          {/* Edit Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={handleApplyEditsOnly}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
            >
              Update Preview Only
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-xs font-medium text-stone-600 bg-white border border-stone-300 rounded-lg hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAndAnalyze}
                disabled={isAnalyzing}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span>Save Corrections & Start Analysis</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
