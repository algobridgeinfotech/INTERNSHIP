"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  type: "student" | "staff";
}

export function BulkUploadModal({ isOpen, onClose, onSuccess, type }: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const endpoint = type === "staff" ? "http://localhost:5001/api/staff/bulk-upload" : "http://localhost:5001/api/students/bulk-upload";
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: `Successfully imported ${data.count || 0} ${type} records.` });
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setStatus({ type: "error", message: data.message || "Failed to upload records." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const downloadSample = () => {
    const headers = type === "staff" 
      ? "name,email,phone,jobTitle,department,businessUnit,subDepartment,location,costCenter,reportingManager,managerEmail,managerDepartment,emergencyContactName,emergencyContactPhone,emergencyContactRelation"
      : "name,email,phone,grade,parentName,parentPhone,parentEmail,country,feeStatus,enrollmentStatus,counsellorId";
    
    const blob = new Blob([headers], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_sample.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        <div className="bg-[#0B132B] p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Upload className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Bulk Upload {type === "staff" ? "Staff" : "Students"}</h2>
              <p className="text-slate-400 text-xs">Import records via CSV file</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
              file ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-blue-400 hover:bg-slate-50"
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
            <div className={`p-4 rounded-full mb-4 ${file ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}`}>
              <FileText className="h-8 w-8" />
            </div>
            <p className="font-bold text-slate-700">{file ? file.name : "Select CSV File"}</p>
            <p className="text-slate-400 text-sm mt-1">or drag and drop here</p>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
            <h4 className="text-sm font-bold text-slate-700 mb-2">Instructions</h4>
            <ul className="text-xs text-slate-500 space-y-1 list-disc ml-4">
              <li>Only .csv files are supported.</li>
              <li>Column headers must match the sample format.</li>
              <li>Avoid duplicate emails; they will be skipped.</li>
            </ul>
            <button 
              onClick={downloadSample}
              className="mt-3 text-blue-600 text-xs font-bold hover:underline flex items-center"
            >
              Download Sample CSV
            </button>
          </div>

          {status && (
            <div className={`p-4 rounded-xl flex items-center space-x-3 ${
              status.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
            }`}>
              {status.type === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex space-x-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
            {loading ? "Uploading..." : "Start Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
