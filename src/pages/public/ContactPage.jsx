import React from 'react';
import { Clock, GraduationCap, BookOpen, ShieldCheck, CheckCircle } from 'lucide-react';

export default function ContactPage({ onOpenAuth }) {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
            Academy Information
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Academic Operations & Portal Access</h1>
          <p className="text-indigo-200 max-w-2xl mx-auto text-base">
            Enrolled students, faculty members, and administrators can access their personal dashboards via the secure portal.
          </p>
        </div>
      </section>

      {/* Operations Info Card */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-gray-200/80 shadow-xl space-y-8 text-center">
          
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center border border-indigo-100">
            <GraduationCap className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-extrabold text-slate-900">Enrolled Student & Staff Portal</h2>
            <p className="text-gray-600 text-sm max-w-xl mx-auto leading-relaxed">
              All academic course materials, homework assignments, attendance tracking, and exam results are strictly managed inside the isolated student and staff portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start space-x-3">
              <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">Academy Operating Hours</h4>
                <p className="text-gray-500 mt-0.5">Monday - Saturday: 8:00 AM - 8:30 PM</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-slate-900">Privacy Compliant</h4>
                <p className="text-gray-500 mt-0.5">Student data & marks strictly isolated</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={onOpenAuth}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all text-sm"
            >
              Access Portal Login
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
