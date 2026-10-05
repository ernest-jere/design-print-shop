// src/components/FileUploader.jsx
import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle2, Loader2 } from 'lucide-react';

export default function FileUploader({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

     const processFile = async (selectedFile) => {
    if (!selectedFile) return;

    const targetCloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const presetName = import.meta.env.VITE_CLOUDINARY_PRESET;

    // 🌟 SAFETY GUARDRAIL: Catch configuration setup errors gracefully
    if (!targetCloud || !presetName) {
      setFile(null);
      alert("Configuration Error: Missing Cloudinary environment variables in your .env file. Please check your setup parameters.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB threshold limit.");
      return;
    }

    setFile(selectedFile);
    setUploading(true);
    setUploadDone(false);

    const dataPayload = new FormData();
    dataPayload.append("file", selectedFile);
    dataPayload.append("upload_preset", presetName);

  try {
    const response = await fetch(`https://cloudinary.com{targetCloud}/upload`, {
      method: "POST",
      body: dataPayload
    });

    const fileJson = await response.json();

    if (!response.ok) {
      // 🌟 PRINTS THE EXACT REJECTION REASON FROM CLOUDINARY
      throw new Error(fileJson.error?.message || "Cloud transfer payload rejected.");
    }
      
    setUploading(false);
    setUploadDone(true);
    onUploadSuccess(fileJson.secure_url);

  } catch (err) {
    setUploading(false);
    setFile(null);
    // Alerts you to the exact issue (e.g., "Upload preset not found")
    alert(`Cloud Delivery Error: ${err.message}`);
    console.error(err);
  }  

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    setUploadDone(false);
    onUploadSuccess(""); // Flush url parameter reference
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-2">
      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Attach Design Assets or Specifications (Optional)
      </label>
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer min-h-[140px]
          ${dragActive ? "border-blue-500 bg-blue-50/30 scale-[0.99]" : "border-slate-200 hover:border-slate-300 bg-slate-50/40"}
          ${uploadDone ? "border-emerald-500 bg-emerald-50/10" : ""}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.ai,.psd,.eps"
          onChange={handleChange}
          disabled={uploading || uploadDone}
        />

        {!file && (
          <div className="space-y-2">
            <div className="mx-auto p-2.5 bg-white shadow-sm border border-slate-100 text-slate-500 rounded-lg w-fit">
              <Upload className="h-5 w-5 animate-pulse text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Drag & drop your files here, or <span className="text-blue-600 underline">browse</span></p>
              <p className="text-[10px] text-slate-400 mt-0.5">Supports PDF, AI, PSD, EPS, PNG, or JPG up to 10MB</p>
            </div>
          </div>
        )}

        {file && (
          <div className="w-full flex items-center justify-between bg-white border border-slate-100 rounded-lg p-3 shadow-sm">
            <div className="flex items-center gap-3 text-left min-w-0">
              <div className={`p-2 rounded-md ${uploadDone ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <File className="h-4 w-4" />}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-800 truncate pr-2">{file.name}</p>
                <p className="text-[10px] text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {uploadDone && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFile(); }}
                className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
