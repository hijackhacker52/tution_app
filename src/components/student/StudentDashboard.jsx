import React, { useState } from 'react';
import { 
  BookOpen, Folder, MessageSquare, Award, Clock, FileText, Download, 
  ChevronRight, Sparkles, CheckCircle2, Lock, Tag, DollarSign, CreditCard, 
  ShieldCheck, Check, CalendarCheck, ClipboardList, User, LogOut, Bell, Bot, Layers
} from 'lucide-react';

export default function StudentDashboard({ 
  student = {}, 
  standardsList = [],
  subjects = [], 
  materials = [],
  coupons = [],
  onOpenExam, 
  onOpenIdeasLab,
  onLogout 
}) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'subjects' | 'materials' | 'assignments' | 'attendance' | 'results' | 'notices' | 'ai-assistant' | 'profile' | 'payment'

  // Student assigned plan data
  const studentId = student.studentId || student.rollNo || 'STU0001';
  const assignedClass = student.standard || 'Class 6';
  const assignedPlan = `${assignedClass} Standard Plan`;

  // Fee state
  const enrolledStandardObj = standardsList.find(s => s.name === assignedClass) || { name: assignedClass, feeAmount: 1000 };
  const baseFee = enrolledStandardObj.feeAmount || 1000;
  const [feePaid, setFeePaid] = useState(student.feePaid || false);
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');

  // Calculations
  const finalFee = Math.max(0, Math.round(baseFee - (baseFee * discountPercent) / 100));

  // Filter content strictly for assigned class
  const classSubjects = subjects.filter(s => s.standard === assignedClass);
  const classMaterials = materials.filter(m => m.standard === assignedClass);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponMsg('');
    if (!couponCode.trim()) return;

    const code = couponCode.trim().toUpperCase();
    if (code === 'EARLYBIRD50') {
      setDiscountPercent(50);
      setCouponMsg('Coupon EARLYBIRD50 Applied: 50% OFF!');
    } else if (code === 'APEX20') {
      setDiscountPercent(20);
      setCouponMsg('Coupon APEX20 Applied: 20% OFF!');
    } else if (code === 'SCHOLAR100') {
      setDiscountPercent(100);
      setCouponMsg('Scholarship Coupon Applied: 100% OFF!');
    } else {
      setCouponMsg(`Invalid code "${code}". Try EARLYBIRD50`);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: BookOpen },
    { id: 'subjects', label: 'Subjects', icon: Layers },
    { id: 'materials', label: 'Materials', icon: FileText },
    { id: 'assignments', label: 'Assignments', icon: ClipboardList },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'results', label: 'Results', icon: Award },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'payment', label: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans">
      
      {/* Minimal Student Top Navigation Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-3 shadow-xl border border-slate-800 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* 1. HOME TAB / SIMPLE STUDENT DASHBOARD (Requirement 18) */}
      {activeTab === 'home' && (
        <div className="space-y-8">
          
          {/* Header Card */}
          <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-8 rounded-3xl border border-indigo-800/40 shadow-xl space-y-3">
            <div className="flex flex-wrap items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <span>Student ID: {studentId}</span>
              <span>•</span>
              <span>{assignedClass}</span>
              <span>•</span>
              <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">{student.board || 'Tamil Nadu State Board'}</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Good morning, {student.name || 'Student'} 👋
            </h1>
            <p className="text-xs text-indigo-200">
              Assigned Academic Year 2026-2027 • Standard Plan Active
            </p>
          </div>

          {/* YOUR LEARNING (Grid Cards) */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-lg">YOUR LEARNING</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <button
                onClick={() => setActiveTab('subjects')}
                className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">📚 Subjects</h4>
                  <p className="text-xs text-gray-500">{classSubjects.length} Assigned</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('assignments')}
                className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">📝 Assignments</h4>
                  <p className="text-xs text-gray-500">2 Pending</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">📖 Materials</h4>
                  <p className="text-xs text-gray-500">{classMaterials.length} Documents</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <CalendarCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">📅 Attendance</h4>
                  <p className="text-xs text-gray-500">{student.attendanceRate || 92}% Present</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('results')}
                className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all text-left space-y-3 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:bg-pink-600 group-hover:text-white transition-colors">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">🏆 Results</h4>
                  <p className="text-xs text-gray-500">Recent: 82%</p>
                </div>
              </button>
            </div>
          </div>

          {/* QUICK INFO BAR */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="font-bold text-xs uppercase tracking-wider text-indigo-400">Quick Info Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Attendance Rate</span>
                <span className="text-lg font-extrabold text-emerald-400">{student.attendanceRate || 92}%</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Pending Homework</span>
                <span className="text-lg font-extrabold text-amber-400">2 Assignments</span>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Recent Test Score</span>
                <span className="text-lg font-extrabold text-indigo-300">Mathematics — 82%</span>
              </div>
            </div>
          </div>

          {/* AI STUDY ASSISTANT & NOTICES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* AI Assistant Banner */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-purple-800/40 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-pink-400">
                  <Bot className="w-5 h-5" />
                  <span className="font-bold text-xs uppercase">AI Study Assistant</span>
                </div>
                <h4 className="font-extrabold text-lg">Need Help With Your {assignedClass} Homework?</h4>
                <p className="text-xs text-purple-200">
                  Ask the AI assistant step-by-step explanations, revision formulas, and practice questions.
                </p>
              </div>

              <button
                onClick={() => setActiveTab('ai-assistant')}
                className="bg-white text-purple-950 font-bold px-6 py-3 rounded-xl text-xs hover:bg-purple-50 transition-all flex items-center justify-center space-x-2 shadow-md"
              >
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Ask AI Assistant</span>
              </button>
            </div>

            {/* Payment Summary Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Plan Payment Status</span>
                <h4 className="font-bold text-xl text-slate-900">{assignedPlan}</h4>
                <p className="text-xs text-gray-500">Total Plan Fee: ₹{baseFee}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  feePaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {feePaid ? 'Paid' : 'Pending Payment'}
                </span>

                <button
                  onClick={() => setActiveTab('payment')}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View Payment Details →
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. SUBJECTS TAB */}
      {activeTab === 'subjects' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{assignedClass} Assigned Subjects</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">My Subject Folders</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classSubjects.map((subj) => (
              <div key={subj.code} className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 space-y-3">
                <img src={subj.imagePresentation} alt={subj.name} className="w-full h-32 object-cover rounded-xl" />
                <span className="text-[10px] font-bold text-indigo-600 uppercase">{subj.code}</span>
                <h4 className="font-bold text-slate-900 text-base">{subj.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{subj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. MATERIALS TAB */}
      {activeTab === 'materials' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">{assignedClass} Documents</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Study Materials</h2>
          </div>

          {classMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {classMaterials.map((mat) => (
                <div key={mat.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{mat.title}</h4>
                      <p className="text-xs text-gray-500">{mat.subject} • {mat.fileName}</p>
                    </div>
                  </div>
                  <a href={mat.downloadUrl || '#'} target="_blank" rel="noopener noreferrer" className="bg-indigo-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg">
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-gray-500 py-6 text-center">No study materials published for {assignedClass} yet.</p>
          )}
        </div>
      )}

      {/* 4. PAYMENT TAB */}
      {activeTab === 'payment' && (
        <div className="bg-white p-8 rounded-3xl border border-gray-200/80 shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="border-b border-gray-100 pb-4 text-center">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Tuition Plan</span>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1">{assignedPlan}</h2>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Standard Plan Fee:</span>
              <span className="font-bold text-slate-900">₹{baseFee}</span>
            </div>

            <form onSubmit={handleApplyCoupon} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Enter Coupon Code (e.g. EARLYBIRD50)"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" className="bg-slate-900 text-white font-bold text-xs px-4 py-2 rounded-xl">
                Apply Code
              </button>
            </form>

            {couponMsg && <p className="text-xs text-indigo-600 font-semibold">{couponMsg}</p>}

            <div className="border-t border-gray-200 pt-4 flex justify-between text-base font-extrabold text-slate-900">
              <span>Final Amount Due:</span>
              <span className="text-emerald-600">₹{finalFee}</span>
            </div>
          </div>

          <button
            onClick={() => { setFeePaid(true); setCouponMsg('Payment verified for academic year 2026-2027!'); }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-md"
          >
            {feePaid ? 'Fee Paid ✓' : `Confirm Payment (₹${finalFee})`}
          </button>
        </div>
      )}

      {/* 5. AI ASSISTANT TAB */}
      {activeTab === 'ai-assistant' && (
        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center space-x-3 text-pink-400">
            <Bot className="w-6 h-6" />
            <h2 className="text-2xl font-extrabold text-white">AI Study Assistant</h2>
          </div>
          <p className="text-xs text-slate-400">
            Ask any question regarding {assignedClass} Mathematics, Science, English, or Tamil!
          </p>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 min-h-[200px] flex items-center justify-center text-xs text-slate-500">
            AI Assistant is ready. Enter your question to receive step-by-step tutoring.
          </div>
        </div>
      )}

    </div>
  );
}
