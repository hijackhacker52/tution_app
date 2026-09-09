import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Send, Bot, User, BookOpen, Key, Check, Copy, Volume2, 
  VolumeX, Mic, MicOff, RefreshCw, Bookmark, HelpCircle, Award, 
  Languages, Calculator, AlertCircle, Clock, CheckCircle2, ChevronDown, 
  ExternalLink, Trash2, X
} from 'lucide-react';
import { aiDoubtService, AI_MODES } from '../../services/aiDoubtService';

export default function AiDoubtSolver({ 
  student = {}, 
  subjects = [], 
  teachers = [], 
  assignedClass = 'Class 10 (SSLC)',
  onBack 
}) {
  const studentName = student.name || 'Student';
  const studentStandard = student.standard || assignedClass;

  // Filter subjects for this student's class
  const classSubjects = subjects.filter(s => s.standard === studentStandard);
  const defaultSubject = classSubjects[0]?.name || 'Mathematics (கணிதம்)';

  const [selectedSubject, setSelectedSubject] = useState(defaultSubject);
  const [selectedMode, setSelectedMode] = useState('gemini-direct');
  const [inputDoubt, setInputDoubt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedNotes, setSavedNotes] = useState(() => {
    try {
      const stored = localStorage.getItem('learning_hub_saved_doubts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Settings & API Key modal
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(aiDoubtService.getApiKey());
  const [hasApiKey, setHasApiKey] = useState(aiDoubtService.hasApiKey());
  const [keySavedToast, setKeySavedToast] = useState(false);

  // Text-to-Speech & Voice Dictation
  const [speakingMsgId, setSpeakingMsgId] = useState(null);
  const [isListening, setIsListening] = useState(false);

  // Copy indicator
  const [copiedId, setCopiedId] = useState(null);

  // Chat conversation
  const [messages, setMessages] = useState([
    {
      id: 'welcome-1',
      sender: 'ai',
      provider: '24/7 Academic AI Tutor',
      badge: '✨ Gemini & Educational AI',
      time: 'Just now',
      text: `Hello **${studentName}**! 👋 Welcome to your 24/7 AI Doubt Solver for **${studentStandard}**.

When your teachers are in another session, offline, or outside tuition hours, I am here 24/7 to solve your homework problems, explain complex theorems, and prepare you for State Board public exams.

👉 Select your subject above or pick a quick question to get started!`
    }
  ]);

  const chatBottomRef = useRef(null);

  // Check teacher availability for current subject
  const currentSubjObj = subjects.find(s => s.name === selectedSubject && s.standard === studentStandard);
  const assignedTeacher = teachers.find(t => t.id === currentSubjObj?.assignedTeacherId);
  const isTeacherAvailable = assignedTeacher && assignedTeacher.clockedIn && !assignedTeacher.onLeave;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Save notes persistence
  const handleSaveNote = (msg) => {
    const newNote = {
      id: `saved-${Date.now()}`,
      subject: selectedSubject,
      standard: studentStandard,
      date: new Date().toLocaleDateString(),
      text: msg.text
    };
    const updated = [newNote, ...savedNotes];
    setSavedNotes(updated);
    try {
      localStorage.setItem('learning_hub_saved_doubts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSavedNote = (id) => {
    const updated = savedNotes.filter(n => n.id !== id);
    setSavedNotes(updated);
    try {
      localStorage.setItem('learning_hub_saved_doubts', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Copy text helper
  const handleCopyText = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Text to Speech
  const handleSpeak = (id, text) => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (speakingMsgId === id) {
      window.speechSynthesis.cancel();
      setSpeakingMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown hashes/stars before reading
    const cleanText = text.replace(/[#*`_$\\]/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setSpeakingMsgId(null);
    utterance.onerror = () => setSpeakingMsgId(null);
    setSpeakingMsgId(id);
    window.speechSynthesis.speak(utterance);
  };

  // Voice Dictation (Speech Recognition)
  const handleToggleVoiceDictation = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by this browser. You can type your doubt.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputDoubt(prev => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech recognition start failed:', e);
      setIsListening(false);
    }
  };

  // Send Doubt
  const handleSendDoubt = async (textToSend) => {
    const query = (textToSend || inputDoubt).trim();
    if (!query || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query,
      subject: selectedSubject,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputDoubt('');
    setIsLoading(true);

    try {
      const response = await aiDoubtService.solveDoubt({
        prompt: query,
        subject: selectedSubject,
        standard: studentStandard,
        mode: selectedMode,
        studentName
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        provider: response.provider,
        badge: response.badge,
        note: response.note,
        text: response.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        provider: 'System',
        badge: '⚠️ Notice',
        text: `Sorry ${studentName}, I encountered an issue while generating your explanation: ${err.message}. Please try asking again or switch mode.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = (e) => {
    e.preventDefault();
    aiDoubtService.setApiKey(apiKeyInput);
    setHasApiKey(aiDoubtService.hasApiKey());
    setKeySavedToast(true);
    setTimeout(() => setKeySavedToast(false), 3000);
    setIsKeyModalOpen(false);
  };

  // Quick Questions per Subject
  const quickQuestions = [
    { title: '📐 Pythagoras Theorem', query: 'Explain Pythagoras Theorem with formula, proof outline and practical example.' },
    { title: '🌿 Photosynthesis Equation', query: 'What is photosynthesis? Give balanced chemical equation and state board explanation.' },
    { title: '🔢 Matrices Multiplication', query: 'Explain the condition for matrix multiplication and order of product matrix with example.' },
    { title: '⚡ Newton\'s Laws', query: 'State Newton\'s three laws of motion and derive F = ma with SI units.' },
    { title: '📜 அணி இலக்கணம் (தமிழ்)', query: 'உவமை அணி மற்றும் உருவக அணிக்கு விளக்கம் மற்றும் சான்று திருக்குறள் தருக.' },
    { title: '🧪 Acids & Bases', query: 'What is pH scale? Give difference between acids and bases with everyday examples.' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-sans">
      
      {/* 1. Header Banner & Live Status */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-900/50 p-6 sm:p-7 rounded-3xl text-white shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                24/7 AI Doubt Solver <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30 ml-1">AI சந்தேக தீர்ப்பான்</span>
              </h2>
            </div>
            <p className="text-xs text-indigo-200">
              Instant academic clarity powered by Google Gemini & State Board Samacheer Kalvi AI.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center space-x-1.5 border border-slate-700 transition-colors shadow-sm"
              title="Configure Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>{hasApiKey ? 'Gemini API Active' : 'Gemini Key (Optional)'}</span>
              {hasApiKey && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
            </button>

            {onBack && (
              <button
                onClick={onBack}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
              >
                Back to Learning Space
              </button>
            )}
          </div>
        </div>

        {/* Live Teacher Availability & Context Bar */}
        <div className="pt-3 border-t border-indigo-900/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
            <span className="text-indigo-200 font-medium">
              {isTeacherAvailable ? (
                <span className="text-emerald-300">
                  🟢 {assignedTeacher?.name || 'Faculty'} is online. You can also ask AI here for 24/7 revision.
                </span>
              ) : (
                <span className="text-amber-300">
                  🌙 Faculty is currently offline / outside tuition hours. 24/7 AI Tutor is active to clear your doubts immediately!
                </span>
              )}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px] text-indigo-300 font-semibold bg-indigo-950/60 px-3 py-1 rounded-xl border border-indigo-800/50">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Class: {studentStandard}</span>
          </div>
        </div>
      </div>

      {/* 2. Controls Toolbar: Subject Selector & Mode Switcher */}
      <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl space-y-4">
        
        {/* Subject Dropdown & Mode Selector */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Subject Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Subject:</span>
            </span>
            {classSubjects.length > 0 ? (
              classSubjects.map((sub) => (
                <button
                  key={sub.code}
                  onClick={() => setSelectedSubject(sub.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedSubject === sub.name
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {sub.name}
                </button>
              ))
            ) : (
              <button className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white">
                {selectedSubject}
              </button>
            )}
          </div>

          {/* AI Mode Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto no-scrollbar w-full md:w-auto">
            {AI_MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                title={m.desc}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 flex items-center space-x-1 ${
                  selectedMode === m.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{m.name}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Quick Question Prompts */}
        <div className="pt-2 border-t border-slate-800/80">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Frequently Asked State Board Doubts (Click to Ask):</span>
          </p>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendDoubt(q.query)}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 hover:border-indigo-500/50 text-slate-300 hover:text-indigo-200 text-xs font-medium transition-all shrink-0"
              >
                {q.title}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Chat Messages Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[520px]">
        
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 no-scrollbar">
          {messages.map((msg) => {
            const isAi = msg.sender === 'ai';
            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 animate-in fade-in duration-200 ${isAi ? 'justify-start' : 'justify-end'}`}
              >
                {isAi && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-indigo-600/20">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-2xl rounded-2xl p-4 sm:p-5 space-y-2.5 ${
                  isAi 
                    ? 'bg-slate-950 border border-slate-800 text-slate-200 shadow-md' 
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                }`}>
                  {/* Meta Bar */}
                  <div className="flex items-center justify-between text-[10px] font-mono border-b pb-2 mb-2 border-white/10">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold uppercase tracking-wider">
                        {isAi ? (msg.provider || 'AI Tutor') : `${studentName} (${studentStandard})`}
                      </span>
                      {msg.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                          {msg.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400">{msg.time}</span>
                  </div>

                  {/* Message Body */}
                  <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {msg.text}
                  </div>

                  {/* AI Message Action Buttons */}
                  {isAi && (
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => handleSpeak(msg.id, msg.text)}
                          className={`p-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1 text-[11px] font-semibold ${
                            speakingMsgId === msg.id ? 'text-pink-400 bg-pink-500/10' : 'text-slate-400'
                          }`}
                          title="Read explanation aloud"
                        >
                          {speakingMsgId === msg.id ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                          <span>{speakingMsgId === msg.id ? 'Stop' : 'Listen'}</span>
                        </button>

                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1 text-[11px] font-semibold text-slate-400"
                          title="Copy explanation"
                        >
                          {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                        </button>

                        <button
                          onClick={() => handleSaveNote(msg)}
                          className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors flex items-center space-x-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300"
                          title="Bookmark to My Saved Notes"
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save Note</span>
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-500">24/7 Educational Tutor</span>
                    </div>
                  )}
                </div>

                {!isAi && (
                  <div className="w-9 h-9 rounded-xl bg-indigo-700 flex items-center justify-center text-white shrink-0 shadow-md">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center space-x-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800 text-xs text-indigo-300 w-fit animate-pulse">
              <Sparkles className="w-4 h-4 animate-spin text-purple-400" />
              <span>Analyzing doubt using {selectedMode === 'gemini-direct' ? 'Google Gemini 1.5 Flash' : 'Curriculum AI'}...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <form onSubmit={(e) => { e.preventDefault(); handleSendDoubt(); }} className="flex items-center gap-2">
            
            {/* Voice input button */}
            <button
              type="button"
              onClick={handleToggleVoiceDictation}
              className={`p-3 rounded-2xl transition-all border ${
                isListening 
                  ? 'bg-rose-600 text-white border-rose-500 animate-pulse' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-800'
              }`}
              title={isListening ? 'Listening... Speak now' : 'Click to dictate doubt with voice'}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Main Doubt Text Input */}
            <input
              type="text"
              value={inputDoubt}
              onChange={(e) => setInputDoubt(e.target.value)}
              placeholder={`Ask any doubt in ${selectedSubject} (e.g. formulas, homework, exam questions)...`}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
              disabled={isLoading}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={isLoading || !inputDoubt.trim()}
              className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all shrink-0"
            >
              <span>Ask AI</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

      {/* 4. Saved Notes Vault Section */}
      {savedNotes.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-5 h-5 text-indigo-400" />
              <h3 className="font-extrabold text-white text-base">My Saved AI Explanations</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{savedNotes.length} saved</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savedNotes.map((note) => (
              <div key={note.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
                    {note.subject}
                  </span>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <span>{note.date}</span>
                    <button 
                      onClick={() => handleDeleteSavedNote(note.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete saved note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {note.text}
                </p>
                <button
                  onClick={() => handleCopyText(note.id, note.text)}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 pt-1 block"
                >
                  {copiedId === note.id ? '✓ Copied' : 'Copy Full Explanation'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Google Gemini API Key Modal */}
      {isKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-white text-base">Google Gemini AI Key</h3>
              </div>
              <button 
                onClick={() => setIsKeyModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              To connect real-time **Google Gemini 1.5 Flash** with the highest capacity, paste your free Gemini API key below. If left blank, the platform automatically uses the high-precision **Curriculum Educational AI Engine**.
            </p>

            <form onSubmit={handleSaveApiKey} className="space-y-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Gemini API Key</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 text-[11px]"
                >
                  <span>Get free key from Google AI Studio</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                {hasApiKey && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKeyInput('');
                      aiDoubtService.setApiKey('');
                      setHasApiKey(false);
                    }}
                    className="text-rose-400 hover:text-rose-300 text-[11px]"
                  >
                    Remove Key
                  </button>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsKeyModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save API Key
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Toast */}
      {keySavedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4" />
          <span>Gemini API Key configuration saved!</span>
        </div>
      )}

    </div>
  );
}
