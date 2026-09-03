import React from 'react';
import { 
  GraduationCap, 
  ArrowRight,
  Shield,
  Award,
  BookOpen
} from 'lucide-react';

export default function Footer({ setActiveTab, onOpenAuth }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                NDT Tuition Academy
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Distraction-Free 1-on-1 Learning & AI-Powered Academy Management for Class 6 to 12 State Board students.
            </p>
            <div className="pt-2 flex items-center space-x-4 text-slate-400 text-xs">
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Samacheer Kalvi Spec</span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Verified Faculty</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              <span>Quick Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home Overview', tab: 'home' },
                { label: 'About Academy', tab: 'about' },
                { label: 'Supported Classes (6-12)', tab: 'classes' },
                { label: 'Subjects Matrix', tab: 'subjects' },
                { label: 'Faculty Profiles', tab: 'teachers' },
                { label: 'Gallery Showcase', tab: 'gallery' },
                { label: 'Public Notices', tab: 'notices' }
              ].map((item) => (
                <li key={item.tab}>
                  <button
                    onClick={() => setActiveTab(item.tab)}
                    className="hover:text-indigo-400 transition-colors flex items-center space-x-1.5"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Student/Staff Portal CTA */}
          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60 space-y-4">
            <h4 className="text-white font-semibold text-base">Academy Portal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enrolled students, faculty members, and administrators can access their personal dashboards here.
            </p>
            <button
              onClick={onOpenAuth}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm py-2.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-900/30 flex items-center justify-center space-x-2"
            >
              <span>Portal Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NDT Tuition Academy. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Samacheer Kalvi Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
