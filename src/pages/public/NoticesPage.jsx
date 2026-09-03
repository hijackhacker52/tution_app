import React, { useState } from 'react';
import { Bell, Calendar, Tag, ShieldAlert } from 'lucide-react';
import { initialTuitionData } from '../../data/tuitionData';

export default function NoticesPage({ onOpenAuth }) {
  const { notices } = initialTuitionData;
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Admission', 'Exam', 'Staff'];

  const filteredNotices = selectedCategory === 'All'
    ? notices
    : notices.filter((n) => n.category === selectedCategory);

  return (
    <div className="space-y-16 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
            Public Notice Board
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Official Academy Notices</h1>
          <p className="text-indigo-200 max-w-2xl mx-auto text-base">
            Stay informed with the latest updates regarding admissions, exam schedules, and holiday announcements.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center space-x-3">
          {categories.map((cat) => {
            const isActive = cat === selectedCategory;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </section>

      {/* Notices List */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {filteredNotices.map((notice) => (
          <div 
            key={notice.id}
            className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 hover:border-indigo-300 transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                notice.category === 'Admission' ? 'bg-emerald-100 text-emerald-800' :
                notice.category === 'Exam' ? 'bg-indigo-100 text-indigo-800' :
                'bg-amber-100 text-amber-800'
              }`}>
                {notice.category} Announcement
              </span>
              <div className="flex items-center space-x-1 text-xs text-gray-400 font-semibold">
                <Calendar className="w-4 h-4" />
                <span>{notice.date}</span>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">{notice.title}</h3>
            <p className="text-gray-600 text-sm leading-relaxed">{notice.content}</p>

            {notice.targetRole !== 'public' && (
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                <span className="flex items-center space-x-1">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  <span>Enrolled {notice.targetRole} login required for details</span>
                </span>
                <button
                  onClick={onOpenAuth}
                  className="font-bold underline hover:text-indigo-800"
                >
                  Portal Login →
                </button>
              </div>
            )}
          </div>
        ))}
      </section>

    </div>
  );
}
