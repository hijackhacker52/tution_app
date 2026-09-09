import React from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function ErrorExperience({ 
  error = 'Something went wrong while processing your request.', 
  onRetry, 
  onGoHome 
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
        {/* Soft glowing ambient lighting */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Cute Apologetic Cat / Dog SVG mascot */}
        <div className="w-36 h-36 mx-auto mb-4 relative flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
            {/* Mascot Body */}
            <circle cx="100" cy="125" r="55" fill="#f8fafc" />
            {/* Mascot Head (slightly tilted apologetically) */}
            <g transform="rotate(-6 100 85)">
              <circle cx="100" cy="85" r="45" fill="#f8fafc" />
              
              {/* Drooped Ears (Apology expression) */}
              <path d="M 60 65 Q 45 95 65 105 Z" fill="#6366f1" />
              <path d="M 62 70 Q 52 92 65 98 Z" fill="#f472b6" />
              <path d="M 140 65 Q 155 95 135 105 Z" fill="#6366f1" />
              <path d="M 138 70 Q 148 92 135 98 Z" fill="#f472b6" />

              {/* Band-aid on forehead */}
              <rect x="85" y="52" width="30" height="10" rx="3" fill="#fed7aa" transform="rotate(15 100 57)" />
              <circle cx="100" cy="57" r="1.5" fill="#ea580c" />

              {/* Apologetic Big Puppy Eyes */}
              <circle cx="85" cy="85" r="6" fill="#0f172a" />
              <circle cx="115" cy="85" r="6" fill="#0f172a" />
              {/* Eye shine reflection */}
              <circle cx="83" cy="83" r="2.5" fill="#ffffff" />
              <circle cx="113" cy="83" r="2.5" fill="#ffffff" />

              {/* Little tear of apology */}
              <path d="M 82 93 Q 80 98 83 100 Q 86 98 84 93 Z" fill="#38bdf8" />

              {/* Soft Blushing Cheeks */}
              <circle cx="75" cy="96" r="6" fill="#fca5a5" opacity="0.6" />
              <circle cx="125" cy="96" r="6" fill="#fca5a5" opacity="0.6" />

              {/* Nose & Apologetic wavy mouth */}
              <polygon points="100,93 96,89 104,89" fill="#ec4899" />
              <path d="M 95 98 Q 100 95 105 98" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>

            {/* Paws held up in sincere apology */}
            <circle cx="88" cy="128" r="9" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="112" cy="128" r="9" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
          </svg>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold mb-3">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          <span>We are so sorry!</span>
        </div>

        <h3 className="text-lg font-extrabold text-white mb-2">
          Oops! Something unexpected happened.
        </h3>

        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          {error} Our team and academy mascot are already taking care of it. Please try refreshing or return to the main portal.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
          )}
          {onGoHome && (
            <button
              onClick={onGoHome}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
