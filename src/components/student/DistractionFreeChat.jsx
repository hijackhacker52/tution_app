import React, { useState } from 'react';
import { 
  Send, PhoneCall, Video, Image as ImageIcon, Sparkles, X, 
  ArrowLeft, CheckCircle2, Bot, User, Mic, MicOff, Volume2, ShieldCheck, Paperclip
} from 'lucide-react';
import { aiDoubtService } from '../../services/aiDoubtService';

export default function DistractionFreeChat({ 
  student = {}, 
  subjectCode, 
  subjects = [], 
  teachers = [], 
  doubts = [], 
  onSendDoubtMessage, 
  onBack 
}) {
  const currentSubject = (subjects && subjects.find(s => s.code === subjectCode)) || (subjects && subjects[0]) || { name: 'Mathematics', code: 'TN10-MAT' };
  const primaryTeacher = teachers && teachers.find(t => t.id === currentSubject.assignedTeacherId || t.id === currentSubject.teacherId);
  const isSubstituted = primaryTeacher?.onLeave;
  const activeTeacher = isSubstituted ? teachers.find(t => t.id === primaryTeacher.substituteAssignedId) : primaryTeacher;

  // Active doubt thread
  const existingDoubt = doubts && doubts.find(d => d.subjectCode === currentSubject.code && d.studentId === student.id);

  const [messages, setMessages] = useState(existingDoubt?.messages || [
    {
      sender: 'teacher',
      text: activeTeacher 
        ? `Hello ${student.name || 'Student'}! I am ${activeTeacher.name}, your allocated specialist for ${currentSubject.name}. How can I assist you with your doubts today?`
        : `Hello ${student.name || 'Student'}! Your subject teacher for ${currentSubject.name} is currently offline. You can toggle the 24/7 AI Tutor switch above to clear your doubts immediately!`,
      time: 'Just now'
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAiMode, setIsAiMode] = useState(!activeTeacher); // Default to AI mode if teacher offline
  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState('audio'); // 'audio' | 'video'
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(14); // seconds
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !selectedImage) return;

    const queryText = inputMessage;
    const newMsg = {
      sender: 'student',
      text: queryText,
      image: selectedImage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    setInputMessage('');
    setSelectedImage(null);

    // AI or Teacher response
    if (isAiMode || !activeTeacher) {
      setIsAiThinking(true);
      try {
        const aiResponse = await aiDoubtService.solveDoubt({
          prompt: queryText,
          subject: currentSubject.name,
          standard: student.standard || 'Class 10 (SSLC)',
          studentName: student.name || 'Student'
        });

        setMessages(prev => [
          ...prev,
          {
            sender: 'ai-tutor',
            text: `✨ ${aiResponse.provider}:\n\n${aiResponse.content}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } catch (err) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai-tutor',
            text: `⚠️ Could not generate answer: ${err.message}. Please try again.`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } finally {
        setIsAiThinking(false);
      }
    } else {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            sender: 'teacher',
            text: `Got your doubt, ${student.name || 'Student'}! I have reviewed your question. Let's schedule a 2-minute quick call if you need live step-by-step guidance!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1000);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedImage(url);
    }
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* Distraction-Free Top Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <img 
            src={activeTeacher?.avatar} 
            alt={activeTeacher?.name} 
            className="w-11 h-11 rounded-2xl object-cover border-2 border-indigo-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-base">{activeTeacher?.name}</h3>
              {isSubstituted && (
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold px-2 py-0.5 rounded-full border border-amber-500/30">
                  Substitute Staff
                </span>
              )}
            </div>
            <p className="text-xs text-indigo-300 font-medium">
              1-on-1 Dedicated Tutor • {currentSubject.name}
            </p>
          </div>
        </div>

        {/* Action Controls: Call & AI Switcher */}
        <div className="flex items-center gap-2">
          {/* AI Mode Toggle */}
          <button
            onClick={() => setIsAiMode(!isAiMode)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isAiMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30' 
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-purple-300" />
            <span className="hidden sm:inline">{isAiMode ? 'AI Tutor Active' : 'Switch to AI Tutor'}</span>
          </button>

          {/* Audio Call */}
          <button
            onClick={() => {
              setCallType('audio');
              setShowCallModal(true);
            }}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
            title="Start Audio Call"
          >
            <PhoneCall className="w-4 h-4" />
          </button>

          {/* Video Call */}
          <button
            onClick={() => {
              setCallType('video');
              setShowCallModal(true);
            }}
            className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 transition-all"
            title="Start Video Call"
          >
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Distraction-Free Chat Box */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 min-h-[500px] flex flex-col justify-between shadow-2xl relative">
        
        {/* Distraction Free Badge */}
        <div className="self-center mb-4 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-semibold text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Distraction-Free Environment Active • 0 Ads • Direct 1-on-1 Channel</span>
        </div>

        {/* Message Thread */}
        <div className="space-y-4 overflow-y-auto max-h-[420px] pr-2">
          {messages.map((msg, idx) => (
            <div 
              key={idx}
              className={`flex items-start gap-3 ${
                msg.sender === 'student' ? 'flex-row-reverse' : ''
              }`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                msg.sender === 'student'
                  ? 'bg-indigo-600 text-white'
                  : msg.sender === 'ai-tutor'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-800 text-indigo-300'
              }`}>
                {msg.sender === 'student' ? 'Me' : msg.sender === 'ai-tutor' ? 'AI' : 'Staff'}
              </div>

              <div className={`max-w-md rounded-2xl p-4 text-xs lg:text-sm space-y-2 ${
                msg.sender === 'student'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                  : msg.sender === 'ai-tutor'
                  ? 'bg-gradient-to-r from-purple-900/60 to-indigo-900/60 border border-purple-500/30 text-purple-100 rounded-tl-none'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <p className="leading-relaxed">{msg.text}</p>
                {msg.image && (
                  <div className="rounded-xl overflow-hidden border border-white/20 mt-2">
                    <img src={msg.image} alt="Doubt Attachment" className="w-full max-h-56 object-cover" />
                  </div>
                )}
                <div className={`text-[10px] text-right ${
                  msg.sender === 'student' ? 'text-indigo-200' : 'text-slate-400'
                }`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Image Attachment Preview */}
        {selectedImage && (
          <div className="mt-3 p-2 bg-slate-950 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={selectedImage} alt="Preview" className="w-10 h-10 object-cover rounded-xl" />
              <span className="text-xs text-indigo-300 font-semibold">Homework/Doubt Image Attached</span>
            </div>
            <button 
              onClick={() => setSelectedImage(null)}
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Message Input Controls */}
        <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
          <label className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 border border-slate-800 cursor-pointer transition-colors">
            <ImageIcon className="w-5 h-5" />
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageSelect} 
              className="hidden" 
            />
          </label>

          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              isAiMode
                ? "Ask OmniAI Tutor for instant step-by-step math/physics formulas..."
                : `Type your doubt directly to ${activeTeacher?.name}...`
            }
            className="flex-1 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white text-xs lg:text-sm focus:outline-none focus:border-indigo-500"
          />

          <button
            type="submit"
            className="p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>

      {/* Simulated 1-on-1 Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 text-center space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            
            <div className="relative inline-block">
              <img 
                src={activeTeacher?.avatar} 
                alt={activeTeacher?.name} 
                className="w-24 h-24 rounded-full object-cover border-4 border-indigo-500 shadow-2xl mx-auto"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                <Volume2 className="w-3.5 h-3.5 text-slate-950" />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">{activeTeacher?.name}</h3>
              <p className="text-xs text-indigo-400 font-semibold mt-1">
                {callType === 'video' ? '1-on-1 Video Consultation' : '1-on-1 Audio Doubt Call'}
              </p>
              <p className="text-xs text-emerald-400 font-mono mt-2 animate-pulse">
                Connected • 00:{callDuration < 10 ? `0${callDuration}` : callDuration}
              </p>
            </div>

            {/* Audio Wave Visualizer Simulation */}
            <div className="flex items-center justify-center gap-1.5 h-10">
              {[40, 70, 30, 90, 60, 100, 50, 80, 45].map((h, i) => (
                <div 
                  key={i} 
                  style={{ height: `${h}%` }} 
                  className="w-1.5 bg-indigo-500 rounded-full animate-pulse"
                ></div>
              ))}
            </div>

            {/* Call Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full border transition-all ${
                  isMuted ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' : 'bg-slate-800 text-white border-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setShowCallModal(false)}
                className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/40 transition-all flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 rotate-135" />
                <span>End Call</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
