import React, { useState } from 'react';
import { 
  Users, Plus, Search, Filter, Trash2, Edit3, Eye, 
  CheckCircle2, X, AlertCircle, Power, UserCheck, 
  BookOpen, Layers, DollarSign, Clock, Phone, Mail, Award, AlertTriangle, Shield
} from 'lucide-react';

export default function TeacherManagement({ 
  teachers = [], 
  standardsList = [], 
  subjects = [], 
  onAddTeacher, 
  onUpdateTeacher, 
  onDeleteTeacher 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [viewingTeacher, setViewingTeacher] = useState(null);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  // Toast Notifications
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });

  // Form State for Add
  const initialFormState = {
    name: '',
    email: '',
    teacherId: '',
    specialization: 'Mathematics & Computer Science',
    role: 'Senior Faculty',
    assignedClasses: ['Class 10 (SSLC)'],
    assignedSubjects: ['Mathematics (கணிதம்)'],
    hourlyRate: 45,
    phone: '',
    temporaryPassword: '',
    isPublicFeatured: false,
    status: 'Active Online',
    isActive: true
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 4000);
  };

  // Filter Teachers
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch = 
      (t.name && t.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.email && t.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.specialization && t.specialization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.id && t.id.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesSubject = filterSubject === 'all' || 
      (t.specialization && t.specialization.toLowerCase().includes(filterSubject.toLowerCase())) ||
      (t.assignedSubjects && t.assignedSubjects.some(s => s.toLowerCase().includes(filterSubject.toLowerCase())));

    const matchesStatus = filterStatus === 'all' ||
      (filterStatus === 'active' && t.isActive !== false && t.status !== 'Access Suspended') ||
      (filterStatus === 'suspended' && (t.isActive === false || t.status === 'Access Suspended')) ||
      (filterStatus === 'clockedIn' && t.clockedIn);

    return matchesSearch && matchesSubject && matchesStatus;
  });

  // Open Add Modal with generated default Teacher ID
  const handleOpenAddModal = () => {
    const nextSeq = String(teachers.length + 1);
    setFormData({
      ...initialFormState,
      teacherId: `tch-${nextSeq}`,
      temporaryPassword: `Teacher#${new Date().getFullYear()}`
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Toggle class selection in form
  const handleClassCheckboxToggle = (className, isEditing = false) => {
    if (isEditing && editingTeacher) {
      const current = editingTeacher.assignedClasses || [];
      const updated = current.includes(className)
        ? current.filter(c => c !== className)
        : [...current, className];
      setEditingTeacher({ ...editingTeacher, assignedClasses: updated });
    } else {
      const current = formData.assignedClasses || [];
      const updated = current.includes(className)
        ? current.filter(c => c !== className)
        : [...current, className];
      setFormData({ ...formData, assignedClasses: updated });
    }
  };

  // Submit Add Teacher
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('Please provide teacher name and email.');
      return;
    }

    const exists = teachers.some(
      t => (t.id && t.id.toLowerCase() === formData.teacherId.trim().toLowerCase()) ||
           (t.email && t.email.toLowerCase() === formData.email.trim().toLowerCase())
    );
    if (exists) {
      setFormError('A teacher with this ID or Email already exists.');
      return;
    }

    const newTeacher = {
      id: formData.teacherId.trim() || `tch-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role.trim() || 'Faculty Specialist',
      specialization: formData.specialization.trim(),
      assignedClasses: formData.assignedClasses.length > 0 ? formData.assignedClasses : ['Class 10 (SSLC)'],
      assignedSubjects: formData.assignedSubjects,
      hourlyRate: Number(formData.hourlyRate) || 45,
      phone: formData.phone.trim(),
      hoursThisMonth: 0,
      clockedIn: false,
      status: formData.status || 'Active Online',
      isActive: formData.isActive !== false,
      isPublicFeatured: Boolean(formData.isPublicFeatured),
      rating: 5.0,
      doubtsSolved: 0,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (onAddTeacher) {
      onAddTeacher(newTeacher);
    }
    showToast(`Teacher "${newTeacher.name}" successfully added!`);
    setIsAddModalOpen(false);
  };

  // Submit Edit Teacher
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingTeacher) return;

    if (onUpdateTeacher) {
      onUpdateTeacher(editingTeacher);
    }
    showToast(`Updated details for "${editingTeacher.name}"`);
    setEditingTeacher(null);
  };

  // Toggle Access Status
  const handleToggleAccess = (teacher) => {
    const isCurrentlyActive = teacher.isActive !== false && teacher.status !== 'Access Suspended';
    const updated = {
      ...teacher,
      isActive: !isCurrentlyActive,
      status: !isCurrentlyActive ? 'Clocked Out' : 'Access Suspended'
    };
    if (onUpdateTeacher) {
      onUpdateTeacher(updated);
    }
    showToast(`Teacher ${updated.name} access ${updated.isActive ? 'activated' : 'suspended'}!`, updated.isActive ? 'success' : 'warning');
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!teacherToDelete) return;
    if (onDeleteTeacher) {
      onDeleteTeacher(teacherToDelete.id);
    }
    showToast(`Removed faculty record "${teacherToDelete.name}".`, 'warning');
    setTeacherToDelete(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
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
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Users className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-extrabold text-white">Teacher Management</h3>
          </div>
          <p className="text-xs text-slate-400">
            Control which classes & subjects teachers handle, view work records, and manage access permissions securely.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Teacher</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by teacher name, ID, or subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 transition-colors placeholder:text-slate-600"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto no-scrollbar">
          <div className="flex items-center space-x-1 text-slate-400 text-xs shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Status:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-purple-500 shrink-0"
          >
            <option value="all">All Status</option>
            <option value="active">Active Online / Ready</option>
            <option value="suspended">Access Suspended</option>
            <option value="clockedIn">Currently Clocked In</option>
          </select>
        </div>
      </div>

      {/* Teachers List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Faculty Members</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
              {filteredTeachers.length} of {teachers.length}
            </span>
          </div>
        </div>

        {filteredTeachers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
              <Users className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white">No teachers found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {teachers.length === 0 
                ? 'There are currently no teachers registered. Click "Add New Teacher" to appoint faculty.'
                : 'No teachers matched your search or status filter criteria.'}
            </p>
            {teachers.length === 0 && (
              <button
                onClick={handleOpenAddModal}
                className="mt-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold inline-flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Teacher</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Teacher</th>
                  <th className="py-3.5 px-4">Specialization</th>
                  <th className="py-3.5 px-4">Classes Handled</th>
                  <th className="py-3.5 px-4">Work Status</th>
                  <th className="py-3.5 px-4">Access Control</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredTeachers.map((teacher) => {
                  const isSuspended = teacher.isActive === false || teacher.status === 'Access Suspended';
                  const classesList = teacher.assignedClasses || ['Class 10 (SSLC)'];
                  return (
                    <tr key={teacher.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={teacher.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"}
                            alt={teacher.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-xs leading-snug">{teacher.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{teacher.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Specialization */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30">
                          {teacher.specialization}
                        </span>
                      </td>

                      {/* Classes Handled */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {classesList.slice(0, 2).map((c, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                              {c}
                            </span>
                          ))}
                          {classesList.length > 2 && (
                            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 text-[10px] font-bold">
                              +{classesList.length - 2}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Work Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          teacher.clockedIn 
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${teacher.clockedIn ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                          {teacher.status || (teacher.clockedIn ? 'Clocked In' : 'Clocked Out')}
                        </span>
                      </td>

                      {/* Access Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAccess(teacher)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isSuspended 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30' 
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                          }`}
                          title="Click to toggle access permission"
                        >
                          <Power className="w-3 h-3" />
                          <span>{isSuspended ? 'Suspended' : 'Allowed'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setViewingTeacher(teacher)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            title="View Faculty Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingTeacher({ ...teacher })}
                            className="p-1.5 rounded-lg bg-slate-800 text-purple-300 hover:text-white hover:bg-purple-600 transition-colors"
                            title="Edit Teacher"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setTeacherToDelete(teacher)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Remove Teacher"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: ADD TEACHER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-400" />
                <h4 className="text-base font-extrabold text-white">Appoint New Faculty Member</h4>
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
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. K. Annamalai"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Teacher ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. tch-6"
                    value={formData.teacherId}
                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value.toLowerCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. faculty@learninghub.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Specialization *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Physics & Chemistry"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Class Assignment Checkboxes */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase text-[10px]">
                  Classes Handled by Teacher (Admin Control) *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 max-h-36 overflow-y-auto">
                  {standardsList.map((std) => {
                    const isChecked = (formData.assignedClasses || []).includes(std.name);
                    return (
                      <label key={std.id || std.name} className="flex items-center space-x-2 text-[11px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleClassCheckboxToggle(std.name, false)}
                          className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0"
                        />
                        <span className="truncate">{std.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Hourly Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                  />
                  <span className="text-slate-300 text-xs">Faculty Portal Access Granted</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublicFeatured}
                    onChange={(e) => setFormData({ ...formData, isPublicFeatured: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                  />
                  <span className="text-slate-300 text-xs">Show on Public Teachers Page</span>
                </label>
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
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30"
                >
                  Appoint Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT TEACHER */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-purple-400" />
                <h4 className="text-base font-extrabold text-white">Edit Faculty Details</h4>
              </div>
              <button onClick={() => setEditingTeacher(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.name}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Specialization</label>
                  <input
                    type="text"
                    required
                    value={editingTeacher.specialization}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, specialization: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Email</label>
                  <input
                    type="email"
                    required
                    value={editingTeacher.email}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Hourly Rate (₹/hr)</label>
                  <input
                    type="number"
                    value={editingTeacher.hourlyRate || 45}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, hourlyRate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              {/* Classes Handled */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5 uppercase text-[10px]">Classes Handled</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-slate-950 p-3 rounded-2xl border border-slate-800 max-h-36 overflow-y-auto">
                  {standardsList.map((std) => {
                    const isChecked = (editingTeacher.assignedClasses || []).includes(std.name);
                    return (
                      <label key={std.id || std.name} className="flex items-center space-x-2 text-[11px] text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleClassCheckboxToggle(std.name, true)}
                          className="rounded bg-slate-900 border-slate-700 text-purple-600 focus:ring-0"
                        />
                        <span className="truncate">{std.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingTeacher.isActive !== false && editingTeacher.status !== 'Access Suspended'}
                    onChange={(e) => setEditingTeacher({ 
                      ...editingTeacher, 
                      isActive: e.target.checked,
                      status: e.target.checked ? 'Clocked Out' : 'Access Suspended'
                    })}
                    className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                  />
                  <span className="text-slate-300 text-xs">Faculty Access Permitted</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingTeacher.isPublicFeatured)}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, isPublicFeatured: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                  />
                  <span className="text-slate-300 text-xs">Public Profile Featured</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-lg shadow-purple-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW TEACHER DETAILS */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Faculty Dossier</span>
              <button onClick={() => setViewingTeacher(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-3">
              <img
                src={viewingTeacher.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80"}
                alt={viewingTeacher.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-purple-500/40 shadow-xl"
              />
              <div>
                <h4 className="text-lg font-extrabold text-white">{viewingTeacher.name}</h4>
                <p className="text-xs text-purple-300 font-mono">{viewingTeacher.email}</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
                  {viewingTeacher.specialization}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  viewingTeacher.isActive !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {viewingTeacher.isActive !== false ? 'Access Allowed' : 'Access Suspended'}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Teacher ID:</span>
                <span className="font-mono font-bold text-white">{viewingTeacher.id}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Classes Handled:</span>
                <span className="text-white text-right max-w-[200px] truncate">
                  {(viewingTeacher.assignedClasses || ['Class 10 (SSLC)']).join(', ')}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Hourly Rate:</span>
                <span className="text-emerald-400 font-bold">₹{viewingTeacher.hourlyRate || 45}/hr</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Work Hours This Month:</span>
                <span className="text-white font-bold">{viewingTeacher.hoursThisMonth || 0} hrs</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Student Doubts Solved:</span>
                <span className="text-purple-300 font-bold">{viewingTeacher.doubtsSolved || 0}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingTeacher(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE TEACHER */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h4 className="text-lg font-extrabold text-white">Remove Teacher?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently remove <strong className="text-white">"{teacherToDelete.name}"</strong> ({teacherToDelete.specialization})?
            </p>
            <p className="text-[11px] text-amber-300 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 text-left">
              ⚠️ Note: Any subjects or study materials assigned to this teacher should be reviewed and reassigned to avoid orphaned records.
            </p>

            <div className="flex items-center justify-center space-x-3 pt-3">
              <button
                onClick={() => setTeacherToDelete(null)}
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
