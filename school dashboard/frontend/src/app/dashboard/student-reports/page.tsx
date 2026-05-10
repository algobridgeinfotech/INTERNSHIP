"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  BarChart3, TrendingUp, Users, 
  Search, Filter, Download, 
  ArrowUpRight, ArrowDownRight,
  BookOpen, CheckCircle2, AlertCircle,
  Loader2, MoreHorizontal, FileText,
  UserCheck, UserMinus, Star,
  LayoutGrid, Printer, FileSpreadsheet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TeacherFilter } from "@/components/teacher/TeacherFilter";

export default function StudentReportsPage() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<any>(null);

  const handleFilterApply = async (filters: any) => {
    setActiveFilters(filters);
    setLoading(true);
    try {
      setStudents([
        { _id: '1', name: 'Aarav Sharma', roll: '101', attendance: '98%', performance: 'A+', trend: 'up', status: 'Excellent', homework: '12/12', exams: '92/100' },
        { _id: '2', name: 'Ishani Gupta', roll: '102', attendance: '92%', performance: 'A', trend: 'up', status: 'Good', homework: '11/12', exams: '88/100' },
        { _id: '3', name: 'Kabir Singh', roll: '103', attendance: '74%', performance: 'C', trend: 'down', status: 'At Risk', homework: '6/12', exams: '62/100' },
      ]);
    } catch (err) {
      toast.error("Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Academic Intelligence</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Deep insights into student performance based on class and subject filters.</p>
        </div>
        <div className="flex space-x-2">
           <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center hover:bg-slate-50">
             <Printer className="h-3.5 w-3.5 mr-2" /> Print Reports
           </button>
           <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center hover:bg-emerald-700 shadow-lg shadow-emerald-100">
             <FileSpreadsheet className="h-3.5 w-3.5 mr-2" /> Export Excel
           </button>
        </div>
      </div>

      <TeacherFilter onFilter={handleFilterApply} />

      {!activeFilters ? (
         <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm p-20 text-center flex flex-col items-center">
            <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
               <LineChart className="h-8 w-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">Generate Report</h3>
            <p className="text-slate-400 text-sm max-w-xs mt-1">Select your assigned class and subject to compile a comprehensive performance report.</p>
         </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Subject Average", value: "81.2%", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
              { label: "Present Today", value: "94%", icon: UserCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
              { label: "Pending Submissions", value: "08", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
              { label: "At Risk Students", value: "02", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
            ].map((stat, i) => (
              <Card key={i} className="border-none shadow-sm bg-white">
                 <CardContent className="p-6">
                    <div className={`h-10 w-10 ${stat.bg} rounded-xl flex items-center justify-center mb-4`}>
                       <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h4 className="text-2xl font-black text-slate-800">{stat.value}</h4>
                 </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 py-5">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold text-slate-800">Class Performance Matrix</CardTitle>
                  <div className="relative w-64">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                     <input type="text" placeholder="Filter by roll/name..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-700 focus:ring-1 focus:ring-blue-500/20" />
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Attendance</th>
                    <th className="px-6 py-4">Homework</th>
                    <th className="px-6 py-4">Exams</th>
                    <th className="px-6 py-4">Grade</th>
                    <th className="px-6 py-4 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {students.map((std) => (
                    <tr key={std._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 bg-slate-50 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm border border-slate-100">
                            {std.roll}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{std.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5 tracking-tighter uppercase">ID: STD-00{std._id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">{std.attendance}</td>
                      <td className="px-6 py-4 font-bold text-slate-700">{std.homework}</td>
                      <td className="px-6 py-4 font-bold text-slate-700">{std.exams}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${std.status === 'Excellent' ? 'bg-emerald-50 text-emerald-600' : std.status === 'Good' ? 'bg-blue-50 text-blue-600' : 'bg-rose-50 text-rose-600'}`}>
                           {std.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         {std.trend === 'up' ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-500 ml-auto" />
                         ) : (
                            <ArrowDownRight className="h-4 w-4 text-rose-500 ml-auto" />
                         )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-center">
                 <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">View All {students.length} Student Records</button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

import { LineChart } from "lucide-react";
