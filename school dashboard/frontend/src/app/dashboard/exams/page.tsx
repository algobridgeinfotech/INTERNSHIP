"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Plus, Search, Trophy, FileCheck, 
  Clock, BookOpen, AlertTriangle,
  Loader2, MoreHorizontal, LayoutGrid,
  BarChart2, FileStack, CheckCircle2,
  Edit3, Save, Trash2, Award, ClipboardCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TeacherFilter } from "@/components/teacher/TeacherFilter";

export default function ExamsPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [examType, setExamType] = useState("Mid-Term");

  const handleFilterApply = async (filters: any) => {
    setActiveFilters(filters);
    setLoading(true);
    try {
      // Mock data for students in selected class/section
      setStudents([
        { _id: 's1', name: 'Aarav Sharma', roll: '101', theory: 85, practical: 15, remarks: "" },
        { _id: 's2', name: 'Ishani Gupta', roll: '102', theory: 92, practical: 18, remarks: "" },
        { _id: 's3', name: 'Kabir Singh', roll: '103', theory: 78, practical: 12, remarks: "" },
        { _id: 's4', name: 'Meera Reddy', roll: '104', theory: 0, practical: 0, remarks: "" },
      ]);
    } catch (err) {
      toast.error("Failed to load exam data");
    } finally {
      setLoading(false);
    }
  };

  const calculateGrade = (total: number) => {
    if (total >= 90) return { grade: 'A+', color: 'text-emerald-600' };
    if (total >= 80) return { grade: 'A', color: 'text-blue-600' };
    if (total >= 70) return { grade: 'B', color: 'text-indigo-600' };
    if (total >= 60) return { grade: 'C', color: 'text-amber-600' };
    return { grade: 'F', color: 'text-rose-600' };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Exam & Results Hub</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Strictly enter marks for assigned subjects and classes.</p>
        </div>
        <div className="flex space-x-2">
           <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center hover:bg-slate-50 transition-all">
             <BarChart2 className="h-4 w-4 mr-2" /> Analytics
           </button>
           <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
             <Plus className="h-4 w-4 mr-2" /> Schedule Exam
           </button>
        </div>
      </div>

      <TeacherFilter onFilter={handleFilterApply} />

      {!activeFilters ? (
         <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm p-20 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
               <ClipboardCheck className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Select Exam Context</h3>
            <p className="text-slate-400 text-sm max-w-xs mt-1">Filters are required to load the student list and entry form for results.</p>
         </Card>
      ) : (
        <Card className="border-none shadow-sm overflow-hidden min-h-[600px] bg-white">
          <CardHeader className="border-b border-slate-50 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-slate-800 flex items-center">
                  <Award className="h-6 w-6 mr-2 text-amber-500" /> Marks Entry: {examType}
                </CardTitle>
                <div className="flex items-center space-x-4 mt-2">
                   <div className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black uppercase tracking-widest text-slate-500">Max Theory: 80</div>
                   <div className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black uppercase tracking-widest text-slate-500">Max Internal: 20</div>
                </div>
              </div>
              <div className="flex items-center space-x-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                 <div className="text-center px-4 border-r border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Students</p>
                    <p className="text-lg font-black text-slate-800 leading-none">{students.length}</p>
                 </div>
                 <div className="text-center px-4 border-r border-slate-200">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Passed</p>
                    <p className="text-lg font-black text-emerald-600 leading-none">{students.filter(s => (s.theory + s.practical) >= 40).length}</p>
                 </div>
                 <div className="text-center px-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Average</p>
                    <p className="text-lg font-black text-blue-600 leading-none">
                       {Math.round(students.reduce((acc, s) => acc + (s.theory + s.practical), 0) / students.length)}%
                    </p>
                 </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Student Roll & Name</th>
                    <th className="px-6 py-4">Theory (80)</th>
                    <th className="px-6 py-4">Internal (20)</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((std) => {
                    const total = std.theory + std.practical;
                    const { grade, color } = calculateGrade(total);
                    return (
                      <tr key={std._id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm border border-slate-100">
                              {std.roll}
                            </div>
                            <p className="font-bold text-slate-800 leading-tight">{std.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="number" 
                            max={80}
                            value={std.theory}
                            onChange={(e) => setStudents(prev => prev.map(s => s._id === std._id ? { ...s, theory: Number(e.target.value) } : s))}
                            className="w-20 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="number" 
                            max={20}
                            value={std.practical}
                            onChange={(e) => setStudents(prev => prev.map(s => s._id === std._id ? { ...s, practical: Number(e.target.value) } : s))}
                            className="w-20 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-black text-slate-800 text-base">{total}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-black text-sm ${color}`}>{grade}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <input 
                            type="text" 
                            placeholder="Add comment..."
                            value={std.remarks}
                            onChange={(e) => setStudents(prev => prev.map(s => s._id === std._id ? { ...s, remarks: e.target.value } : s))}
                            className="w-full max-w-[180px] bg-transparent border-none focus:ring-0 text-xs text-slate-500 italic text-right font-medium"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                 <div className="flex items-center space-x-2 text-rose-500 text-[10px] font-black uppercase tracking-widest">
                    <AlertTriangle className="h-3.5 w-3.5" /> Entry once saved cannot be modified after 24hrs.
                 </div>
                 <button 
                   onClick={() => toast.success("Results compiled and published to parents.")}
                   className="px-10 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all"
                 >
                   <Save className="h-4 w-4 mr-2" /> Save & Publish Results
                 </button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
