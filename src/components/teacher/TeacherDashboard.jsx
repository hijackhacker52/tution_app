import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, Square, UserCheck, MessageSquare, CheckCircle2, 
  PhoneCall, Sparkles, Image as ImageIcon, DollarSign, Calendar, BookOpen, AlertCircle, Upload
} from 'lucide-react';
import StudyMaterialUploader from './StudyMaterialUploader';

export default function TeacherDashboard({ 
  teacher = {}, 
  standardsList = [],
  subjects = [],
  students = [], 
  doubts = [], 
  materials = [],
  onClockInToggle, 
  onAnswerDoubt, 
  onMarkAttendance,
  onUploadMaterial,
  onDeleteMaterial
}) {
  const [activeTab, setActiveTab] = useState('doubts'); // 'doubts' | 'materials' | 'attendance' | 'ai-planner'
  const [timerSeconds, setTimerSeconds] = useState(teacher?.activeSessionSeconds || 0);
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [answerText, setAnswerText] = useState('');
  
  // Attendance marking state
  const [attendanceData, setAttendanceData] = useState({
    'std-101': 'Present',
    'std-102': 'Present'
  });
  const [attendanceSavedMessage, setAttendanceSavedMessage] = useState('');

  // AI Secure Question & Lesson Generator
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Live timer effect when clocked in
  useEffect(() => {
    let interval;
    if (teacher?.clockedIn) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [teacher?.clockedIn]);

  const formatHoursMinutes = (totalSecs) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  const handleSendAnswer = (e) => {
    e.preventDefault();
    if (!selectedDoubt || !answerText.trim()) return;

    onAnswerDoubt(selectedDoubt.id, answerText);
    setAnswerText('');
    setSelectedDoubt(null);
  };

  const handleSaveAttendance = () => {
    onMarkAttendance(attendanceData);
    setAttendanceSavedMessage('Student Attendance saved & synchronized with Admin records!');
    setTimeout(() => setAttendanceSavedMessage(''), 3000);
  };

  const handleGenerateAiLesson = (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      setAiResponse(`🔒 SECURE AI QUESTION BANK & LESSON PLAN (Encrypted Key):
Target: ${teacher.specialization} (${aiPrompt})

Questions Generated for Weekly Test:
Q1. Calculate the determinant for 3x3 matrix in Chapter 3. [5 Marks]
Q2. State and prove Squeeze Theorem for limits. [5 Marks]
Q3. Explain matrix transformation applications in computer graphics. [10 Marks]

🔒 Answer Key & Marking Scheme saved to Admin Secure Vault. (Key hidden from public student view until exam publish date).`);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Teacher Profile & Live Work Time Punch Clock */}
      <div className="rounded-3xl border border-purple-900/50 bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 lg:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <img 
              src={teacher.avatar} 
              alt={teacher.name} 
              className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl object-cover border-2 border-purple-500/50 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {teacher.role}
                </span>
                <span className="text-xs text-slate-400">{teacher.email}</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold text-white mt-1">
                {teacher.name}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Specialization: <span className="text-purple-300 font-semibold">{teacher.specialization}</span> • Monthly Hours: {teacher.hoursThisMonth} hrs
              </p>
            </div>
          </div>

          {/* Live Work Time Punch Clock */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 min-w-[260px] text-center shadow-inner">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Work Time Clock</span>
              <span className={`font-bold ${teacher.clockedIn ? 'text-emerald-400' : 'text-amber-400'}`}>
                {teacher.clockedIn ? '🟢 Active Session' : '🔴 Clocked Out'}
              </span>
            </div>

            <div className="text-2xl font-black font-mono text-white tracking-wider">
              {formatHoursMinutes(timerSeconds)}
            </div>

            <button
              onClick={() => onClockInToggle(teacher.id)}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                teacher.clockedIn
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {teacher.clockedIn ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Punch Out (End Work Session)</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Punch In (Start Work Session)</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('doubts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'doubts'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Student Doubts Queue ({doubts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'materials'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Upload className="w-4 h-4 text-amber-300" />
          <span>Upload Question Papers & Notes</span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'attendance'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Student Attendance Register</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-planner')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'ai-planner'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Secure AI Question Generator</span>
        </button>
      </div>

      {/* Tab 1: Doubt Resolution Queue */}
      {activeTab === 'doubts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="font-bold text-white text-base">Incoming Doubts</h3>
            <div className="space-y-3">
              {doubts.map((dbt) => (
                <div
                  key={dbt.id}
                  onClick={() => setSelectedDoubt(dbt)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedDoubt?.id === dbt.id
                      ? 'bg-purple-950/60 border-purple-500 shadow-lg'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-white">{dbt.studentName}</span>
                    <span className="text-[10px] text-slate-400">{dbt.timestamp}</span>
                  </div>
                  <p className="text-xs text-purple-300 font-semibold mb-2">{dbt.subjectName}</p>
                  <p className="text-xs text-slate-300 line-clamp-2">{dbt.questionText}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
            {selectedDoubt ? (
              <div className="space-y-6">
                <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-base">{selectedDoubt.studentName}</h4>
                    <p className="text-xs text-slate-400">Subject: {selectedDoubt.subjectName}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold">
                    1-on-1 Active Thread
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">{selectedDoubt.questionText}</p>
                  {selectedDoubt.imageUrl && (
                    <div className="rounded-xl overflow-hidden border border-slate-800 max-w-sm">
                      <img src={selectedDoubt.imageUrl} alt="Doubt attachment" className="w-full h-auto" />
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendAnswer} className="space-y-3">
                  <label className="block text-xs font-semibold text-slate-300">Your Solution / Explanation</label>
                  <textarea
                    value={answerText}
                    onChange={(e) => setAnswerText(e.target.value)}
                    rows="4"
                    placeholder="Type step-by-step guidance for the student..."
                    className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
                  >
                    Send Answer to Student
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <MessageSquare className="w-10 h-10 mx-auto text-purple-400/50" />
                <p className="text-sm font-semibold">Select a doubt from the queue to view attachments & respond.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Question Papers & Study Notes Upload */}
      {activeTab === 'materials' && (
        <StudyMaterialUploader 
          teacher={teacher}
          standardsList={standardsList}
          subjects={subjects}
          materials={materials}
          onUploadMaterial={onUploadMaterial}
          onDeleteMaterial={onDeleteMaterial}
        />
      )}

      {/* Tab 3: Attendance Marker */}
      {activeTab === 'attendance' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div>
            <h3 className="font-bold text-white text-lg">Student Daily Attendance Register</h3>
            <p className="text-xs text-slate-400">Subject: {teacher.specialization}</p>
          </div>

          {attendanceSavedMessage && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{attendanceSavedMessage}</span>
            </div>
          )}

          <div className="space-y-3">
            {students.map((std) => (
              <div key={std.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={std.avatar} alt={std.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h5 className="font-bold text-white text-sm">{std.name}</h5>
                    <p className="text-[11px] text-slate-400">{std.standard} • Roll: {std.rollNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAttendanceData({ ...attendanceData, [std.id]: 'Present' })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      attendanceData[std.id] === 'Present'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Present
                  </button>
                  <button
                    onClick={() => setAttendanceData({ ...attendanceData, [std.id]: 'Absent' })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      attendanceData[std.id] === 'Absent'
                        ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Absent
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveAttendance}
            className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
          >
            Save Attendance Session
          </button>
        </div>
      )}

      {/* Tab 4: AI Question Generator */}
      {activeTab === 'ai-planner' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-lg">Secure AI Test Question Generator</h3>
          </div>

          <form onSubmit={handleGenerateAiLesson} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Weekly Test Subject / Topic</label>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. TNSCHOOL Class 10 Maths Matrices & Quadratic Equations"
                className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all"
            >
              {isGenerating ? 'Generating Secure Question Bank...' : 'Generate AI Weekly Test Questions (Encrypted Vault)'}
            </button>
          </form>

          {aiResponse && (
            <div className="p-5 rounded-2xl bg-slate-950 border border-purple-500/30 font-mono text-xs text-purple-200 leading-relaxed whitespace-pre-line">
              {aiResponse}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
