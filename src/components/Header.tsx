import React from 'react';
import { BookOpen, Sparkles, Volume2, History } from 'lucide-react';

interface HeaderProps {
  playbackRate: number;
  setPlaybackRate: (rate: number) => void;
  historyCount: number;
  onOpenHistory: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  playbackRate,
  setPlaybackRate,
  historyCount,
  onOpenHistory,
}) => {
  return (
    <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* App Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-stone-900 text-lg leading-tight tracking-tight">
                Lecture Helper
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/60 rounded-full px-2 py-0.5">
                <Sparkles className="w-3 h-3" />
                ESL Study Companion
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              Making fast English university lectures crystal clear
            </p>
          </div>
        </div>

        {/* Right Controls: Audio Speed & History */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Audio Speed Selector */}
          <div className="flex items-center gap-1.5 bg-stone-100/80 rounded-lg p-1 text-xs border border-stone-200/70">
            <Volume2 className="w-3.5 h-3.5 text-stone-500 ml-1" />
            <span className="text-stone-500 hidden md:inline text-[11px] font-medium mr-0.5">Speed:</span>
            <button
              type="button"
              onClick={() => setPlaybackRate(0.8)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                playbackRate === 0.8
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Slower speech (0.8x) for clear English listening"
            >
              0.8x (Clear)
            </button>
            <button
              type="button"
              onClick={() => setPlaybackRate(1.0)}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                playbackRate === 1.0
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Normal speech speed (1.0x)"
            >
              1.0x
            </button>
          </div>

          {/* History Button */}
          {historyCount > 0 && (
            <button
              type="button"
              onClick={onOpenHistory}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-colors shadow-xs"
              title="View previously explained lecture snippets"
            >
              <History className="w-3.5 h-3.5 text-stone-500" />
              <span>History</span>
              <span className="bg-stone-100 text-stone-600 text-[10px] px-1.5 py-0.2 rounded-full font-semibold">
                {historyCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
