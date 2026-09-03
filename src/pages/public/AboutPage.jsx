import React from 'react';
import { 
  GraduationCap, 
  Target, 
  Eye, 
  Award, 
  BookOpen, 
  CheckCircle2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { initialTuitionData } from '../../data/tuitionData';

export default function AboutPage({ setActiveTab }) {
  const { centerInfo } = initialTuitionData;

  return (
    <div className="space-y-16 pb-16">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
            About NDT Tuition Academy
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Nurturing Minds, Building Futures</h1>
          <p className="text-indigo-200 max-w-2xl mx-auto text-base">
            Dedicated to providing top-tier State Board (Samacheer Kalvi) education with distraction-free 1-on-1 focus and AI-assisted learning tools.
          </p>
        </div>
      </section>

      {/* History & Origin */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Our Heritage</span>
            <h2 className="text-3xl font-extrabold text-slate-900">Empowering Students Since Establishment</h2>
            <p className="text-gray-600 text-base leading-relaxed">
              Founded in {centerInfo.establishedYear}, {centerInfo.name} was established with a singular vision: to bridge the gap between classroom teaching and individual student comprehension for Tamil Nadu State Board curricula.
            </p>
            <p className="text-gray-600 text-base leading-relaxed">
              We eliminate overcrowding in classrooms by offering targeted 1-on-1 mentorship, regular diagnostic tests, and customized learning plans tailored to every student's pace.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <h4 className="text-2xl font-bold text-indigo-700">100%</h4>
                <p className="text-xs text-gray-600 mt-1">Dedicated State Board Focus</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                <h4 className="text-2xl font-bold text-purple-700">Class 6 - 12</h4>
                <p className="text-xs text-gray-600 mt-1">Samacheer Kalvi Coverage</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80" 
                alt="Academy Classroom"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                <div className="text-white space-y-1">
                  <p className="font-bold text-lg">Distraction-Free Learning Environment</p>
                  <p className="text-xs text-gray-300">Modern classrooms equipped for focused academic growth.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-slate-50 py-16 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To deliver high-quality, concept-oriented coaching that strengthens fundamental understanding in Mathematics, Science, Languages, and Humanities, ensuring every student achieves their fullest potential in school and public board examinations.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Eye className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                To become Tamil Nadu's premier tuition academy, recognized for blending traditional teaching excellence with cutting-edge AI learning assistance, fostering disciplined, confident, and high-achieving scholars.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider">Educational Philosophy</span>
          <h2 className="text-3xl font-extrabold text-slate-900">Our Teaching Approach</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Conceptual Clarity",
              desc: "Focus on understanding core principles rather than rote memorization."
            },
            {
              title: "Personalized Pace",
              desc: "Adapting instruction to suit each student's unique learning curve."
            },
            {
              title: "Regular Testing",
              desc: "Weekly chapter tests modeled on actual State Board examination patterns."
            },
            {
              title: "AI Study Support",
              desc: "Instant doubt clearance and study material summarization available 24/7."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-3">
              <CheckCircle2 className="w-8 h-8 text-indigo-600" />
              <h4 className="font-bold text-lg text-slate-900">{item.title}</h4>
              <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
