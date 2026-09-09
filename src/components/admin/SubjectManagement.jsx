import React, { useState } from 'react';
import { 
  Layers, Plus, Search, Filter, Trash2, Edit3, 
  CheckCircle2, X, AlertCircle, BookOpen, User, AlertTriangle
} from 'lucide-react';

export default function SubjectManagement({ 
  subjects = [], 
  standardsList = [], 
  teachers = [], 
  onAddSubject, 
  onUpdateSubject, 
  onDeleteSubject 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  // Toast
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });

  // Form State for Add
  const initialFormState = {
    code: '',
    name: '',
    nameTamil: '',
    standard: standardsList[0]?.name || 'Class 10 (SSLC)',
    description: '',
    assignedTeacherId: teachers[0]?.id || '',
    imagePresentation: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 4000);
  };

  // Filtered Subjects
  const filteredSubjects = subjects.filter((s) => {
    const matchesSearch = 
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.code && s.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass = filterClass === 'all' || s.standard === filterClass;
    return matchesSearch && matchesClass;
  });

  const handleOpenAddModal = () => {
    setFormData({
      ...initialFormState,
      code: `TN${Date.now().toString().slice(-4)}-SUB`,
      standard: filterClass !== 'all' ? filterClass : (standardsList[0]?.name || 'Class 10 (SSLC)'),
      assignedTeacherId: teachers[0]?.id || ''
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.code.trim()) {
      setFormError('Please enter subject name and unique code.');
      return;
    }

    const exists = subjects.some(
      s => s.code.toLowerCase() === formData.code.trim().toLowerCase()
    );
    if (exists) {
      setFormError('A subject with this Subject Code already exists.');
      return;
    }

    const newSubject = {
      code: formData.code.trim().toUpperCase(),
      standard: formData.standard,
      name: formData.name.trim(),
      nameTamil: formData.nameTamil.trim(),
      description: formData.description.trim() || 'Curriculum Syllabus and Practical Topics.',
      assignedTeacherId: formData.assignedTeacherId,
      imagePresentation: formData.imagePresentation || 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80'
    };

    if (onAddSubject) {
      onAddSubject(newSubject);
    }
    showToast(`Subject "${newSubject.name}" assigned to ${newSubject.standard}!`);
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingSubject) return;

    if (onUpdateSubject) {
      onUpdateSubject(editingSubject);
    }
    showToast(`Updated subject "${editingSubject.name}"`);
    setEditingSubject(null);
  };

  const handleConfirmDelete = () => {
    if (!subjectToDelete) return;
    if (onDeleteSubject) {
      onDeleteSubject(subjectToDelete.code);
    }
    showToast(`Removed subject "${subjectToDelete.name}".`, 'warning');
    setSubjectToDelete(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toastMessage.text && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between shadow-lg transition-all ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center space-x-2.5">
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
            <span className="font-medium">{toastMessage.text}</span>
          </div>
          <button onClick={() => setToastMessage({ text: '', type: 'success' })}>
            <X className="w-4 h-4 hover:opacity-75" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Layers className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-extrabold text-white">Subject Management</h3>
          </div>
          <p className="text-xs text-slate-400">
            Create, edit, and assign subjects across class standards and assign faculty specialists to handle each syllabus.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Subject</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by subject name or code..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="all">All Class Standards</option>
            {standardsList.map((std) => (
              <option key={std.id || std.name} value={std.name}>{std.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Curriculum Subjects ({filteredSubjects.length})
          </span>
        </div>

        {filteredSubjects.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No subjects found for the selected criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSubjects.map((sub) => {
              const teacherObj = teachers.find(t => t.id === sub.assignedTeacherId);
              return (
                <div key={sub.code} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-3 hover:border-slate-700 transition-all">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/30">
                        {sub.standard}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 font-bold">
                        {sub.code}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-white leading-snug">{sub.name}</h4>
                    {sub.nameTamil && (
                      <p className="text-xs text-indigo-300 font-medium">{sub.nameTamil}</p>
                    )}
                    <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                      {sub.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px] font-bold">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[11px] text-slate-300 truncate max-w-[130px]">
                        {teacherObj?.name || 'Unassigned Faculty'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => setEditingSubject({ ...sub })}
                        className="p-1.5 rounded-lg bg-slate-800 text-blue-300 hover:text-white hover:bg-blue-600 transition-colors"
                        title="Edit Subject"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSubjectToDelete(sub)}
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                        title="Remove Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL: ADD SUBJECT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-blue-400" />
                <h4 className="text-base font-extrabold text-white">Create New Subject</h4>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Subject Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. TN10-MAT"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Class Standard *</label>
                  <select
                    value={formData.standard}
                    onChange={(e) => setFormData({ ...formData, standard: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    {standardsList.map((std) => (
                      <option key={std.id || std.name} value={std.name}>{std.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Assigned Faculty *</label>
                  <select
                    value={formData.assignedTeacherId}
                    onChange={(e) => setFormData({ ...formData, assignedTeacherId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="">-- Select Teacher --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Regional Name / Tamil Translation</label>
                <input
                  type="text"
                  placeholder="e.g. கணிதம்"
                  value={formData.nameTamil}
                  onChange={(e) => setFormData({ ...formData, nameTamil: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Description & Syllabus Overview</label>
                <textarea
                  rows={2}
                  placeholder="Brief curriculum overview..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT SUBJECT */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <h4 className="text-base font-extrabold text-white">Edit Subject Details</h4>
              </div>
              <button onClick={() => setEditingSubject(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Subject Name</label>
                  <input
                    type="text"
                    required
                    value={editingSubject.name}
                    onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Class Standard</label>
                  <select
                    value={editingSubject.standard}
                    onChange={(e) => setEditingSubject({ ...editingSubject, standard: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    {standardsList.map((std) => (
                      <option key={std.id || std.name} value={std.name}>{std.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Regional / Tamil Name</label>
                  <input
                    type="text"
                    value={editingSubject.nameTamil || ''}
                    onChange={(e) => setEditingSubject({ ...editingSubject, nameTamil: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Assigned Faculty</label>
                  <select
                    value={editingSubject.assignedTeacherId || ''}
                    onChange={(e) => setEditingSubject({ ...editingSubject, assignedTeacherId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    <option value="">-- Unassigned --</option>
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.specialization})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Description</label>
                <textarea
                  rows={2}
                  value={editingSubject.description || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                ></textarea>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-600/30"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE SUBJECT */}
      {subjectToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h4 className="text-lg font-extrabold text-white">Remove Subject?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to remove <strong className="text-white">"{subjectToDelete.name}"</strong> ({subjectToDelete.code}) from <strong className="text-indigo-400">{subjectToDelete.standard}</strong>?
            </p>

            <div className="flex items-center justify-center space-x-3 pt-3">
              <button
                onClick={() => setSubjectToDelete(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
