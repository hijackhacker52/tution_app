import React from 'react';
import { Star, CheckCircle, GraduationCap } from 'lucide-react';
import { initialTuitionData } from '../../data/tuitionData';

export default function TeachersPage({ teachers: customTeachers }) {
  const teachers = customTeachers || initialTuitionData.teachers || [];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
            Distinguished Faculty
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Our Expert Educators</h1>
          <p className="text-indigo-200 max-w-2xl mx-auto text-base">
            Passionate teachers committed to student success, conceptual mastery, and exam preparation.
          </p>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {teachers && teachers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((tch) => (
              <div 
                key={tch.id}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center space-x-4">
                    <img 
                      src={tch.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"} 
                      alt={tch.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-100 shadow-md"
                    />
                    <div>
                      <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {tch.specialization || "Faculty"}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">{tch.name}</h3>
                      <p className="text-xs text-gray-500">{tch.role || "Instructor"}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Rating</span>
                      <span className="font-extrabold text-amber-600 flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{tch.rating || 4.9} / 5.0</span>
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">Doubts Solved</span>
                      <span className="font-extrabold text-indigo-700">{tch.doubtsSolved || 100}+</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>State Board Samacheer Kalvi Expert</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Dedicated 1-on-1 Mentorship</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center shadow-sm space-y-3 max-w-xl mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Faculty Roster In Progress</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Our distinguished teaching faculty assignments are currently being scheduled for the upcoming academic session. Please check back shortly or reach out through our contact desk.
            </p>
          </div>
        )}
      </section>

    </div>
  );
}
