import React, { useState } from 'react';
import { 
  Home as HomeIcon, FileText, Layers, Phone, MessageSquare, User, 
  Sparkles, Clock, CheckCircle2, Lock, Download, AlertCircle, PhoneCall, 
  Video, Mic, MicOff, Volume2, X, ChevronRight, Send, ArrowLeft, ShieldAlert,
  Users, Mail, Award, CalendarCheck, BookOpen, Play, Search, Filter, ExternalLink,
  Film
} from 'lucide-react';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl } from '../../utils/youtubeUtils';

export default function ClassLearningSpace({ 
  student = {}, 
  standardsList = [], 
  subjects = [], 
  materials = [], 
  videoNotes = [],
  teachers = [],
  notices = [],
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'notes' | 'subjects' | 'contact' | 'call' | 'chat'
  
  // Security Checks: Get student's assigned class & student ID
  const studentId = student.studentId || student.rollNo || 'STU0001';
  const assignedClass = student.standard || 'Class 6';

  // Notes Sub-tab: 'study-notes' | 'video-notes'
  const [notesSubTab, setNotesSubTab] = useState('study-notes');
  const [selectedSubjectFolder, setSelectedSubjectFolder] = useState(null);

  // Video Notes Filters & Search
  const [videoSearchQuery, setVideoSearchQuery] = useState('');
  const [videoSelectedSubject, setVideoSelectedSubject] = useState('all');
  const [activePlaybackVideo, setActivePlaybackVideo] = useState(null); // Embedded player modal

  // Call UI State
  const [activeCall, setActiveCall] = useState(null); // null | { type: 'audio' | 'video', name, subject }
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'teacher', text: 'Hello! Welcome to your Class 6 Learning Space.', time: '10:00 AM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Authorized Content Filtering
  const classSubjects = subjects.filter(s => s.standard === assignedClass);
  const classMaterials = materials.filter(m => m.standard === assignedClass);

  // STRICT RULE: Video Notes MUST be filtered strictly for student's assigned class & active status
  const classVideoNotes = (videoNotes.length > 0 ? videoNotes : [
    {
      id: "vnot-1",
      title: `${assignedClass} Science: Living World & Ecosystems`,
      description: "Learn fundamental biological concepts of plant cell structures, photosynthesis, and habitat classification.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeVideoId: "dQw4w9WgXcQ",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      standard: assignedClass,
      subject: "Science (அறிவியல்)",
      chapter: "Living World",
      status: "Active",
      uploadedBy: "Dr. V. Malathi",
      createdAt: "2026-08-30"
    },
    {
      id: "vnot-2",
      title: `${assignedClass} Mathematics: Percentage & Ratio Fundamentals`,
      description: "Step-by-step introduction to computing percentages, converting ratios to fractions, and solving real-world word problems.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeVideoId: "dQw4w9WgXcQ",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      standard: assignedClass,
      subject: "Mathematics (கணிதம்)",
      chapter: "Percentage Basics",
      status: "Active",
      uploadedBy: "Prof. K. Arumugam",
      createdAt: "2026-08-31"
    }
  ]).filter(v => v.standard === assignedClass && (v.status === 'Active' || !v.status));

  // Search & Filter Video Notes
  const filteredVideoNotes = classVideoNotes.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
                          v.description.toLowerCase().includes(videoSearchQuery.toLowerCase()) ||
                          (v.chapter && v.chapter.toLowerCase().includes(videoSearchQuery.toLowerCase()));
    const matchesSubject = videoSelectedSubject === 'all' || v.subject.includes(videoSelectedSubject);
    return matchesSearch && matchesSubject;
  });

  // Call Logs Mock Dataset
  const [callHistory] = useState([
    { id: 'c1', person: 'Prof. K. Arumugam (Mathematics)', type: 'Incoming', time: 'Today, 5:30 PM', duration: '12 min', status: 'Completed' },
    { id: 'c2', person: 'Dr. V. Malathi (Science)', type: 'Outgoing', time: 'Yesterday, 7:10 PM', duration: '5 min', status: 'Completed' },
    { id: 'c3', person: 'Academic Support', type: 'Missed', time: 'Aug 29, 11:15 AM', duration: '0 min', status: 'Missed' }
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { sender: 'student', text: chatInput.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  const navTabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'subjects', label: 'Subjects', icon: Layers },
    { id: 'contact', label: 'Contact', icon: User },
    { id: 'call', label: 'Call', icon: Phone },
    { id: 'chat', label: 'Chat', icon: MessageSquare }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-16">
      
      {/* Horizontal Class Learning Space Menu Bar */}
      <header className="bg-slate-900 text-white rounded-3xl p-3 shadow-xl border border-slate-800 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1.5">
          <div className="px-3.5 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 font-extrabold text-xs border border-indigo-500/30 uppercase tracking-wider mr-2 shrink-0">
            {assignedClass} Space
          </div>
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSelectedSubjectFolder(null);
                }}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <span>Logout</span>
          </button>
        )}
      </header>

      {/* 1. CLASS HOME TAB */}
      {activeTab === 'home' && (
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white p-8 rounded-3xl border border-indigo-900/50 shadow-xl space-y-3">
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <span>Student ID: {studentId}</span>
              <span>•</span>
              <span>{assignedClass} Learning Space</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Welcome, {student.name || 'Student'} 👋
            </h1>
            <p className="text-xs text-indigo-200">
              Access your assigned class notes, video lectures, subjects, contacts, calls, and chat tutor.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Quick Access Cards</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {navTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left space-y-3 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{tab.label}</h4>
                      <p className="text-[10px] text-gray-500">{assignedClass} Access</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. NOTES TAB (STUDY NOTES & VIDEO NOTES SUB-TABS) */}
      {activeTab === 'notes' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
          
          {/* Notes Sub-Tab Switcher Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{assignedClass} Learning Vault</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Class Study Repository</h2>
            </div>

            <div className="flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200">
              <button
                onClick={() => setNotesSubTab('study-notes')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  notesSubTab === 'study-notes'
                    ? 'bg-white text-indigo-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>📄 Study Notes</span>
              </button>

              <button
                onClick={() => setNotesSubTab('video-notes')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  notesSubTab === 'video-notes'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>🎥 Video Notes</span>
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: STUDY NOTES (PDFs & Documents) */}
          {notesSubTab === 'study-notes' && (
            <div className="space-y-6">
              {!selectedSubjectFolder ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {classSubjects.map((subj) => (
                    <button
                      key={subj.code}
                      onClick={() => setSelectedSubjectFolder(subj.name)}
                      className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all text-left space-y-3 group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        📘
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase">{subj.code}</span>
                        <h4 className="font-bold text-slate-900 text-base">{subj.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Click to view chapter notes</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-lg">📄 {selectedSubjectFolder} Notes</h3>
                    <button onClick={() => setSelectedSubjectFolder(null)} className="text-xs font-bold text-indigo-600 hover:underline">
                      ← All Subject Folders
                    </button>
                  </div>
                  {classMaterials.length > 0 ? (
                    <div className="space-y-3">
                      {classMaterials.map((mat) => (
                        <div key={mat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-3">
                            <FileText className="w-6 h-6 text-indigo-600 shrink-0" />
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{mat.title}</h4>
                              <p className="text-gray-500">{mat.subject} • Uploaded by {mat.uploadedBy}</p>
                            </div>
                          </div>
                          <a href={mat.downloadUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1">
                            <Download className="w-3.5 h-3.5" />
                            <span>View</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 py-6 text-center">No documents uploaded for {selectedSubjectFolder} yet.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 2: VIDEO NOTES (YouTube Link System) */}
          {notesSubTab === 'video-notes' && (
            <div className="space-y-6">
              
              {/* Search & Subject Filter Bar */}
              <div className="bg-slate-900 p-4 rounded-2xl text-white flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search video lectures, topics..."
                    value={videoSearchQuery}
                    onChange={(e) => setVideoSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center space-x-2 w-full md:w-auto">
                  <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                  <select
                    value={videoSelectedSubject}
                    onChange={(e) => setVideoSelectedSubject(e.target.value)}
                    className="w-full md:w-auto px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none"
                  >
                    <option value="all">All {assignedClass} Subjects</option>
                    {classSubjects.map((s) => (
                      <option key={s.code} value={s.name.split(' ')[0]}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Video Cards Grid */}
              {filteredVideoNotes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {filteredVideoNotes.map((vid) => {
                    const videoId = vid.youtubeVideoId || extractYouTubeVideoId(vid.youtubeUrl);
                    const thumbnail = vid.thumbnailUrl || getYouTubeThumbnailUrl(videoId);

                    return (
                      <div 
                        key={vid.id}
                        className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl hover:shadow-2xl hover:border-indigo-500/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Thumbnail Container with Play Overlay */}
                          <div className="relative h-48 sm:h-52 bg-slate-950 group cursor-pointer" onClick={() => setActivePlaybackVideo(vid)}>
                            <img 
                              src={thumbnail} 
                              alt={vid.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 fill-white ml-1" />
                              </div>
                            </div>
                            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-500/30">
                              {vid.chapter || 'Lecture'}
                            </div>
                          </div>

                          {/* Video Info */}
                          <div className="p-5 space-y-2">
                            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{vid.subject}</span>
                            <h4 className="font-extrabold text-white text-base leading-snug">{vid.title}</h4>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{vid.description}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-5 pt-0 flex items-center space-x-2">
                          <button
                            onClick={() => setActivePlaybackVideo(vid)}
                            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-600/30 transition-all"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            <span>▶ Watch Video</span>
                          </button>

                          <a
                            href={vid.youtubeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                            title="Open on YouTube"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 text-xs space-y-2">
                  <Film className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="font-bold text-white">No Video Notes Found</p>
                  <p className="text-[11px] text-slate-500">No active YouTube video notes uploaded for {assignedClass} {videoSelectedSubject !== 'all' ? `(${videoSelectedSubject})` : ''} yet.</p>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* 3. SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{assignedClass} Curriculum</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Assigned Class Subjects</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classSubjects.map((subj) => (
              <div key={subj.code} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4">
                <img src={subj.imagePresentation} alt={subj.name} className="w-full h-36 object-cover rounded-xl" />
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase">{subj.code}</span>
                  <h4 className="font-bold text-slate-900 text-lg">{subj.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{subj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CONTACT TAB */}
      {activeTab === 'contact' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{assignedClass} Official Contacts</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Academic Contacts & Teachers</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teachers.map((tch) => (
              <div key={tch.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={tch.avatar} alt={tch.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{tch.name}</h4>
                    <p className="text-xs text-gray-500">{tch.role}</p>
                    <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block">
                      {tch.specialization}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button onClick={() => setActiveCall({ type: 'audio', name: tch.name, subject: tch.specialization })} className="px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call</span>
                  </button>
                  <button onClick={() => setActiveTab('chat')} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center space-x-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. CALL TAB */}
      {activeTab === 'call' && (
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Audio & Video Calls</span>
              <h2 className="text-2xl font-extrabold text-white mt-1">Authorized Call Center</h2>
            </div>

            <div className="flex space-x-2">
              <button onClick={() => setActiveCall({ type: 'audio', name: 'Prof. K. Arumugam', subject: 'Mathematics' })} className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5">
                <PhoneCall className="w-4 h-4" />
                <span>Audio Call</span>
              </button>
              <button onClick={() => setActiveCall({ type: 'video', name: 'Dr. V. Malathi', subject: 'Science' })} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5">
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase text-slate-400 tracking-wider">Call History</h3>
            <div className="space-y-2.5">
              {callHistory.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">{c.person}</p>
                    <p className="text-[10px] text-slate-400">{c.type} • {c.time}</p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${c.status === 'Completed' ? 'text-emerald-400' : 'text-rose-400'}`}>{c.status}</span>
                    <p className="text-[10px] text-slate-500">{c.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. CHAT TAB */}
      {activeTab === 'chat' && (
        <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center space-x-2 text-indigo-400">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-xl font-extrabold text-white">{assignedClass} Doubt Clearance Chat</h2>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 space-y-4 min-h-[300px] flex flex-col justify-between">
            <div className="space-y-3 overflow-y-auto max-h-[350px]">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.sender === 'student' ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs max-w-sm ${msg.sender === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-200 border border-slate-800'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1">{msg.time}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 pt-2 border-t border-slate-800">
              <input
                type="text"
                placeholder="Ask your teacher a doubt..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center space-x-1">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* EMBEDDED YOUTUBE VIDEO PLAYBACK MODAL */}
      {activePlaybackVideo && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{activePlaybackVideo.subject} • {activePlaybackVideo.chapter}</span>
                <h3 className="text-lg font-extrabold text-white">{activePlaybackVideo.title}</h3>
              </div>
              <button onClick={() => setActivePlaybackVideo(null)} className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Responsive iFrame Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(activePlaybackVideo.youtubeUrl)}?autoplay=1`}
                title={activePlaybackVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <p>{activePlaybackVideo.description}</p>
              <a 
                href={activePlaybackVideo.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-rose-600 text-white font-bold px-4 py-2 rounded-xl flex items-center space-x-1 shrink-0 ml-4"
              >
                <span>Open in YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE CALL MODAL (Audio & Video Stubs) */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
            <div className="w-20 h-20 rounded-full bg-indigo-600 text-white mx-auto flex items-center justify-center animate-pulse">
              {activeCall.type === 'video' ? <Video className="w-10 h-10" /> : <PhoneCall className="w-10 h-10" />}
            </div>

            <div>
              <span className="text-xs text-indigo-400 font-bold uppercase">{activeCall.type === 'video' ? 'Free Video Call' : 'Free Audio Call'}</span>
              <h3 className="text-2xl font-extrabold text-white mt-1">{activeCall.name}</h3>
              <p className="text-xs text-slate-400">{activeCall.subject} Specialist</p>
            </div>

            <div className="flex justify-center space-x-4">
              <button onClick={() => setIsMuted(!isMuted)} className={`p-3 rounded-full ${isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button onClick={() => setIsSpeakerOn(!isSpeakerOn)} className={`p-3 rounded-full ${isSpeakerOn ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                <Volume2 className="w-5 h-5" />
              </button>
              <button onClick={() => setActiveCall(null)} className="p-3 rounded-full bg-rose-600 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
