import React from 'react';
import { Shield, GraduationCap, UserCheck, Lock, LogOut, Cake, Sparkles, Globe } from 'lucide-react';

export default function Header({ currentRole, setCurrentRole, activeUser, onLogout, onBackToPublic, onOpenBirthdayModal }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={onBackToPublic} 
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center cursor-pointer"
          >
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 
                onClick={onBackToPublic}
                className="font-extrabold text-base sm:text-lg tracking-tight text-white cursor-pointer hover:text-indigo-300 transition-colors"
              >
                கற்றல் மையம் <span className="text-xs sm:text-sm font-semibold text-indigo-400">(Learning Hub)</span>
              </h1>
              <span className="text-[10px] font-semibold tracking-wider uppercase bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                Management Portal
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Classes 6-12 TNSCHOOL</p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center gap-3">
          
          {/* Back to Public Website Button */}
          <button
            onClick={onBackToPublic}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Public Website</span>
          </button>

          {/* User Badge */}
          <div className="hidden md:flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
            <img 
              src={activeUser.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"} 
              alt={activeUser.name} 
              className="w-7 h-7 rounded-lg object-cover border border-slate-700"
            />
            <div>
              <p className="font-bold text-white leading-tight">{activeUser.name}</p>
              <p className="text-[10px] text-indigo-300 font-mono">{activeUser.email}</p>
            </div>
            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold ml-1 uppercase ${
              currentRole === 'student'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : currentRole === 'teacher'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {currentRole}
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center gap-1.5 transition-all"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Logout</span>
          </button>

        </div>

      </div>
    </header>
  );
}
