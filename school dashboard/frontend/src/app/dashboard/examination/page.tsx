"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  FileOutput, Plus, Calendar, 
  BookOpen, Trophy, Search, 
  MoreHorizontal, ChevronRight, Loader2,
  AlertCircle, CheckCircle2, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function ExaminationPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/exams");
      setExams(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load examinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'upcoming': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Examinations</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Schedule exams, manage results, and generate performance reports.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <Plus className="h-4 w-4 mr-2" /> Schedule New Exam
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-blue-600 text-white overflow-hidden relative group">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 -skew-x-12 translate-x-10 group-hover:translate-x-5 transition-transform duration-500"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-blue-100 text-xs font-black uppercase tracking-widest mb-1">Ongoing Exams</p>
                <h3 className="text-3xl font-black">{exams.filter(e => e.status === 'active').length}</h3>
              </div>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Clock className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] font-bold text-blue-100">
              <span className="bg-white/20 px-2 py-0.5 rounded-md mr-2">LIVE</span> Tracking active sessions
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-emerald-600 text-white overflow-hidden relative group">
          <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 -skew-x-12 translate-x-10 group-hover:translate-x-5 transition-transform duration-500"></div>
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100 text-xs font-black uppercase tracking-widest mb-1">Results Published</p>
                <h3 className="text-3xl font-black">{exams.filter(e => e.status === 'published').length}</h3>
              </div>
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] font-bold text-emerald-100">
              <span className="bg-white/20 px-2 py-0.5 rounded-md mr-2">INFO</span> Academic cycle 2023-24
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-slate-100 overflow-hidden relative group border border-slate-200">
          <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Upcoming Exams</p>
                <h3 className="text-3xl font-black text-slate-800">{exams.filter(e => e.status === 'upcoming').length}</h3>
              </div>
              <div className="p-2 bg-slate-200 rounded-xl">
                <Calendar className="h-5 w-5 text-slate-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400">
              <span className="bg-slate-200 px-2 py-0.5 rounded-md mr-2 text-slate-600 italic">NEXT</span> Final Term 2024
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exam List */}
      <Card className="border-none shadow-sm overflow-hidden min-h-[500px]">
        <CardHeader className="border-b border-slate-50 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Exam Schedule</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input type="text" placeholder="Search exams..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : exams.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Examination</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {exams.map((exam) => (
                    <tr key={exam._id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{exam.title}</p>
                            <p className="text-[10px] text-slate-400 font-medium mt-0.5 uppercase tracking-widest">Acaedmic Excellence</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-xs">
                            {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium italic">Duration: 7 days</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 uppercase tracking-tighter">
                          {exam.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-tighter ${getStatusColor(exam.status)}`}>
                          {exam.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-slate-100 transition-colors">
                            Manage Marks
                          </button>
                          <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400">
              <FileOutput className="h-12 w-12 opacity-20 mb-3" />
              <p className="text-sm font-bold">No examinations scheduled yet</p>
              <p className="text-xs">Click 'Schedule New Exam' to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
