import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, GraduationCap, BookOpen, Layers, FolderKanban, 
  FileText, ClipboardList, CalendarCheck, Award, Bell, Image as ImageIcon, 
  BarChart3, Bot, Settings, ChevronRight, Search, Filter, CheckCircle2, X,
  Menu, Upload, UserPlus, CreditCard, Tag, Plus, Trash2, ShieldCheck, DollarSign,
  Film, Play, ExternalLink, Edit3, Power
} from 'lucide-react';
import { extractYouTubeVideoId, getYouTubeThumbnailUrl, isValidYouTubeUrl } from '../../utils/youtubeUtils';

export default function AdminDashboard({ 
  centerInfo, 
  teachers = [], 
  students = [], 
  notices = [],
  materials = [],
  videoNotes = [],
  standardsList = [],
  coupons = [],
  onUploadVideoNote,
  onDeleteVideoNote
}) {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Video Notes Management State
  const [videoList, setVideoList] = useState(videoNotes.length > 0 ? videoNotes : [
    {
      id: "vnot-1",
      title: "Class 6 Science: Living World of Plants & Animals",
      description: "Learn fundamental biological concepts of plant cell structures, photosynthesis, and habitat classification.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeVideoId: "dQw4w9WgXcQ",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      standard: "Class 6",
      subject: "Science",
      chapter: "Living World",
      status: "Active",
      uploadedBy: "Dr. V. Malathi",
      createdAt: "2026-08-30"
    },
    {
      id: "vnot-2",
      title: "Class 6 Mathematics: Percentage & Ratio Basics",
      description: "Step-by-step introduction to computing percentages, converting ratios to fractions, and solving real-world word problems.",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      youtubeVideoId: "dQw4w9WgXcQ",
      thumbnailUrl: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
      standard: "Class 6",
      subject: "Mathematics",
      chapter: "Percentage Basics",
      status: "Active",
      uploadedBy: "Prof. K. Arumugam",
      createdAt: "2026-08-31"
    }
  ]);

  // Video Creator Form State
  const [videoTitle, setVideoTitle] = useState('');
  const [videoClass, setVideoClass] = useState('Class 6');
  const [videoSubject, setVideoSubject] = useState('Mathematics');
  const [videoChapter, setVideoChapter] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoStatus, setVideoStatus] = useState('Active');
  const [videoFormError, setVideoFormError] = useState('');

  // Fee & Coupon States
  const [classList, setClassList] = useState(standardsList.length > 0 ? standardsList : [
    { id: "std-6", name: "Class 6", description: "6th Standard TNSCHOOL Samacheer Kalvi", feeAmount: 150 },
    { id: "std-7", name: "Class 7", description: "7th Standard TNSCHOOL Samacheer Kalvi", feeAmount: 165 },
    { id: "std-8", name: "Class 8", description: "8th Standard TNSCHOOL Upper Primary", feeAmount: 180 },
    { id: "std-9", name: "Class 9", description: "9th Standard TNSCHOOL High School", feeAmount: 200 },
    { id: "std-10", name: "Class 10 (SSLC)", description: "10th Standard SSLC Public Exam", feeAmount: 250 },
    { id: "std-11", name: "Class 11 (HSC)", description: "11th Standard HSC Higher Secondary", feeAmount: 300 },
    { id: "std-12", name: "Class 12 (HSC)", description: "12th Standard HSC State Board Public", feeAmount: 350 }
  ]);

  const [couponList, setCouponList] = useState(coupons.length > 0 ? coupons : [
    { code: "EARLYBIRD50", discountPercent: 50, description: "50% Early Admission Discount" },
    { code: "APEX20", discountPercent: 20, description: "20% Academic Excellence Discount" }
  ]);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  // Modals & Notifications
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'video-notes', label: 'Video Notes', icon: Film },
    { id: 'students', label: 'Students', icon: GraduationCap },
    { id: 'teachers', label: 'Teachers', icon: Users },
    { id: 'fees-coupons', label: 'Fees & Coupons', icon: CreditCard },
    { id: 'classes', label: 'Classes', icon: BookOpen },
    { id: 'subjects', label: 'Subjects', icon: Layers },
    { id: 'materials', label: 'Study Materials', icon: FileText },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  // Video Form Submit Handler
  const handleAddVideoSubmit = (e) => {
    e.preventDefault();
    setVideoFormError('');

    if (!videoTitle.trim() || !videoUrl.trim()) {
      setVideoFormError('Please enter a video title and YouTube URL.');
      return;
    }

    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      setVideoFormError('Invalid YouTube URL format. Please provide a valid YouTube link (e.g. https://www.youtube.com/watch?v=...)');
      return;
    }

    const newVideoNote = {
      id: `vnot-${Date.now()}`,
      title: videoTitle.trim(),
      description: videoDesc.trim() || 'No description provided.',
      youtubeUrl: videoUrl.trim(),
      youtubeVideoId: videoId,
      thumbnailUrl: getYouTubeThumbnailUrl(videoId),
      standard: videoClass,
      subject: videoSubject,
      chapter: videoChapter.trim() || 'General',
      status: videoStatus,
      uploadedBy: 'Administrator',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setVideoList((prev) => [newVideoNote, ...prev]);
    if (onUploadVideoNote) onUploadVideoNote(newVideoNote);

    setActionSuccessMessage(`Video Note "${videoTitle}" published for ${videoClass}!`);
    setVideoTitle('');
    setVideoUrl('');
    setVideoChapter('');
    setVideoDesc('');
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

  const handleToggleVideoStatus = (id) => {
    setVideoList((prev) =>
      prev.map((v) => v.id === id ? { ...v, status: v.status === 'Active' ? 'Inactive' : 'Active' } : v)
    );
    setActionSuccessMessage('Video status updated!');
    setTimeout(() => setActionSuccessMessage(''), 3000);
  };

  const handleDeleteVideo = (id) => {
    setVideoList((prev) => prev.filter((v) => v.id !== id));
    if (onDeleteVideoNote) onDeleteVideoNote(id);
    setActionSuccessMessage('Video note deleted.');
    setTimeout(() => setActionSuccessMessage(''), 3000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-100px)]">
      
      {/* Mobile Menu Bar */}
      <div className="lg:hidden bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <span className="font-bold text-white text-sm">Admin Control Panel</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-xl bg-slate-800 text-slate-200">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`lg:w-64 bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-6 shrink-0 ${
        mobileMenuOpen ? 'block' : 'hidden lg:block'
      }`}>
        <div className="px-3 py-2 border-b border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Academy Control</span>
          <h2 className="text-base font-extrabold text-white">Admin Portal</h2>
        </div>

        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveMenu(item.id);
                  setMobileMenuOpen(false);
                  setSearchQuery('');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold text-xs transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-6 overflow-x-hidden">
        
        {/* Global Toast */}
        {actionSuccessMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{actionSuccessMessage}</span>
            </div>
            <button onClick={() => setActionSuccessMessage('')}><X className="w-4 h-4" /></button>
          </div>
        )}

        {/* 1. DASHBOARD OVERVIEW */}
        {activeMenu === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">Total Students</span>
                  <GraduationCap className="w-5 h-5 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{students.length}</h3>
                <p className="text-[10px] text-emerald-400 font-medium">Class 6 to 12 Active</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">Video Notes</span>
                  <Film className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{videoList.length}</h3>
                <p className="text-[10px] text-indigo-300 font-medium">YouTube Lectures Active</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">Faculty Staff</span>
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{teachers.length}</h3>
                <p className="text-[10px] text-indigo-300 font-medium">Subject Specialists</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold">Active Coupons</span>
                  <Tag className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-extrabold text-white">{couponList.length} Active</h3>
                <p className="text-[10px] text-emerald-400 font-medium">Discount Promo Codes</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                <button onClick={() => setActiveMenu('video-notes')} className="p-3.5 rounded-2xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 text-xs font-bold flex flex-col items-center justify-center space-y-2">
                  <Film className="w-5 h-5 text-rose-400" />
                  <span>Upload Video Notes</span>
                </button>
                <button onClick={() => setActiveMenu('fees-coupons')} className="p-3.5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex flex-col items-center justify-center space-y-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>Fees & Coupons</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. VIDEO NOTES MANAGEMENT PANEL */}
        {activeMenu === 'video-notes' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-extrabold text-white">Video Notes Manager (YouTube Link System)</h3>
                <p className="text-xs text-slate-400">Publish video lectures with YouTube URLs for specific class standards and subjects.</p>
              </div>
            </div>

            {/* Video Upload Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
              <h4 className="font-bold text-white text-base flex items-center space-x-2">
                <Film className="w-5 h-5 text-rose-400" />
                <span>Publish New Video Lecture</span>
              </h4>

              <form onSubmit={handleAddVideoSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 uppercase">Video Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Percentage & Ratio Basics"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 uppercase">YouTube URL *</label>
                    <input
                      type="url"
                      required
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 uppercase">Target Class *</label>
                    <select
                      value={videoClass}
                      onChange={(e) => setVideoClass(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      <option>Class 6</option>
                      <option>Class 7</option>
                      <option>Class 8</option>
                      <option>Class 9</option>
                      <option>Class 10 (SSLC)</option>
                      <option>Class 11 (HSC)</option>
                      <option>Class 12 (HSC)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 uppercase">Subject *</label>
                    <select
                      value={videoSubject}
                      onChange={(e) => setVideoSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    >
                      <option>Mathematics</option>
                      <option>Science</option>
                      <option>English</option>
                      <option>Tamil</option>
                      <option>Social Science</option>
                      <option>Physics</option>
                      <option>Chemistry</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1 uppercase">Chapter / Topic</label>
                    <input
                      type="text"
                      placeholder="e.g. Chapter 3: Percentage"
                      value={videoChapter}
                      onChange={(e) => setVideoChapter(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase">Short Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief outline of concepts covered in this video..."
                    value={videoDesc}
                    onChange={(e) => setVideoDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  ></textarea>
                </div>

                {videoFormError && <p className="text-xs text-rose-400">{videoFormError}</p>}

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold flex items-center space-x-2 shadow-lg shadow-rose-600/30"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Video Note</span>
                </button>
              </form>
            </div>

            {/* Video Notes List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <h4 className="font-bold text-white text-base">Published Video Notes ({videoList.length})</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videoList.map((vid) => (
                  <div key={vid.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3">
                    <div className="flex space-x-3">
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-24 h-16 object-cover rounded-xl shrink-0" />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">{vid.standard}</span>
                          <span className="text-[10px] text-slate-400">{vid.subject}</span>
                        </div>
                        <h5 className="font-bold text-white text-xs leading-snug line-clamp-1">{vid.title}</h5>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{vid.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => handleToggleVideoStatus(vid.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 ${
                          vid.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        <Power className="w-3 h-3" />
                        <span>{vid.status}</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <a href={vid.youtubeUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button onClick={() => handleDeleteVideo(vid.id)} className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 3. OTHER SUBPAGES */}
        {['students', 'teachers', 'fees-coupons', 'classes', 'subjects', 'materials', 'notices', 'settings'].includes(activeMenu) && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl text-slate-300">
            <div className="flex items-center space-x-3 text-indigo-400">
              <span className="capitalize font-bold text-xl text-white">{activeMenu.replace('-', ' ')} Control</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Managing non-technical administration tools for <strong className="text-white capitalize">{activeMenu.replace('-', ' ')}</strong>.
            </p>
          </div>
        )}

      </main>

    </div>
  );
}
