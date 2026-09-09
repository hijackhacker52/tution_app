import React, { useState } from 'react';
import { 
  GraduationCap, Plus, Search, Filter, Trash2, Edit3, Eye, 
  CheckCircle2, X, AlertCircle, ShieldAlert, Power, UserCheck, 
  Calendar, CreditCard, Mail, Key, User, Phone, BookOpen, AlertTriangle
} from 'lucide-react';

import { initialTuitionData } from '../../data/tuitionData';

export default function StudentManagement({ 
  students = [], 
  standardsList = [], 
  boardsList = initialTuitionData.boardsList || [],
  onAddStudent, 
  onUpdateStudent, 
  onDeleteStudent 
}) {
  const defaultBoard = boardsList[0]?.name || 'Tamil Nadu State Board (Samacheer Kalvi)';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterBoard, setFilterBoard] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Notifications
  const [toastMessage, setToastMessage] = useState({ text: '', type: 'success' });

  // Form State for Add
  const initialFormState = {
    name: '',
    email: '',
    studentId: '',
    standard: standardsList[0]?.name || 'Class 6',
    board: defaultBoard,
    gender: 'Male',
    dob: '2012-01-01',
    temporaryPassword: '',
    feePaid: false,
    feeAmount: 150,
    isActive: true
  };
  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState('');

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage({ text: '', type: 'success' }), 4000);
  };

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const sId = s.studentId || s.rollNo || s.id || '';
    const matchesSearch = 
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.email && s.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      sId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = filterClass === 'all' || s.standard === filterClass;
    const matchesBoard = 
      filterBoard === 'all' || 
      s.board === filterBoard || 
      (!s.board && filterBoard === defaultBoard);
    const matchesStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && s.isActive !== false) ||
      (filterStatus === 'suspended' && s.isActive === false) ||
      (filterStatus === 'paid' && s.feePaid) ||
      (filterStatus === 'unpaid' && !s.feePaid);

    return matchesSearch && matchesClass && matchesBoard && matchesStatus;
  });

  // Open Add Modal with generated default Student ID
  const handleOpenAddModal = () => {
    const nextSeq = String(students.length + 1).padStart(4, '0');
    setFormData({
      ...initialFormState,
      studentId: `STU${nextSeq}`,
      temporaryPassword: `Student#${new Date().getFullYear()}`,
      feeAmount: standardsList.find(s => s.name === (standardsList[0]?.name || 'Class 6'))?.feeAmount || 150
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  // Submit Add Student
  const handleAddSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.studentId.trim()) {
      setFormError('Please fill in student name, email, and student ID.');
      return;
    }

    // Check duplicate studentId
    const exists = students.some(
      s => (s.studentId && s.studentId.toLowerCase() === formData.studentId.trim().toLowerCase()) ||
           (s.email && s.email.toLowerCase() === formData.email.trim().toLowerCase())
    );
    if (exists) {
      setFormError('A student with this Student ID or Email already exists.');
      return;
    }

    const newStudent = {
      id: `std-${Date.now()}`,
      studentId: formData.studentId.trim().toUpperCase(),
      rollNo: formData.studentId.trim().toUpperCase(),
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      gender: formData.gender,
      dob: formData.dob,
      role: 'Student',
      standard: formData.standard,
      board: formData.board || defaultBoard,
      feePaid: Boolean(formData.feePaid),
      feeAmount: Number(formData.feeAmount) || 150,
      attendanceRate: 100,
      isActive: formData.isActive !== false,
      avatar: formData.gender === 'Female' 
        ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      academicYearValidUntil: '2027-03-31',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (onAddStudent) {
      onAddStudent(newStudent);
    }
    showToast(`Student "${newStudent.name}" enrolled in ${newStudent.standard}!`);
    setIsAddModalOpen(false);
  };

  // Submit Edit Student
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingStudent) return;

    if (onUpdateStudent) {
      onUpdateStudent(editingStudent);
    }
    showToast(`Updated details for "${editingStudent.name}"`);
    setEditingStudent(null);
  };

  // Toggle Student Access Status
  const handleToggleAccess = (student) => {
    const updated = { ...student, isActive: student.isActive === false ? true : false };
    if (onUpdateStudent) {
      onUpdateStudent(updated);
    }
    showToast(`Student ${updated.name} access ${updated.isActive ? 'activated' : 'suspended'}!`, updated.isActive ? 'success' : 'warning');
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!studentToDelete) return;
    if (onDeleteStudent) {
      onDeleteStudent(studentToDelete.id);
    }
    showToast(`Removed student record "${studentToDelete.name}".`, 'warning');
    setStudentToDelete(null);
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
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <GraduationCap className="w-5 h-5" />
            </span>
            <h3 className="text-xl font-extrabold text-white">Student Management</h3>
          </div>
          <p className="text-xs text-slate-400">
            Enrol, organize by class standards (6th to 12th), configure login credentials, fee status, and access control.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30 transition-all transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Student</span>
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
            placeholder="Search by student name, ID, or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
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
            <span className="hidden sm:inline">Class:</span>
          </div>
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="all">All Classes</option>
            {standardsList.map((std) => (
              <option key={std.id || std.name} value={std.name}>{std.name}</option>
            ))}
          </select>

          <select
            value={filterBoard}
            onChange={(e) => setFilterBoard(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="all">All Boards</option>
            {boardsList.map((b) => (
              <option key={b.id || b.name} value={b.name}>{b.shortName || b.name}</option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500 shrink-0"
          >
            <option value="all">All Status</option>
            <option value="active">Active Access</option>
            <option value="suspended">Access Suspended</option>
            <option value="paid">Fee Paid</option>
            <option value="unpaid">Fee Pending</option>
          </select>
        </div>
      </div>

      {/* Students List Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Enrolled Students</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
              {filteredStudents.length} of {students.length}
            </span>
          </div>
        </div>

        {filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-white">No students found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {students.length === 0 
                ? 'There are currently no students enrolled. Click "Add New Student" to get started.'
                : 'No students matched your search or class filter criteria.'}
            </p>
            {students.length === 0 && (
              <button
                onClick={handleOpenAddModal}
                className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add First Student</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Class Standard</th>
                  <th className="py-3.5 px-4">Student ID / Roll</th>
                  <th className="py-3.5 px-4">Fee Status</th>
                  <th className="py-3.5 px-4">Access Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredStudents.map((student) => {
                  const isSuspended = student.isActive === false;
                  return (
                    <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={student.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"}
                            alt={student.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-white text-xs leading-snug">{student.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{student.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Class & Board */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-[11px] border border-indigo-500/30 inline-block">
                            {student.standard}
                          </span>
                          <div className="text-[10px] text-emerald-400 font-medium flex items-center space-x-1">
                            <span>🎓</span>
                            <span>{student.board || defaultBoard}</span>
                          </div>
                        </div>
                      </td>

                      {/* Student ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-300">
                        {student.studentId || student.rollNo || 'STU0001'}
                      </td>

                      {/* Fee Status */}
                      <td className="py-3.5 px-4">
                        {student.feePaid ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                            Paid (₹{student.feeAmount || 150})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/30">
                            Pending (₹{student.feeAmount || 150})
                          </span>
                        )}
                      </td>

                      {/* Access Status Toggle */}
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleToggleAccess(student)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                            isSuspended 
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30' 
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                          }`}
                          title="Click to toggle access permission"
                        >
                          <Power className="w-3 h-3" />
                          <span>{isSuspended ? 'Suspended' : 'Active'}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => setViewingStudent(student)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                            title="View Student Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingStudent({ ...student })}
                            className="p-1.5 rounded-lg bg-slate-800 text-indigo-300 hover:text-white hover:bg-indigo-600 transition-colors"
                            title="Edit Student"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setStudentToDelete(student)}
                            className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-colors"
                            title="Remove Student"
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

      {/* MODAL: ADD STUDENT */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-indigo-400" />
                <h4 className="text-base font-extrabold text-white">Enroll New Student</h4>
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
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Student ID / Roll No *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STU0004"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Student Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Assign Class Standard *</label>
                  <select
                    value={formData.standard}
                    onChange={(e) => {
                      const selectedStd = e.target.value;
                      const matchedObj = standardsList.find(s => s.name === selectedStd);
                      setFormData({ 
                        ...formData, 
                        standard: selectedStd,
                        feeAmount: matchedObj?.feeAmount || formData.feeAmount
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {standardsList.map((std) => (
                      <option key={std.id || std.name} value={std.name}>{std.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Educational Board / Curriculum Selector */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Educational Board / Curriculum *</label>
                <select
                  value={formData.board}
                  onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                >
                  {boardsList.map((b) => (
                    <option key={b.id || b.name} value={b.name}>
                      {b.name} ({b.curriculum || b.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Date of Birth</label>
                  <input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Login Temp Password</label>
                  <input
                    type="text"
                    value={formData.temporaryPassword}
                    onChange={(e) => setFormData({ ...formData, temporaryPassword: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Tuition Fee Amount (₹)</label>
                  <input
                    type="number"
                    value={formData.feeAmount}
                    onChange={(e) => setFormData({ ...formData, feeAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.feePaid}
                    onChange={(e) => setFormData({ ...formData, feePaid: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-300 text-xs">Fee Paid Upfront</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-300 text-xs">Portal Access Enabled</span>
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
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Enroll Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT STUDENT */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-indigo-400" />
                <h4 className="text-base font-extrabold text-white">Edit Student Details</h4>
              </div>
              <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-white">
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
                    value={editingStudent.name}
                    onChange={(e) => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Class Standard</label>
                  <select
                    value={editingStudent.standard}
                    onChange={(e) => setEditingStudent({ ...editingStudent, standard: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  >
                    {standardsList.map((std) => (
                      <option key={std.id || std.name} value={std.name}>{std.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Edit Educational Board */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Educational Board</label>
                <select
                  value={editingStudent.board || defaultBoard}
                  onChange={(e) => setEditingStudent({ ...editingStudent, board: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                >
                  {boardsList.map((b) => (
                    <option key={b.id || b.name} value={b.name}>
                      {b.name} ({b.curriculum || b.shortName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Email</label>
                  <input
                    type="email"
                    required
                    value={editingStudent.email}
                    onChange={(e) => setEditingStudent({ ...editingStudent, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Student ID / Roll</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.studentId || editingStudent.rollNo}
                    onChange={(e) => setEditingStudent({ ...editingStudent, studentId: e.target.value, rollNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Tuition Fee Amount (₹)</label>
                  <input
                    type="number"
                    value={editingStudent.feeAmount || 150}
                    onChange={(e) => setEditingStudent({ ...editingStudent, feeAmount: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 uppercase text-[10px]">Attendance Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={editingStudent.attendanceRate || 100}
                    onChange={(e) => setEditingStudent({ ...editingStudent, attendanceRate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStudent.feePaid}
                    onChange={(e) => setEditingStudent({ ...editingStudent, feePaid: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-300 text-xs">Fee Paid</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingStudent.isActive !== false}
                    onChange={(e) => setEditingStudent({ ...editingStudent, isActive: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-indigo-600 focus:ring-0"
                  />
                  <span className="text-slate-300 text-xs">Portal Access Enabled</span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW STUDENT DETAILS */}
      {viewingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Student Profile</span>
              <button onClick={() => setViewingStudent(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-3">
              <img
                src={viewingStudent.avatar || "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"}
                alt={viewingStudent.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto border-2 border-indigo-500/40 shadow-xl"
              />
              <div>
                <h4 className="text-lg font-extrabold text-white">{viewingStudent.name}</h4>
                <p className="text-xs text-indigo-300 font-mono">{viewingStudent.email}</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                  {viewingStudent.standard}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                  viewingStudent.isActive !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {viewingStudent.isActive !== false ? 'Active Access' : 'Access Suspended'}
                </span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs space-y-2.5">
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Educational Board:</span>
                <span className="font-semibold text-emerald-400">{viewingStudent.board || defaultBoard}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Student ID / Roll:</span>
                <span className="font-mono font-bold text-white">{viewingStudent.studentId || viewingStudent.rollNo}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Gender:</span>
                <span className="text-white">{viewingStudent.gender || 'Not specified'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Date of Birth:</span>
                <span className="text-white">{viewingStudent.dob || 'Not recorded'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/80">
                <span className="text-slate-400">Fee Status:</span>
                <span className={viewingStudent.feePaid ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {viewingStudent.feePaid ? `Paid (₹${viewingStudent.feeAmount || 150})` : `Pending (₹${viewingStudent.feeAmount || 150})`}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Attendance Rate:</span>
                <span className="text-indigo-300 font-bold">{viewingStudent.attendanceRate || 100}%</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingStudent(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE STUDENT */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h4 className="text-lg font-extrabold text-white">Remove Student?</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently remove <strong className="text-white">"{studentToDelete.name}"</strong> ({studentToDelete.studentId || studentToDelete.rollNo}) from <strong className="text-indigo-400">{studentToDelete.standard}</strong>?
            </p>
            <p className="text-[11px] text-rose-300 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              This action will revoke their login access and learning space enrollment.
            </p>

            <div className="flex items-center justify-center space-x-3 pt-3">
              <button
                onClick={() => setStudentToDelete(null)}
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
