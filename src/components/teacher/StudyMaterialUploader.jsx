import React, { useState } from 'react';
import { FileText, Upload, BookOpen, Download, Trash2, CheckCircle2, FileCheck, Layers, Filter, Search } from 'lucide-react';
import FileUpload from '../ui/FileUpload';

export default function StudyMaterialUploader({ teacher, standardsList, subjects, materials, onUploadMaterial, onDeleteMaterial }) {
  const [title, setTitle] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('Class 10 (SSLC)');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics (கணிதம்)');
  const [fileType, setFileType] = useState('Question Paper'); // 'Question Paper' | 'Study Notes' | 'Model Answer Paper' | 'Revision Formula Sheet'
  const [chapter, setChapter] = useState('Chapter 1');
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Filter State for Management View
  const [filterClass, setFilterClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleUploadSuccess = (fileData) => {
    setUploadedFileData(fileData);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title || !uploadedFileData) return;

    const newMaterial = {
      id: `mat-${Date.now()}`,
      title,
      standard: selectedStandard,
      subject: selectedSubject,
      chapter,
      fileType,
      fileName: uploadedFileData.fileName,
      fileSize: uploadedFileData.fileSize,
      downloadUrl: uploadedFileData.fileUrl,
      uploadedBy: teacher?.name || 'Faculty Admin',
      uploadedAt: new Date().toLocaleDateString()
    };

    onUploadMaterial(newMaterial);
    setSuccessMessage(`"${title}" published successfully for ${selectedStandard} students!`);
    setTitle('');
    setUploadedFileData(null);
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const filteredMaterials = materials.filter((m) => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          m.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = filterClass === 'all' || m.standard === filterClass;
    return matchesSearch && matchesClass;
  });

  return (
    <div className="space-y-8">
      
      {/* Upload Interface Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400">
              <Upload className="w-5 h-5" />
              <h3 className="font-bold text-white text-lg">Study Material & Question Paper Upload</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload PDF notes, question papers, revision formula sheets, and model answers for Class 6 to 12.
            </p>
          </div>
        </div>

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Document Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Class 10 SSLC Maths Matrices Term 1 Paper"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Class / Standard *</label>
              <select
                value={selectedStandard}
                onChange={(e) => setSelectedStandard(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                {standardsList.map((std) => (
                  <option key={std.id} value={std.name}>{std.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Document Type *</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Question Paper">Question Paper</option>
                <option value="Study Notes">Study Notes</option>
                <option value="Model Answer Paper">Model Answer Paper</option>
                <option value="Revision Formula Sheet">Revision Formula Sheet</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Subject *</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Mathematics (கணிதம்)">Mathematics (கணிதம்)</option>
                <option value="Physics (இயற்பியல்)">Physics (இயற்பியல்)</option>
                <option value="Chemistry (வேதியியல்)">Chemistry (வேதியியல்)</option>
                <option value="Computer Science (கணினி அறிவியல்)">Computer Science (கணினி அறிவியல்)</option>
                <option value="Tamil (தமிழ்)">Tamil (தமிழ்)</option>
                <option value="English">English</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Chapter / Topic</label>
              <input
                type="text"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                placeholder="e.g. Chapter 1 Algebra"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Universal Drag & Drop Upload Zone */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">File Upload (PDF, DOCX, PPTX, Images) *</label>
            <FileUpload
              bucketName="tuition-materials"
              onUploadSuccess={handleUploadSuccess}
            />
          </div>

          <button
            type="submit"
            disabled={!title || !uploadedFileData}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <FileCheck className="w-4 h-4" />
            <span>Publish Study Document</span>
          </button>
        </form>
      </div>

      {/* Published Repository Management View */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="font-bold text-white text-base">Published Study Materials Repository</h3>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search materials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
              />
            </div>

            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-1.5"
            >
              <option value="all">All Classes</option>
              <option value="Class 10 (SSLC)">Class 10 (SSLC)</option>
              <option value="Class 12 (HSC)">Class 12 (HSC)</option>
            </select>
          </div>
        </div>

        {filteredMaterials.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
            No study materials found matching your filters. Use the form above to upload new documents.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMaterials.map((mat) => (
              <div key={mat.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                      {mat.fileType}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">{mat.uploadedAt}</span>
                  </div>

                  <h5 className="font-bold text-white text-sm mt-2">{mat.title}</h5>
                  <p className="text-xs text-slate-400">{mat.standard} • {mat.subject}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1">File: {mat.fileName}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400">Uploaded by: {mat.uploadedBy}</span>
                  <div className="flex items-center space-x-2">
                    <a
                      href={mat.downloadUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 text-xs font-semibold"
                      title="Download material"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => onDeleteMaterial(mat.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold"
                      title="Delete material"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
