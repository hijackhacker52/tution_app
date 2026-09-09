import React, { useState } from 'react';
import { Cake, Sparkles, Heart, X, Send, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function BirthdayModal({ activeUser, isOpen, onClose }) {
  const [wished, setWished] = useState(false);

  if (!isOpen) return null;

  const handleWishClick = () => {
    setWished(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.5 }
      });
    } catch (e) {
      console.log('Birthday confetti');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-purple-950 via-slate-900 to-slate-950 border border-purple-500/40 rounded-3xl w-full max-w-md p-6 text-center space-y-5 shadow-2xl animate-in zoom-in-95 duration-200 relative overflow-hidden">
        
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative inline-block">
          <img 
            src={activeUser.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"} 
            alt={activeUser.name} 
            className="w-24 h-24 rounded-full object-cover border-4 border-pink-500 shadow-2xl mx-auto"
          />
          <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full bg-gradient-to-r from-amber-400 to-pink-500 p-0.5 shadow-lg flex items-center justify-center">
            <Cake className="w-5 h-5 text-slate-950" />
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-extrabold border border-pink-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Birthday Alert • Today's Special Celebration</span>
          </div>

          <h3 className="text-2xl font-black text-white">
            Happy Birthday, <span className="gradient-text">{activeUser.name}</span>! 🎉
          </h3>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            கற்றல் மையம் (Learning Hub) & Admin Naveen Panneerselvam wish you an outstanding, successful academic year filled with excellence!
          </p>
        </div>

        {wished ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold space-y-1">
            <p className="flex items-center justify-center gap-1.5 text-sm">
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
              <span>Birthday Wishes & Star Gift Badge Dispatched!</span>
            </p>
            <p className="text-[11px] text-slate-300 font-normal">Thank you for celebrating with கற்றல் மையம் (Learning Hub)!</p>
          </div>
        ) : (
          <button
            onClick={handleWishClick}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Send Warm Birthday Wishes & Unlock Star Badge 🎉</span>
          </button>
        )}

      </div>
    </div>
  );
}
