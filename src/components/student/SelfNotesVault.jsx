import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Edit3, Save, Trash2, Plus, Download, Printer, 
  Check, Clock, BookOpen, Palette, Eraser, RotateCcw, 
  Sparkles, Maximize2, Minimize2, Eye, HelpCircle, Layers, 
  Share2, Search, Tag, Type
} from 'lucide-react';

export default function SelfNotesVault({ 
  student = {}, 
  subjects = [], 
  assignedClass = 'Class 10' 
}) {
  const studentId = student.id || student.studentId || 'std-default';
  const STORAGE_KEY = `learning_hub_self_notes_${studentId}`;

  // Filter subjects for this student's class
  const classSubjects = subjects.filter(s => s.standard === (student.standard || assignedClass));
  const defaultSubject = classSubjects[0]?.name || 'General Studies';

  // Load existing notes from localStorage or initialize with welcome note
  const [notes, setNotes] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed loading notes:', e);
    }
    return [
      {
        id: `note-${Date.now()}`,
        title: `${assignedClass} My Personal Study Notes`,
        subject: defaultSubject,
        mode: 'text', // 'text' | 'draw'
        content: `Welcome to your personal digital notebook!\n\nUse this clean white page to summarize formulas, lecture points, homework steps, and exam revision.\n\nEverything you type or draw here is AUTO-SAVED automatically.`,
        canvasData: null,
        updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString()
      }
    ];
  });

  const [activeNoteId, setActiveNoteId] = useState(notes[0]?.id || '');
  const [saveStatus, setSaveStatus] = useState('Saved'); // 'Saved' | 'Saving...'
  const [lastSavedTime, setLastSavedTime] = useState(notes[0]?.updatedAt || 'Just now');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLinedPaper, setIsLinedPaper] = useState(true); // Ruled paper vs plain white
  const [copiedToast, setCopiedToast] = useState(false);

  // Active Note Reference
  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  // Canvas Whiteboard Drawing State
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#1e3a8a'); // Royal Blue Ink default
  const [penSize, setPenSize] = useState(3);
  const [isEraser, setIsEraser] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState([]);

  // Auto-Save Debounce Timer
  const autoSaveTimerRef = useRef(null);

  // Persistence to localStorage
  const persistNotes = (updatedList) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      setSaveStatus('Saved');
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (e) {
      console.error('Failed saving notes to storage:', e);
    }
  };

  // Trigger auto-save whenever note content changes
  const triggerAutoSave = (updatedNote) => {
    setSaveStatus('Saving...');
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      setNotes(prev => {
        const updated = prev.map(n => n.id === updatedNote.id ? { 
          ...updatedNote, 
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        } : n);
        persistNotes(updated);
        return updated;
      });
    }, 600);
  };

  // Update text content
  const handleContentChange = (newContent) => {
    if (!activeNote) return;
    const updated = { ...activeNote, content: newContent };
    triggerAutoSave(updated);
  };

  // Update title
  const handleTitleChange = (newTitle) => {
    if (!activeNote) return;
    const updated = { ...activeNote, title: newTitle };
    triggerAutoSave(updated);
  };

  // Update subject
  const handleSubjectChange = (newSubj) => {
    if (!activeNote) return;
    const updated = { ...activeNote, subject: newSubj };
    triggerAutoSave(updated);
  };

  // Switch between Typed Text and Hand-Writing Canvas
  const handleModeSwitch = (mode) => {
    if (!activeNote) return;
    const updated = { ...activeNote, mode };
    triggerAutoSave(updated);
  };

  // Create New Note
  const handleCreateNewNote = () => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: `Untitled Note ${notes.length + 1}`,
      subject: defaultSubject,
      mode: 'text',
      content: '',
      canvasData: null,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString()
    };
    const updated = [newNote, ...notes];
    setNotes(updated);
    setActiveNoteId(newNote.id);
    persistNotes(updated);
  };

  // Delete Note
  const handleDeleteNote = (id) => {
    if (notes.length <= 1) {
      alert('You must keep at least one note in your vault.');
      return;
    }
    if (!window.confirm('Delete this note permanently?')) return;
    const updated = notes.filter(n => n.id !== id);
    setNotes(updated);
    setActiveNoteId(updated[0].id);
    persistNotes(updated);
  };

  // Insert Quick Mathematical & Formula Symbols
  const handleInsertSymbol = (sym) => {
    if (!activeNote || activeNote.mode !== 'text') return;
    const textarea = document.getElementById('note-paper-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = activeNote.content || '';
    const updatedContent = current.substring(0, start) + sym + current.substring(end);
    
    handleContentChange(updatedContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + sym.length, start + sym.length);
    }, 0);
  };

  // Format Helper: Bullet, Number, Timestamp
  const handleInsertFormat = (type) => {
    if (!activeNote || activeNote.mode !== 'text') return;
    let insertion = '';
    if (type === 'bullet') insertion = '\n• ';
    if (type === 'number') insertion = '\n1. ';
    if (type === 'time') insertion = ` [${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] `;
    if (type === 'formula') insertion = '\n$$\\text{Formula}: a^2 + b^2 = c^2$$\n';
    handleInsertSymbol(insertion);
  };

  // Print Note
  const handlePrint = () => {
    window.print();
  };

  // Download Note as Text File
  const handleDownloadTxt = () => {
    if (!activeNote) return;
    const blob = new Blob([
      `# ${activeNote.title}\nSubject: ${activeNote.subject} | Date: ${activeNote.date}\n\n${activeNote.content}`
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeNote.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------
  // CANVAS HANDWRITING ENGINE ("White page with writing")
  // -------------------------------------------------------------
  useEffect(() => {
    if (activeNote?.mode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Set responsive resolution
      canvas.width = canvas.parentElement.clientWidth || 800;
      canvas.height = 550;

      // Fill pure white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle lined guide if enabled
      if (isLinedPaper) {
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        for (let y = 40; y < canvas.height; y += 32) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
        // Red left margin line
        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(60, 0);
        ctx.lineTo(60, canvas.height);
        ctx.stroke();
      }

      // Restore saved canvas image if present
      if (activeNote.canvasData) {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = activeNote.canvasData;
      }
    }
  }, [activeNoteId, activeNote?.mode, isLinedPaper]);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : penColor;
    ctx.lineWidth = isEraser ? penSize * 4 : penSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas || !activeNote) return;

    // Auto-save canvas snapshot to note state
    const dataUrl = canvas.toDataURL('image/png');
    const updated = { ...activeNote, canvasData: dataUrl };
    triggerAutoSave(updated);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (isLinedPaper) {
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      for (let y = 40; y < canvas.height; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(60, 0);
      ctx.lineTo(60, canvas.height);
      ctx.stroke();
    }

    const updated = { ...activeNote, canvasData: null };
    triggerAutoSave(updated);
  };

  const downloadCanvasImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${activeNote.title.replace(/\s+/g, '_')}_handwritten.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Filter notes by search
  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (n.subject && n.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (n.content && n.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-900/50 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Edit3 className="w-5 h-5" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              My Self Notes <span className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30 ml-1">Digital Notebook & Whiteboard</span>
            </h2>
          </div>
          <p className="text-xs text-indigo-200">
            A distraction-free white page for handwritten formulas, typed summaries, and revision. Everything auto-saves in real time.
          </p>
        </div>

        {/* Real-Time Auto-Save Indicator */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-2 bg-slate-950/80 px-3.5 py-1.5 rounded-2xl border border-slate-800 text-xs">
            {saveStatus === 'Saving...' ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-300 font-bold">Auto-saving...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-300 font-bold">Auto-saved at {lastSavedTime}</span>
              </>
            )}
          </div>

          <button
            onClick={handleCreateNewNote}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl flex items-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Note</span>
          </button>
        </div>
      </div>

      {/* 2. Main Studio Grid: Sidebar + White Page Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Drawer / Notes List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-500"
              />
            </div>

            {/* Notes Roster */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
              {filteredNotes.map((n) => {
                const isActive = n.id === activeNoteId;
                return (
                  <div
                    key={n.id}
                    onClick={() => setActiveNoteId(n.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                      isActive
                        ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-bold truncate max-w-[170px] text-white">
                        {n.title || 'Untitled Note'}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                        {n.mode === 'draw' ? '🖊️ Draw' : '⌨️ Typed'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="truncate max-w-[140px]">{n.subject}</span>
                      <span>{n.updatedAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: The White Page Writing Studio */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Note Metadata Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 w-full space-y-2">
              <input
                type="text"
                value={activeNote?.title || ''}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Note Title (e.g. Mathematics Chapter 1 Formulas)..."
                className="w-full bg-transparent font-extrabold text-lg sm:text-xl text-white border-b border-transparent focus:border-indigo-500 focus:outline-none pb-1 transition-colors"
              />

              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-semibold flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Subject:</span>
                </span>
                <select
                  value={activeNote?.subject || defaultSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
                >
                  {classSubjects.map((s) => (
                    <option key={s.code} value={s.name}>{s.name}</option>
                  ))}
                </select>

                <span className="text-slate-500">•</span>
                <span className="text-slate-400">{activeNote?.date}</span>
              </div>
            </div>

            {/* Mode Switcher: Typed Notepad vs Freehand Whiteboard */}
            <div className="flex items-center space-x-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shrink-0">
              <button
                onClick={() => handleModeSwitch('text')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeNote?.mode === 'text'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Type className="w-3.5 h-3.5" />
                <span>White Notepad</span>
              </button>

              <button
                onClick={() => handleModeSwitch('draw')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeNote?.mode === 'draw'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Hand-Writing Canvas</span>
              </button>
            </div>
          </div>

          {/* 3. Toolbar based on mode */}
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-2">
            {activeNote?.mode === 'text' ? (
              <>
                {/* Math & Formatting Stamps */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Quick Tools:</span>
                  <button onClick={() => handleInsertFormat('bullet')} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white text-xs border border-slate-800 font-bold" title="Bullet List">• Bullet</button>
                  <button onClick={() => handleInsertFormat('number')} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white text-xs border border-slate-800 font-bold" title="Numbered List">1. Number</button>
                  <button onClick={() => handleInsertFormat('formula')} className="px-2.5 py-1 rounded-lg bg-slate-950 text-indigo-300 hover:text-white text-xs border border-slate-800 font-bold" title="Formula Stamp">∑ Formula</button>
                  <button onClick={() => handleInsertSymbol('√')} className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white text-xs border border-slate-800 font-bold">√</button>
                  <button onClick={() => handleInsertSymbol('π')} className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white text-xs border border-slate-800 font-bold">π</button>
                  <button onClick={() => handleInsertSymbol('θ')} className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white text-xs border border-slate-800 font-bold">θ</button>
                  <button onClick={() => handleInsertSymbol('²')} className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white text-xs border border-slate-800 font-bold">x²</button>
                  <button onClick={() => handleInsertSymbol('±')} className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white text-xs border border-slate-800 font-bold">±</button>
                  <button onClick={() => handleInsertSymbol('°')} className="px-2 py-1 rounded-lg bg-slate-950 text-slate-300 hover:text-white text-xs border border-slate-800 font-bold">90°</button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsLinedPaper(!isLinedPaper)}
                    className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-400 hover:text-white text-xs border border-slate-800"
                    title="Toggle Ruled Lines / Plain White Paper"
                  >
                    {isLinedPaper ? 'Plain White Paper' : 'Ruled Notebook'}
                  </button>
                  <button onClick={handlePrint} className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800" title="Print note"><Printer className="w-4 h-4" /></button>
                  <button onClick={handleDownloadTxt} className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-800" title="Download Text"><Download className="w-4 h-4" /></button>
                  <button onClick={() => handleDeleteNote(activeNote.id)} className="p-1.5 rounded-lg bg-slate-950 text-rose-400 hover:text-rose-300 border border-slate-800" title="Delete note"><Trash2 className="w-4 h-4" /></button>
                </div>
              </>
            ) : (
              <>
                {/* Drawing Palette Toolbar */}
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Colors */}
                  <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    {[
                      { color: '#1e3a8a', label: 'Ink Blue' },
                      { color: '#0f172a', label: 'Black' },
                      { color: '#dc2626', label: 'Red Mark' },
                      { color: '#16a34a', label: 'Green' },
                      { color: '#9333ea', label: 'Purple' },
                      { color: '#f59e0b', label: 'Highlighter' }
                    ].map((c) => (
                      <button
                        key={c.color}
                        onClick={() => { setPenColor(c.color); setIsEraser(false); }}
                        className={`w-6 h-6 rounded-full border-2 transition-transform ${
                          penColor === c.color && !isEraser ? 'scale-125 border-white shadow-md' : 'border-transparent opacity-80'
                        }`}
                        style={{ backgroundColor: c.color }}
                        title={c.label}
                      />
                    ))}
                  </div>

                  {/* Pen vs Eraser */}
                  <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setIsEraser(false)}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 ${!isEraser ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Pen</span>
                    </button>
                    <button
                      onClick={() => setIsEraser(true)}
                      className={`p-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 ${isEraser ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                    >
                      <Eraser className="w-3.5 h-3.5" />
                      <span>Eraser</span>
                    </button>
                  </div>

                  {/* Size */}
                  <select
                    value={penSize}
                    onChange={(e) => setPenSize(Number(e.target.value))}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                  >
                    <option value={2}>Fine (2px)</option>
                    <option value={4}>Medium (4px)</option>
                    <option value={8}>Bold (8px)</option>
                    <option value={14}>Marker (14px)</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <button onClick={clearCanvas} className="px-3 py-1.5 rounded-xl bg-slate-950 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold">Clear Whiteboard</button>
                  <button onClick={downloadCanvasImage} className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>Export PNG</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* 4. THE WHITE PAGE ITSELF (Authentic Notebook Paper Aesthetics) */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-200 bg-white">
            
            {activeNote?.mode === 'text' ? (
              /* WHITE PAPER NOTEPAD (Ruled / Plain) */
              <div className="relative min-h-[520px] bg-white p-6 sm:p-10 flex flex-col justify-between">
                {/* Red Left Margin Line */}
                <div className="absolute left-10 sm:left-14 top-0 bottom-0 w-[1.5px] bg-rose-300 pointer-events-none"></div>

                <textarea
                  id="note-paper-textarea"
                  value={activeNote?.content || ''}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="Start writing or typing your study notes here... Auto-saves every character."
                  className={`w-full min-h-[460px] pl-6 sm:pl-10 text-slate-900 focus:outline-none resize-none font-mono text-sm leading-[32px] bg-transparent ${
                    isLinedPaper ? 'lined-notebook-paper' : ''
                  }`}
                  style={isLinedPaper ? {
                    backgroundImage: 'linear-gradient(to bottom, transparent 31px, #e2e8f0 32px)',
                    backgroundSize: '100% 32px'
                  } : {}}
                />

                {/* Bottom Stats Footer on White Page */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-sans">
                  <span>Words: {activeNote?.content ? activeNote.content.trim().split(/\s+/).filter(Boolean).length : 0} • Characters: {activeNote?.content?.length || 0}</span>
                  <span className="font-semibold text-emerald-600 flex items-center space-x-1">
                    <Check className="w-3.5 h-3.5" />
                    <span>Real-time Auto-save Enabled</span>
                  </span>
                </div>
              </div>
            ) : (
              /* HAND-WRITING WHITEBOARD CANVAS ("White page with writing") */
              <div className="relative bg-white min-h-[550px] cursor-crosshair">
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[550px] touch-none block"
                />
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
