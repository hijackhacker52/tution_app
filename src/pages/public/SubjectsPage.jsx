import React, { useState } from 'react';
import { BookOpen, Check, Search, Filter } from 'lucide-react';
import { initialTuitionData } from '../../data/tuitionData';

export default function SubjectsPage({ subjects: customSubjects, standardsList: customStandards }) {
  const subjects = customSubjects || initialTuitionData.subjects || [];
  const standardsList = customStandards || initialTuitionData.standardsList || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('all');

  const filteredSubjects = subjects.filter((subj) => {
    const matchesSearch = 
      subj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subj.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subj.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStandard = selectedStandard === 'all' || subj.standard === selectedStandard;

    return matchesSearch && matchesStandard;
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
            Subject Catalog
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Dynamic Subject Folders</h1>
          <p className="text-indigo-200 max-w-2xl mx-auto text-base">
            Comprehensive breakdown of State Board subjects across Class 6 to Class 12.
          </p>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subjects (e.g. Maths, Science, Physics)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          {/* Filter Dropdown */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={selectedStandard}
              onChange={(e) => setSelectedStandard(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Standards (Class 6 - 12)</option>
              {standardsList.map((std) => (
                <option key={std.id} value={std.name}>{std.name}</option>
              ))}
            </select>
          </div>

        </div>
      </section>

      {/* Subject Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSubjects.map((subj) => (
              <div 
                key={subj.code}
                className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48">
                    <img 
                      src={subj.imagePresentation} 
                      alt={subj.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                      {subj.standard}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{subj.code}</span>
                    <h3 className="text-xl font-bold text-slate-900">{subj.name}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{subj.description}</p>
                  </div>
                </div>

                <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between mt-4">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center space-x-1">
                    <Check className="w-4 h-4" />
                    <span>Samacheer Syllabus</span>
                  </span>
                  <span className="text-xs font-bold text-slate-500">Subject Folder</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3">
            <p className="text-gray-500 font-medium">No subjects found matching "{searchQuery}".</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedStandard('all'); }}
              className="text-indigo-600 text-xs font-bold underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

    </div>
  );
}
