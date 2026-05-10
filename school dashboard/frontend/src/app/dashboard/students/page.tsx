"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  GraduationCap, Plus, Search, Filter, MoreHorizontal, Download, 
  Upload, RefreshCw, LayoutGrid, List, CheckCircle2, AlertCircle, 
  MapPin, Bus, UserCircle, Trash2, Edit2
} from "lucide-react";
import { AddStudentModal } from "@/components/modals/AddStudentModal";
import { EditStudentModal } from "@/components/modals/EditStudentModal";
import { BulkUploadModal } from "@/components/modals/BulkUploadModal";

import api from "@/lib/api";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/students");
      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) {
        console.error("Error deleting student:", err);
      }
    }
  };

  const handleDownload = () => {
    if (students.length === 0) return;
    const headers = Object.keys(students[0]).filter(k => k !== "_id" && k !== "__v" && k !== "schoolId" && k !== "userId").join(",");
    const rows = students.map(s => {
      return Object.keys(students[0])
        .filter(k => k !== "_id" && k !== "__v" && k !== "schoolId" && k !== "userId")
        .map(k => `"${s[k] || ''}"`)
        .join(",");
    }).join("\n");
    
    const csvContent = `${headers}\n${rows}`;
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Student_Data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0B132B] p-8 shadow-sm">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent opacity-50"></div>
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-white/5 bg-white/5 blur-sm"></div>
        
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center text-xs font-medium text-slate-300 mb-6 space-x-2">
            <Link href="/dashboard" className="hover:text-white transition-colors">Home</Link>
            <span className="opacity-50">&gt;</span>
            <span className="text-white">Students</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <UserCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Students</h1>
              <p className="text-slate-300 text-sm">
                Single pane of glass for admissions, counselling, academics, fees, and support workflows.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-4 bg-white p-3 rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
        <div className="relative w-full xl:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by student ID, name, parent, grade, phone..." 
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Filter className="h-4 w-4 mr-2" /> Filters <span className="ml-2 text-[10px]">▼</span>
          </button>
          <button onClick={() => setViewMode(viewMode === "table" ? "card" : "table")} className="flex items-center px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <LayoutGrid className="h-4 w-4 mr-2" /> {viewMode === "table" ? "Card View" : "Table View"}
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Plus className="h-4 w-4 mr-2" /> Add Student
          </button>
          <button onClick={() => setIsUploadModalOpen(true)} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Upload className="h-4 w-4 mr-2" /> Upload
          </button>
          <button onClick={handleDownload} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Download Data
          </button>
          <button onClick={fetchStudents} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Advanced Filters Block */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div className="flex items-center text-sm font-bold text-slate-700 mb-4">
          <Filter className="h-4 w-4 mr-2" /> Advanced Filters
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Class / Grade</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
              <option>All Grades</option>
              {[...Array(12)].map((_, i) => (
                <option key={i+1}>Grade {i+1}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Parent Status</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
              <option>All</option>
              <option>Contacted</option>
              <option>Not Contacted</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Fee Status</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
              <option>All Statuses</option>
              <option>Pending</option>
              <option>Paid</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Logistics</label>
            <select className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white">
              <option>All</option>
              <option>Hostel Required</option>
              <option>Transport Required</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "table" ? (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                  <th className="px-6 py-4">Student & Parent</th>
                  <th className="px-6 py-4">Academic Details</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Logistics</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold shrink-0">
                          {student.name?.charAt(0) || '?'}
                        </div>
                        <div className="flex flex-col">
                          <Link href={`/dashboard/students/${student._id}`} className="font-bold text-slate-800 hover:text-blue-600 transition-colors">
                            {student.name || 'Unknown'}
                          </Link>
                          <span className="text-[11px] text-slate-500 font-mono mt-0.5">{student.studentId} • Parent: {student.parentName || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-700">{student.grade || 'N/A'}</span>
                        <span className="text-xs text-slate-500">{student.department || 'General'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold w-fit ${
                          student.enrollmentStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {student.enrollmentStatus === 'Active' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                          {student.enrollmentStatus}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold w-fit ${
                          student.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          Fee: {student.feeStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {student.hostelAccess && <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-md" title="Hostel"><MapPin className="h-4 w-4" /></span>}
                        {student.transportAccess && <span className="p-1.5 bg-orange-50 text-orange-600 rounded-md" title="Transport"><Bus className="h-4 w-4" /></span>}
                        {(!student.hostelAccess && !student.transportAccess) && <span className="text-xs text-slate-400">Day Scholar</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => { setSelectedStudent(student); setIsEditModalOpen(true); }} 
                          className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(student._id)} className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {students.map((student) => (
            <div key={student._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative group">
              <div className="absolute top-4 right-4 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => { setSelectedStudent(student); setIsEditModalOpen(true); }}
                  className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => handleDelete(student._id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 p-1 mb-4">
                  <div className="h-full w-full bg-white rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-2xl font-bold text-blue-600">{student.name?.charAt(0) || '?'}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-800">{student.name || 'Unknown'}</h3>
                <p className="text-xs font-mono text-slate-500 mb-4">{student.studentId}</p>
                
                <div className="w-full bg-slate-50 rounded-xl p-3 mb-4 text-left">
                  <p className="text-xs text-slate-500 mb-1">Grade</p>
                  <p className="text-sm font-semibold text-slate-800 truncate">{student.grade || 'N/A'}</p>
                </div>

                <div className="flex w-full items-center justify-between mt-auto pt-4 border-t border-slate-100">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                    student.enrollmentStatus === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {student.enrollmentStatus}
                  </span>
                  <Link href={`/dashboard/students/${student._id}`} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center">
                    View Profile
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchStudents} 
      />

      {selectedStudent && (
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedStudent(null); }}
          onSuccess={fetchStudents}
          studentData={selectedStudent}
        />
      )}

      <BulkUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchStudents}
        type="student"
      />
    </div>
  );
}
