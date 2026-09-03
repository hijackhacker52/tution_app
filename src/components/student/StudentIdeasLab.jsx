import React, { useState } from 'react';
import { Sparkles, Lightbulb, Send, Bot, CheckCircle2, ArrowLeft } from 'lucide-react';

export default function StudentIdeasLab({ student, onBack }) {
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDesc, setIdeaDesc] = useState('');
  const [submittedIdeas, setSubmittedIdeas] = useState([
    {
      id: 'id-01',
      title: 'Solar Powered Quantum Sensor Prototype',
      desc: 'Using photovoltaic cells connected to quantum dots for high sensitivity light detection.',
      feedback: '🤖 AI Tutor Feedback: Excellent interdisciplinary concept combining Physics & Chemistry! Rated 9.5/10. Teacher Prof. Sharma approved funding review.',
      date: '2 days ago'
    }
  ]);

  const handleSubmitIdea = (e) => {
    e.preventDefault();
    if (!ideaTitle || !ideaDesc) return;

    const newIdea = {
      id: `id-${Date.now()}`,
      title: ideaTitle,
      desc: ideaDesc,
      feedback: `🤖 AI Tutor Feedback: Outstanding idea! Analyzed for novelty and feasibility. Assigned to ${student.name}'s subject mentor for evaluation.`,
      date: 'Just now'
    };

    setSubmittedIdeas([newIdea, ...submittedIdeas]);
    setIdeaTitle('');
    setIdeaDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold border border-slate-800 flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-extrabold text-white">Student Creative Ideas & Innovation Lab</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Idea Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Submit New Project Idea</h3>
          </div>
          
          <form onSubmit={handleSubmitIdea} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Project / Idea Title</label>
              <input
                type="text"
                value={ideaTitle}
                onChange={(e) => setIdeaTitle(e.target.value)}
                placeholder="e.g. AI-assisted calculus solver"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Detailed Description</label>
              <textarea
                value={ideaDesc}
                onChange={(e) => setIdeaDesc(e.target.value)}
                rows="4"
                placeholder="Describe your hypothesis, methodology, or learning experiment..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit for AI + Staff Evaluation</span>
            </button>
          </form>
        </div>

        {/* Ideas Feed */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-white text-base">Your Innovation Submissions</h3>
          {submittedIdeas.map((idea) => (
            <div key={idea.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <div className="flex items-start justify-between">
                <h4 className="font-bold text-white text-base">{idea.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">{idea.date}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{idea.desc}</p>
              
              <div className="p-3.5 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs flex items-start gap-2">
                <Bot className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <span>{idea.feedback}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
