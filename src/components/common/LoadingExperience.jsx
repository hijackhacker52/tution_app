import React from 'react';

export default function LoadingExperience({ message = 'Preparing your learning portal...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
        {/* Glowing background aura */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Cute Animated Cat / Dog SVG mascot */}
        <div className="w-36 h-36 mx-auto mb-4 relative flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full drop-shadow-xl animate-bounce"
            style={{ animationDuration: '2s' }}
          >
            {/* Mascot Body */}
            <circle cx="100" cy="120" r="55" fill="#f8fafc" />
            {/* Mascot Head */}
            <circle cx="100" cy="85" r="45" fill="#f8fafc" />
            
            {/* Ears (Cat/Dog style with cute inner pink) */}
            <path d="M 65 55 L 75 25 L 90 50 Z" fill="#6366f1" />
            <path d="M 70 50 L 76 33 L 86 48 Z" fill="#f472b6" />
            <path d="M 135 55 L 125 25 L 110 50 Z" fill="#6366f1" />
            <path d="M 130 50 L 124 33 L 114 48 Z" fill="#f472b6" />

            {/* Graduation Cap / Academic Mascot Hat */}
            <polygon points="100,20 60,38 100,52 140,38" fill="#1e1b4b" />
            <polygon points="85,46 85,60 115,60 115,46" fill="#312e81" />
            <path d="M 140 38 L 145 60 L 148 60 L 143 38 Z" fill="#fbbf24" />
            <circle cx="146" cy="62" r="3" fill="#fbbf24" />

            {/* Blinking / Happy Eyes */}
            <circle cx="85" cy="85" r="5" fill="#0f172a" />
            <circle cx="115" cy="85" r="5" fill="#0f172a" />
            <circle cx="87" cy="83" r="1.5" fill="#ffffff" />
            <circle cx="117" cy="83" r="1.5" fill="#ffffff" />

            {/* Cute Cheeks */}
            <circle cx="75" cy="95" r="6" fill="#fca5a5" opacity="0.6" />
            <circle cx="125" cy="95" r="6" fill="#fca5a5" opacity="0.6" />

            {/* Nose & Smile */}
            <polygon points="100,92 96,88 104,88" fill="#ec4899" />
            <path d="M 96 95 Q 100 100 104 95" stroke="#0f172a" strokeWidth="2.5" fill="none" strokeLinecap="round" />

            {/* Paws holding a notebook */}
            <rect x="75" y="125" width="50" height="35" rx="5" fill="#4f46e5" />
            <rect x="78" y="128" width="44" height="29" rx="3" fill="#e0e7ff" />
            <line x1="83" y1="135" x2="117" y2="135" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            <line x1="83" y1="142" x2="117" y2="142" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
            <line x1="83" y1="149" x2="105" y2="149" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />

            {/* Left & Right Paws */}
            <circle cx="75" cy="135" r="9" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
            <circle cx="125" cy="135" r="9" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />

            {/* Waving Tail */}
            <path
              d="M 145 145 Q 175 130 165 105"
              stroke="#6366f1"
              strokeWidth="10"
              fill="none"
              strokeLinecap="round"
              className="animate-pulse"
            />
          </svg>
        </div>

        {/* Loading Spinner & Status Message */}
        <h3 className="text-base font-bold text-white tracking-wide mb-1">
          கற்றல் மையம் (Learning Hub)
        </h3>
        <p className="text-xs text-indigo-300 font-medium mb-4">
          {message}
        </p>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full w-2/3 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
