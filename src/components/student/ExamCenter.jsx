import React, { useState, useEffect } from 'react';
import { 
  FileText, Clock, Award, ShieldAlert, CheckCircle2, Lock, Unlock, 
  Send, ArrowLeft, AlertTriangle, Sparkles, CheckSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExamCenter({ student, exams, onUpdateExamAttempt, onSendParentSMS, onBack }) {
  const [activeExam, setActiveExam] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [smsPreview, setSmsPreview] = useState(null);
  const [lockedNoticeExam, setLockedNoticeExam] = useState(null);

  // Timer effect for active exam
  useEffect(() => {
    let timer;
    if (activeExam && !examSubmitted && timeLeftSeconds > 0) {
      timer = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeExam, examSubmitted, timeLeftSeconds]);

  const handleStartExam = (exam) => {
    const attempt = exam.studentAttempts[student.id] || { status: 'Not Started', attemptsUsed: 0 };

    // Check single-attempt anti-cheat lock rule!
    if (attempt.status === 'Submitted' || attempt.status === 'Locked') {
      setLockedNoticeExam(exam);
      return;
    }

    setActiveExam(exam);
    setUserAnswers({});
    setTimeLeftSeconds(exam.durationMinutes * 60);
    setExamSubmitted(false);
    setScoreResult(null);
    setSmsPreview(null);

    // Lock session in backend data
    onUpdateExamAttempt(exam.id, student.id, {
      status: 'In Progress',
      attemptsUsed: 1,
      openedAt: new Date().toLocaleString()
    });
  };

  const handleOptionSelect = (qId, optionIdx) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmitExam = () => {
    if (!activeExam) return;

    // Calculate Score
    let score = 0;
    activeExam.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        score += q.marks;
      }
    });

    const percentage = Math.round((score / activeExam.maxScore) * 100);
    const grade = percentage >= 90 ? 'A+' : percentage >= 75 ? 'A' : percentage >= 60 ? 'B' : 'C';

    const result = {
      score,
      maxScore: activeExam.maxScore,
      percentage,
      grade
    };

    setScoreResult(result);
    setExamSubmitted(true);

    // Lock exam state to Submitted (Single attempt enforced!)
    onUpdateExamAttempt(activeExam.id, student.id, {
      status: 'Submitted',
      attemptsUsed: 1,
      completedAt: new Date().toLocaleString(),
      score,
      maxScore: activeExam.maxScore,
      answers: userAnswers,
      parentNotified: true
    });

    // Trigger parent SMS message dispatch
    const smsMsg = `🎓 Apex Scholar Academy Alert: Dear Parent (${student.parentName}), ${student.name} scored ${score}/${activeExam.maxScore} (${percentage}%, Grade: ${grade}) in ${activeExam.title}. Exam Pattern: ${activeExam.patternInfo}.`;
    
    onSendParentSMS({
      id: `sms-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      parentPhone: student.parentPhone,
      examTitle: activeExam.title,
      score,
      maxScore: activeExam.maxScore,
      percentage: `${percentage}%`,
      grade,
      messageContent: smsMsg,
      sentAt: new Date().toLocaleString(),
      status: 'Delivered (SMS & WhatsApp API)'
    });

    setSmsPreview(smsMsg);

    // Trigger Confetti Celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-extrabold text-white">Online Exam & Pattern Evaluation Engine</h2>
        </div>
      </div>

      {!activeExam ? (
        /* List of Available Weekly & Full Tests */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs flex items-start gap-3">
            <Lock className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm text-white">Single-Attempt Security Policy</p>
              <p className="text-slate-300 mt-0.5">
                Question papers open once per student. After submission or exit, the paper locks automatically. Only the Admin can unlock and re-open exam attempts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {exams.map((exam) => {
              const attempt = exam.studentAttempts[student.id] || { status: 'Not Started', score: 0 };
              const isLocked = attempt.status === 'Submitted' || attempt.status === 'Locked';

              return (
                <div 
                  key={exam.id}
                  className="rounded-3xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img src={exam.imageCover} alt={exam.title} className="w-full h-full object-cover opacity-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 text-[10px] font-bold text-indigo-300 border border-slate-700">
                      {exam.type} • {exam.standard}
                    </div>

                    {isLocked && (
                      <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-500/90 text-white text-[10px] font-extrabold flex items-center gap-1 shadow-lg">
                        <Lock className="w-3 h-3" />
                        <span>Single Attempt Locked</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-white leading-tight">{exam.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{exam.patternInfo}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                      <span>{exam.totalQuestions} Questions</span>
                      <span>{exam.durationMinutes} Mins</span>
                      <span>Max Score: {exam.maxScore}</span>
                    </div>

                    {attempt.status === 'Submitted' ? (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Submitted Result: {attempt.score} / {attempt.maxScore}</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 font-mono">Parents Notified via SMS</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartExam(exam)}
                        className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                          isLocked 
                            ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' 
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                        }`}
                      >
                        {isLocked ? (
                          <>
                            <Lock className="w-4 h-4 text-rose-400" />
                            <span>Attempt Locked (Request Admin Unlock)</span>
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4" />
                            <span>Start Single-Attempt Test</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Active Exam Paper Interface */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
          
          {/* Exam Header & Live Countdown Timer */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Active Question Paper</span>
              <h3 className="text-xl font-extrabold text-white">{activeExam.title}</h3>
            </div>

            {!examSubmitted && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 font-mono font-bold text-base shadow-inner">
                <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
                <span>Time Remaining: {formatTimer(timeLeftSeconds)}</span>
              </div>
            )}
          </div>

          {!examSubmitted ? (
            /* Questions List */
            <div className="space-y-6">
              {activeExam.questions.map((q, qIndex) => (
                <div key={q.id} className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-bold text-white text-sm lg:text-base">
                      Q{qIndex + 1}. {q.question}
                    </h5>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-bold shrink-0">
                      {q.marks} Marks
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {q.options.map((opt, optIndex) => (
                      <button
                        key={optIndex}
                        type="button"
                        onClick={() => handleOptionSelect(q.id, optIndex)}
                        className={`p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                          userAnswers[q.id] === optIndex
                            ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="font-mono text-indigo-400 mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <button
                onClick={handleSubmitExam}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
              >
                <CheckSquare className="w-5 h-5" />
                <span>Submit Exam Paper & Lock Attempt</span>
              </button>
            </div>
          ) : (
            /* Exam Result Summary & Parent SMS Dispatch Status */
            <div className="space-y-6 text-center py-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <Award className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white">Test Completed Successfully!</h3>
                <p className="text-xs text-slate-300 mt-1">Single attempt locked. Results generated automatically.</p>
              </div>

              <div className="max-w-md mx-auto p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-3xl font-black text-emerald-400">
                  {scoreResult?.score} / {scoreResult?.maxScore}
                </div>
                <p className="text-xs text-slate-300 font-semibold">
                  Percentage: {scoreResult?.percentage}% • Grade: {scoreResult?.grade}
                </p>
              </div>

              {/* Parent SMS Dispatch Box */}
              {smsPreview && (
                <div className="max-w-lg mx-auto p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs text-indigo-300 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-emerald-400" />
                      <span>Parent SMS Message Dispatched</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono">Delivered to {student.parentPhone}</span>
                  </div>
                  <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded-xl font-mono leading-relaxed">
                    "{smsPreview}"
                  </p>
                </div>
              )}

              <button
                onClick={() => setActiveExam(null)}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-all"
              >
                Return to Exam Roster
              </button>
            </div>
          )}

        </div>
      )}

      {/* Locked Exam Notice Modal */}
      {lockedNoticeExam && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            
            <h3 className="text-lg font-bold text-white">Online Exam Paper Locked</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              You have already opened/submitted <span className="font-bold text-white">"{lockedNoticeExam.title}"</span>. Online test papers can only be opened once.
            </p>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-rose-400">
                <ShieldAlert className="w-4 h-4" />
                <span>Admin Re-open Required</span>
              </div>
              <p className="text-[11px]">
                Please contact the Admin from the Admin Suite or request your teacher to send an unlock request to Admin.
              </p>
            </div>

            <button
              onClick={() => setLockedNoticeExam(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all"
            >
              Understand & Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
