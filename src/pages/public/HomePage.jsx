import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Brain
} from 'lucide-react';
import { initialTuitionData } from '../../data/tuitionData';

export default function HomePage({ setActiveTab, onOpenAuth }) {
  const { standardsList, notices } = initialTuitionData;

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-md px-4 py-1.5 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                <span>Academic Year 2026 - 2027 Active</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Empowering Students for <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-300 bg-clip-text text-transparent">Academic Glory</span>
              </h1>

              <p className="text-base sm:text-lg text-indigo-100/80 max-w-2xl leading-relaxed">
                Distraction-Free 1-on-1 personalized tutoring, rigorous State Board (Samacheer Kalvi) syllabus preparation, and AI-powered study assistance for Class 6 to 12.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg shadow-indigo-500/30 flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                  <span>Student / Staff Portal Login</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveTab('classes')}
                  className="w-full sm:w-auto bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-white font-semibold px-6 py-4 rounded-xl transition-all flex items-center justify-center space-x-2 text-sm"
                >
                  <span>Browse Class Folders</span>
                </button>
              </div>

              {/* Badges */}
              <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-left">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">98%</h3>
                  <p className="text-xs text-indigo-200">Board Exam Pass Rate</p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">1-on-1</h3>
                  <p className="text-xs text-indigo-200">Personalized Focus</p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Class 6-12</h3>
                  <p className="text-xs text-indigo-200">State Board Matrix</p>
                </div>
              </div>

            </div>

            {/* Right Feature Card */}
            <div className="lg:col-span-5 relative">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl text-left space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/30 flex items-center justify-center text-indigo-300 border border-indigo-400/30">
                    <Brain className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">AI-Enhanced Platform</h3>
                    <p className="text-xs text-indigo-200">State-of-the-Art Learning Tools</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Samacheer Kalvi & State Board Specialization",
                    "Daily Doubt Clearance & Step-by-Step Guidance",
                    "AI Practice Quiz & Formula Summarizers",
                    "Dedicated Class Folder Isolation & Security"
                  ].map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-sm text-indigo-100">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/10">
                  <button
                    onClick={() => setActiveTab('classes')}
                    className="w-full bg-white text-indigo-950 font-bold py-3.5 rounded-xl hover:bg-indigo-50 transition-colors text-center block text-sm"
                  >
                    View All Class Folders & Fees
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Featured Standards (Class 6 - 12) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Curriculum Matrix</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Supported Class Folders</h2>
          <p className="text-gray-600 text-sm sm:text-base">Comprehensive coaching tailored for Tamil Nadu State Board (Samacheer Kalvi) standards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {standardsList.slice(0, 4).map((std) => (
            <div 
              key={std.id}
              onClick={() => setActiveTab('classes')}
              className="group bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {std.name.split(' ')[1] || 'SSLC'}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{std.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{std.description}</p>
                </div>
              </div>
              <div className="pt-6 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
                <span>View Subject Folders</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Public Notices Banner */}
      {notices && notices.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-indigo-500/10 p-8 rounded-3xl border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Latest Announcement</span>
              <h3 className="text-xl font-extrabold text-slate-900">{notices[0].title}</h3>
              <p className="text-sm text-slate-600 max-w-2xl">{notices[0].content}</p>
            </div>
            <button
              onClick={() => setActiveTab('notices')}
              className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-6 py-3 rounded-xl shrink-0 transition-colors"
            >
              View All Notices
            </button>
          </div>
        </section>
      )}

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-10 sm:p-14 text-white text-center space-y-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Ready to Access Your Class Folder?</h2>
          <p className="text-indigo-100 max-w-2xl mx-auto text-base">
            Log in to your student portal to access your assigned class subjects, study materials, and fee payment system.
          </p>
          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenAuth}
              className="bg-white text-indigo-950 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-indigo-50 transition-all text-sm"
            >
              Access Portal Login
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
