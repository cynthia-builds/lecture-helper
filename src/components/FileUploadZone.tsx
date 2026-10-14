import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Music,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
} from 'lucide-react';
import { UploadedFile } from '../types';

interface FileUploadZoneProps {
  uploadedFile: UploadedFile | null;
  setUploadedFile: (file: UploadedFile | null) => void;
  onTextExtracted?: (text: string) => void;
  disabled?: boolean;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  uploadedFile,
  setUploadedFile,
  onTextExtracted,
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: UploadedFile) => {
    const type = file.type || '';
    const name = file.name.toLowerCase();

    if (type.includes('pdf') || name.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-red-500" />;
    }
    if (type.startsWith('image/') || name.match(/\.(png|jpe?g|webp|gif)$/i)) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    if (type.startsWith('audio/') || name.match(/\.(mp3|wav|m4a|aac|webm|ogg)$/i)) {
      return <Music className="w-5 h-5 text-purple-500" />;
    }
    if (name.match(/\.(txt|md|srt|vtt|csv)$/i) || type.startsWith('text/')) {
      return <FileText className="w-5 h-5 text-amber-500" />;
    }
    return <File className="w-5 h-5 text-stone-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const processFile = (file: File) => {
    setUploadError(null);

    // Limit to 20MB for browser responsiveness and API limit
    if (file.size > 20 * 1024 * 1024) {
      setUploadError('File size is too large. Please upload files under 20MB.');
      return;
    }

    const isText =
      file.type.startsWith('text/') ||
      file.name.match(/\.(txt|md|srt|vtt|csv)$/i);

    // Handle plain text files
    if (isText) {
      const textReader = new FileReader();
      textReader.onload = (e) => {
        const content = (e.target?.result as string) || '';
        const uploaded: UploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          textContent: content,
        };
        setUploadedFile(uploaded);
        if (onTextExtracted && content.trim()) {
          onTextExtracted(content);
        }
      };
      textReader.onerror = () => {
        setUploadError('Could not read text file. Please try again.');
      };
      textReader.readAsText(file);
      return;
    }

    // Handle Binary Files (PDFs, Images, Audio)
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setUploadError('Failed to process file.');
        return;
      }

      // Extract base64 without prefix: "data:application/pdf;base64,..."
      const parts = result.split(',');
      const base64Data = parts.length > 1 ? parts[1] : parts[0];
      let mimeType = file.type;

      if (!mimeType) {
        if (file.name.endsWith('.pdf')) mimeType = 'application/pdf';
        else if (file.name.endsWith('.png')) mimeType = 'image/png';
        else if (file.name.match(/\.jpe?g$/i)) mimeType = 'image/jpeg';
        else if (file.name.endsWith('.webp')) mimeType = 'image/webp';
        else if (file.name.endsWith('.mp3')) mimeType = 'audio/mp3';
        else if (file.name.endsWith('.wav')) mimeType = 'audio/wav';
        else if (file.name.endsWith('.m4a')) mimeType = 'audio/m4a';
        else mimeType = 'application/octet-stream';
      }

      const isImage = mimeType.startsWith('image/');

      const uploaded: UploadedFile = {
        name: file.name,
        size: file.size,
        type: mimeType,
        mimeType,
        base64Data,
        previewUrl: isImage ? result : undefined,
      };

      setUploadedFile(uploaded);
    };

    reader.onerror = () => {
      setUploadError('Could not read the file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
      e.target.value = ''; // reset so same file can be re-uploaded if desired
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadError(null);
  };

  return (
    <div className="space-y-2">
      {/* Uploaded File Chip / Card */}
      {uploadedFile ? (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 flex items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3 min-w-0">
            {uploadedFile.previewUrl ? (
              <img
                src={uploadedFile.previewUrl}
                alt="Uploaded slide"
                className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-white border border-stone-200 flex items-center justify-center shrink-0 shadow-xs">
                {getFileIcon(uploadedFile)}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-stone-900 truncate max-w-[240px] sm:max-w-xs block">
                  {uploadedFile.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.2 rounded-full shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Ready
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {formatFileSize(uploadedFile.size)} • {uploadedFile.type || 'Lecture Material'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemoveFile}
            disabled={disabled}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg transition-colors"
            title="Remove attached file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        /* Dropzone / Upload Area */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-amber-500 bg-amber-50/70 scale-[0.99]'
              : 'border-stone-200 bg-stone-50/40 hover:bg-stone-50 hover:border-amber-400/80'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            accept=".pdf,.png,.jpg,.jpeg,.webp,.mp3,.wav,.m4a,.aac,.webm,.ogg,.txt,.md,.srt,.vtt,.csv"
            className="hidden"
            disabled={disabled}
          />

          <div className="flex flex-col items-center justify-center gap-1.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-stone-800">
                <span className="text-amber-600 hover:underline">Click to upload</span> or drag & drop lecture notes
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Supports PDF slides, lecture photos/diagrams (PNG, JPG), audio recordings (MP3, WAV), & text files (.txt, .md)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Error Message */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 font-medium px-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
};
