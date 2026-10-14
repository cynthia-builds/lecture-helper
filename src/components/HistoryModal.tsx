import React from 'react';
import { HistoryItem } from '../types';
import { Clock, X, Trash2, ArrowRight, BookOpen } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <h2 className="text-base font-semibold text-stone-900">
              Lecture History ({history.length})
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-xs text-stone-500 hover:text-red-600 flex items-center gap-1 px-2 py-1 rounded hover:bg-stone-100 transition-colors"
                title="Clear all saved lecture notes"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 p-1.5 rounded-lg hover:bg-stone-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1 divide-y divide-stone-100">
          {history.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="w-8 h-8 text-stone-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-stone-600">No lecture notes saved yet</p>
              <p className="text-xs text-stone-400 mt-1">
                When you explain lecture snippets, they will be saved here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistory(item);
                  onClose();
                }}
                className="pt-2.5 first:pt-0 group cursor-pointer"
              >
                <div className="p-3 rounded-xl hover:bg-amber-50/60 border border-transparent hover:border-amber-200 transition-all flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-amber-900 line-clamp-1">
                      {item.analysis.mainIdea}
                    </p>
                    <p className="text-xs text-stone-500 line-clamp-2 italic">
                      &quot;{item.snippet}&quot;
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-stone-400 pt-1 flex-wrap">
                      <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>{item.analysis.keyTerms.length} Key Terms</span>
                      {item.fileName && (
                        <>
                          <span>•</span>
                          <span className="bg-amber-100/70 text-amber-800 px-1.5 py-0.2 rounded font-medium">
                            📎 {item.fileName}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-stone-100 bg-stone-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
