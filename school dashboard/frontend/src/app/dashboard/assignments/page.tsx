"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Plus, Search, Trophy, FileCheck, 
  Clock, BookOpen, AlertTriangle,
  Loader2, MoreHorizontal, LayoutGrid,
  BarChart2, FileStack, CheckCircle2,
  FileBox
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TeacherFilter } from "@/components/teacher/TeacherFilter";

export default function AssignmentsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(null);

  const handleFilterApply = async (filters: any) => {
    setActiveFilters(filters);
    setLoading(true);
    try {
      // Mock data for demo
      setData([
        { _id: '1', title: 'Calculus Assignment 1', class: '12-A', subject: 'Math', points: 100, graded: 18, total: 25, average: '84%' },
        { _id: '2', title: 'Modern Physics Essay', class: '11-B', subject: 'Physics', points: 50, graded: 22, total: 22, average: '78%' },
      ]);
    } catch (err) {
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Assignment Grading</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Review, mark, and feedback system for student project work.</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <Plus className="h-4 w-4 mr-2" /> New Assignment
        </button>
      </div>

      <TeacherFilter onFilter={handleFilterApply} />

      {!activeFilters ? (
         <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm p-20 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
               <FileBox className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Select Class To Grade</h3>
            <p className="text-slate-400 text-sm max-w-xs mt-1">Filtering by subject and class is required before grading student work.</p>
         </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <FileStack className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">To Grade</p>
                  <h4 className="text-2xl font-black text-slate-800">14</h4>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Completed</p>
                  <h4 className="text-2xl font-black text-slate-800">32</h4>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm bg-white">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <BarChart2 className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Avg Score</p>
                  <h4 className="text-2xl font-black text-slate-800">76%</h4>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-white border-b border-slate-50 py-5">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                    <LayoutGrid className="h-5 w-5 mr-2 text-slate-400" /> Class Assignments
                  </CardTitle>
               </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Grading Progress</th>
                    <th className="px-6 py-4">Avg. Score</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100">
                            <FileCheck className="h-4 w-4 text-slate-400" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{item.title}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5 tracking-widest">{item.subject}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${item.graded === item.total ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                            {item.graded === item.total ? 'Completed' : 'In Progress'}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                           <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden min-w-[80px]">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(item.graded/item.total)*100}%` }}></div>
                           </div>
                           <span className="text-[10px] font-bold text-slate-500">{item.graded}/{item.total}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-700">{item.average}</td>
                      <td className="px-6 py-4 text-right">
                         <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100">Grade Students</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
