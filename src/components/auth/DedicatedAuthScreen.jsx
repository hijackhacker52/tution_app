import React, { useState } from 'react';
import { 
  Lock, GraduationCap, UserCheck, Shield, Key, Send, AlertCircle, 
  CheckCircle2, User, Eye, EyeOff, Sparkles, ArrowLeft, Loader2, RefreshCw
} from 'lucide-react';
import { authService } from '../../services/authService';

export default function DedicatedAuthScreen({ onClose, onLoginSuccess }) {
  const [activeRole, setActiveRole] = useState('student'); // 'student' | 'teacher' | 'admin'
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'forgot' | 'recovery'
  
  // Login Form State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);
  
  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Password Recovery State
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Pre-fill demo credentials for user convenience
  const handleRoleTabChange = (role) => {
    setActiveRole(role);
    setErrorMessage('');
    setSuccessMessage('');
    if (role === 'student') {
      const students = authService.getRegisteredStudents();
      if (students && students.length > 0) {
        setEmailInput(students[0].email || students[0].studentId || '');
        setPasswordInput('Student1#2026');
      } else {
        setEmailInput('');
        setPasswordInput('');
      }
    } else if (role === 'teacher') {
      const teachers = authService.getRegisteredTeachers();
      if (teachers && teachers.length > 0) {
        setEmailInput(teachers[0].email || teachers[0].id || '');
        setPasswordInput('Teacher1#2026');
      } else {
        setEmailInput('');
        setPasswordInput('');
      }
    } else {
      setEmailInput('naveenpanneerselvam78@gmail.com');
      setPasswordInput('Admin#2026!');
    }
  };

  // Submit Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!emailInput.trim()) {
      setErrorMessage('Please enter your registered email address or User ID.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { user, role, error } = await authService.login(emailInput, passwordInput, activeRole);

      if (error) {
        setErrorMessage(error);
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(`Login successful! Redirecting to ${role.toUpperCase()} Dashboard...`);
      setTimeout(() => {
        setIsSubmitting(false);
        onLoginSuccess(user, role);
      }, 600);
    } catch (err) {
      setErrorMessage('An unexpected error occurred during login. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Submit Forgot Password / Account Recovery Request
  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!recoveryEmail.trim()) {
      setErrorMessage('Please provide your registered email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await authService.requestPasswordReset(recoveryEmail);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      setErrorMessage(result.message || 'Failed to dispatch reset request. Contact support.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden relative my-8">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-purple-950 to-slate-900 p-6 text-center relative border-b border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors flex items-center gap-1 text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Website</span>
          </button>

          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-3">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">கற்றல் மையம் (Learning Hub)</h2>
          <p className="text-xs text-indigo-200 mt-1">Management Platform & Student Portal</p>
        </div>

        {/* Role Selector Tabs */}
        {authMode === 'login' && (
          <div className="grid grid-cols-3 bg-slate-950 p-1.5 border-b border-slate-800">
            {[
              { id: 'student', label: 'Student', icon: GraduationCap },
              { id: 'teacher', label: 'Teacher', icon: UserCheck },
              { id: 'admin', label: 'Admin', icon: Shield }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeRole === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleRoleTabChange(tab.id)}
                  className={`flex items-center justify-center space-x-1.5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  {activeRole === 'student' ? 'Student Email / Roll No *' : activeRole === 'teacher' ? 'Faculty Email / ID *' : 'Admin Email *'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder={
                      activeRole === 'student' ? 'e.g. student@academy.com or Student ID' :
                      activeRole === 'teacher' ? 'e.g. teacher@academy.com or Teacher ID' :
                      'naveenpanneerselvam78@gmail.com'
                    }
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Password *</label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberSession}
                    onChange={(e) => setRememberSession(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember my session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to {activeRole.toUpperCase()} Dashboard</span>
                  </>
                )}
              </button>

              {/* Admin Recovery Hint */}
              {activeRole === 'admin' && (
                <div className="pt-3 text-center border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => setAuthMode('recovery')}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-medium inline-flex items-center space-x-1"
                  >
                    <Key className="w-3 h-3" />
                    <span>Lost Admin Credentials? Click here for Safe Account Recovery</span>
                  </button>
                </div>
              )}
            </form>
          )}

          {/* FORGOT PASSWORD FORM */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Reset Account Password</h3>
                <p className="text-xs text-slate-400">
                  Enter your registered email address to receive password reset instructions.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase">Registered Email *</label>
                <input
                  type="email"
                  required
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMessage(''); setSuccessMessage(''); }}
                  className="w-1/3 py-3 rounded-xl border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-2/3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Send Reset Request</span>
                </button>
              </div>
            </form>
          )}

          {/* SAFE ADMIN RECOVERY FORM */}
          {authMode === 'recovery' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-amber-400 flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Safe Admin Account Recovery Procedure</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If you have forgotten your administrator credentials, follow this verified process to recover access safely:
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-3 text-slate-300">
                <div className="space-y-1">
                  <span className="font-bold text-indigo-400">Step 1: Verification Email</span>
                  <p className="text-slate-400">Admin Account Email: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white">naveenpanneerselvam78@gmail.com</code></p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-indigo-400">Step 2: Temporary Master Passkey</span>
                  <p className="text-slate-400">Temporary Admin Passkey: <code className="bg-slate-900 px-1.5 py-0.5 rounded text-white">Admin#2026!</code></p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-indigo-400">Step 3: Post-Login Security</span>
                  <p className="text-slate-400">Once logged in, navigate to Admin Settings & Password Manager to update your permanent password.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => { 
                  setActiveRole('admin'); 
                  setEmailInput('naveenpanneerselvam78@gmail.com'); 
                  setPasswordInput('Admin#2026!'); 
                  setAuthMode('login'); 
                }}
                className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-900/40 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Auto-Fill Verified Admin Credentials</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-200 py-1"
              >
                Back to Standard Login
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
