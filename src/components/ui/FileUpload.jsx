import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, RefreshCw, FileCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../services/supabase';

export default function FileUpload({ 
  bucketName = 'tuition-materials', 
  allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'],
  maxSizeBytes = 25 * 1024 * 1024, // 25 MB
  onUploadSuccess,
  onUploadError 
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    if (!file) return 'No file selected.';

    // Check File Size
    if (file.size > maxSizeBytes) {
      return `File size (${formatFileSize(file.size)}) exceeds the maximum allowed limit of ${formatFileSize(maxSizeBytes)}.`;
    }

    // Check File Extension
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      return `File extension "${fileExt}" is not permitted. Allowed formats: ${allowedExtensions.join(', ')}`;
    }

    // Block Dangerous Executables
    const executableExts = ['.exe', '.bat', '.cmd', '.sh', '.msi', '.vbs', '.js', '.jar'];
    if (executableExts.includes(fileExt)) {
      return 'Executable and script files are prohibited for security.';
    }

    return null;
  };

  const handleFileSelect = (file) => {
    setErrorMessage('');
    setSuccessMessage('');
    const error = validateFile(file);
    if (error) {
      setErrorMessage(error);
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    try {
      let fileUrl = '#';
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Simulate Upload Progress bar
      const timer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(timer);
            return 90;
          }
          return prev + 20;
        });
      }, 150);

      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, selectedFile, { cacheControl: '3600', upsert: true });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);

        fileUrl = publicUrlData.publicUrl;
      }

      clearInterval(timer);
      setUploadProgress(100);
      setIsUploading(false);
      setSuccessMessage(`File "${selectedFile.name}" uploaded successfully!`);

      if (onUploadSuccess) {
        onUploadSuccess({
          fileName: selectedFile.name,
          fileSize: formatFileSize(selectedFile.size),
          fileUrl,
          uploadedAt: new Date().toLocaleDateString()
        });
      }

      setSelectedFile(null);
    } catch (err) {
      setIsUploading(false);
      setUploadProgress(0);
      const errText = err.message || 'File upload failed. Please try again.';
      setErrorMessage(errText);
      if (onUploadError) onUploadError(errText);
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Feedback Alert Messages */}
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

      {/* Drag & Drop Dropzone Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
          accept={allowedExtensions.join(',')}
        />

        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center mb-3">
          <Upload className="w-6 h-6" />
        </div>

        <h4 className="font-bold text-white text-sm">Drag & Drop File Here</h4>
        <p className="text-xs text-slate-400 mt-1">or click to browse files from your device</p>
        <p className="text-[10px] text-slate-500 mt-2 font-mono">
          Allowed: PDF, DOCX, PPTX, XLSX, Images (Max: {formatFileSize(maxSizeBytes)})
        </p>
      </div>

      {/* Selected File Details Box */}
      {selectedFile && (
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <p className="font-bold text-white leading-tight">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-400">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Uploading to Supabase Storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-1">
            <button
              type="button"
              onClick={() => setSelectedFile(null)}
              className="w-1/3 py-2.5 rounded-xl border border-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-800"
            >
              Remove
            </button>
            <button
              type="button"
              onClick={handleUploadSubmit}
              disabled={isUploading}
              className="w-2/3 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/30"
            >
              <FileCheck className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Confirm Upload'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
