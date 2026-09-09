import React, { useState } from 'react';
import { BookOpen, CheckCircle, ShieldCheck, Tag } from 'lucide-react';
import { initialTuitionData } from '../../data/tuitionData';

export default function ClassesPage() {
  const { standardsList, subjects, boardsList = [] } = initialTuitionData;
  const [selectedStandard, setSelectedStandard] = useState(standardsList[4]?.name || 'Class 10 (SSLC / Secondary)');
  const [selectedBoard, setSelectedBoard] = useState('all');

  const currentClassObj = standardsList.find(s => s.name === selectedStandard) || standardsList[0];

  const filteredSubjects = subjects.filter((subj) => {
    const matchesStandard = subj.standard === selectedStandard;
    const matchesBoard = 
      selectedBoard === 'all' || 
      subj.board === selectedBoard || 
      (!subj.board && selectedBoard === 'Tamil Nadu State Board (Samacheer Kalvi)');
    return matchesStandard && matchesBoard;
  });

  return (
    <div className="space-y-16 pb-16">
      
      {/* Banner */}
      <section className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-indigo-400 text-xs font-bold uppercase tracking-widest bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-400/20">
            Multi-Curriculum Academic Folders
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Class 6 to Class 12 Course Folders</h1>
          <p className="text-indigo-200 max-w-2xl mx-auto text-base">
            Structured subject folder database for Tamil Nadu State Board (Samacheer Kalvi), CBSE, ICSE, and Cambridge curricula.
          </p>
        </div>
      </section>

      {/* Curriculum Board & Class Selector Controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Board Selector Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Educational Board:</span>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedBoard('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedBoard === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Boards
            </button>
            {boardsList.map((board) => {
              const isActive = selectedBoard === board.name;
              return (
                <button
                  key={board.id || board.code}
                  onClick={() => setSelectedBoard(board.name)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {board.shortName || board.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Class Selector Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-4 no-scrollbar border-b border-gray-200">
          {standardsList.map((std) => {
            const isActive = std.name === selectedStandard;
            return (
              <button
                key={std.id}
                onClick={() => setSelectedStandard(std.name)}
                className={`px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {std.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Details of Selected Class Folder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full">
                TNSCHOOL Board Curriculum
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">{selectedStandard} Folder Database</h2>
              <p className="text-gray-500 text-sm mt-1">
                {currentClassObj.description}
              </p>
            </div>

            <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl flex items-center space-x-3">
              <Tag className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Standard Tuition Fee</span>
                <span className="text-lg font-extrabold text-white">${currentClassObj.feeAmount || 200} / Term</span>
              </div>
            </div>
          </div>

          {/* Associated Subjects */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <span>Subject Folders in {selectedStandard}</span>
            </h3>

            {filteredSubjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjects.map((subj) => (
                  <div key={subj.code} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
                    <img 
                      src={subj.imagePresentation} 
                      alt={subj.name}
                      className="w-full h-36 object-cover rounded-xl border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{subj.code}</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {subj.board ? subj.board.split(' ')[0] : 'TN State'}
                        </span>
                      </div>
                      <h4 className="font-bold text-lg text-slate-900 mt-0.5">{subj.name}</h4>
                      <p className="text-xs text-gray-500 mt-2 leading-relaxed">{subj.description}</p>
                    </div>
                    <div className="pt-2 flex items-center text-xs font-semibold text-emerald-600 space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Chapter Notes & Question Papers</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
                Subject folders for {selectedStandard} are actively configured for enrolled students.
              </div>
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
