import React, { useState } from 'react';
import { X, Shield, GraduationCap, UserCheck, Lock, Key, AlertCircle, CheckCircle2, Send } from 'lucide-react';

export default function LoginPortalModal({ isOpen, onClose, onLoginSuccess, onRequestPasswordReset }) {
  const [activeTab, setActiveTab] = useState('student'); // 'student' | 'teacher' | 'admin'
  
  // Form states initialized with requested user credentials!
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [resetReason, setResetReason] = useState('');
  const [showResetRequest, setShowResetRequest] = useState(false);
  const [requestSentMessage, setRequestSentMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (activeTab === 'student') {
      const email = userId || 'student1@ndt.com';
      onLoginSuccess('student', { id: 'std-101', name: 'Naveen S (Student)', role: 'Student', email });
      onClose();
    } else if (activeTab === 'teacher') {
      const email = userId || 'teacher1@ndt.com';
      onLoginSuccess('teacher', { id: 'tch-1', name: 'Prof. K. Arumugam (Faculty)', role: 'Teacher', email });
      onClose();
    } else {
      const email = userId || 'naveenpanneerselvam78@gmail.com';
      onLoginSuccess('admin', { id: 'adm-01', name: 'Naveen Panneerselvam (Admin)', role: 'Admin', email });
      onClose();
    }
  };

  const handleSendResetRequest = (e) => {
    e.preventDefault();
    const idToUse = userId || (activeTab === 'student' ? 'student1@ndt.com' : 'teacher1@ndt.com');
    onRequestPasswordReset({
      userId: idToUse,
      userType: activeTab === 'student' ? 'Student' : 'Teacher',
      reason: resetReason || 'User requested credential reset via login portal'
    });
    setRequestSentMessage(`Password reset request submitted to Admin (naveenpanneerselvam78@gmail.com) for ${idToUse}!`);
    setResetReason('');
    setShowResetRequest(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-slate-100 text-base">NDT Academy Portal Sign In</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800/80 mb-6">
            <button
              onClick={() => {
                setActiveTab('student');
                setShowResetRequest(false);
                setErrorMessage('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                activeTab === 'student'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('teacher');
                setShowResetRequest(false);
                setErrorMessage('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                activeTab === 'teacher'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Teacher</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setShowResetRequest(false);
                setErrorMessage('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1.5 transition-all ${
                activeTab === 'admin'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>

          {/* Success Banner */}
          {requestSentMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{requestSentMessage}</span>
            </div>
          )}

          {!showResetRequest ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {activeTab === 'student' ? 'Student ID / Email' : activeTab === 'teacher' ? 'Faculty ID / Email' : 'Admin Username / Email'}
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={
                    activeTab === 'student'
                      ? 'student1@ndt.com'
                      : activeTab === 'teacher'
                      ? 'teacher1@ndt.com'
                      : 'naveenpanneerselvam78@gmail.com'
                  }
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <p className="text-[11px] text-indigo-400 mt-1 font-mono">
                  Default ID: {activeTab === 'student' ? 'student1@ndt.com' : activeTab === 'teacher' ? 'teacher1@ndt.com' : 'naveenpanneerselvam78@gmail.com'}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Password</label>
                  {activeTab !== 'admin' && (
                    <button
                      type="button"
                      onClick={() => setShowResetRequest(true)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Forgot / Request Password Reset?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Admin Security Notice */}
              {activeTab !== 'admin' && (
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Governed Security Notice</span>
                  </div>
                  <p>
                    Passwords for students and faculty are set by Admin (<span className="text-rose-400 font-bold">naveenpanneerselvam78@gmail.com</span>). Reset requests are processed exclusively by Admin.
                  </p>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all ${
                  activeTab === 'student'
                    ? 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                    : activeTab === 'teacher'
                    ? 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30'
                    : 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                }`}
              >
                Sign In as {activeTab.toUpperCase()}
              </button>
            </form>
          ) : (
            /* Reset Request Form */
            <form onSubmit={handleSendResetRequest} className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-200 text-xs">
                <p className="font-semibold mb-1">Request Credential Reset</p>
                <p className="text-slate-300 text-[11px]">
                  Request will be routed to Admin <span className="font-bold text-white">Naveen Panneerselvam</span> for approval.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Registered Email / ID</label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={activeTab === 'student' ? 'student1@ndt.com' : 'teacher1@ndt.com'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Reason for Request</label>
                <textarea
                  value={resetReason}
                  onChange={(e) => setResetReason(e.target.value)}
                  rows="3"
                  placeholder="e.g. Lost device, or request new default password"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-indigo-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetRequest(false)}
                  className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Request to Admin</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
