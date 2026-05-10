"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Plus, Search, Filter, BookOpen, 
  Clock, FileText, CheckCircle2, 
  Loader2, MoreHorizontal, Calendar,
  Send, Trash2, Edit3, Paperclip,
  LayoutGrid, List
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TeacherFilter } from "@/components/teacher/TeacherFilter";

import { useAuthStore } from "@/store/useAuthStore";

export default function HomeworkPage() {
  const { user, selectedChildId } = useAuthStore();
  const role = user?.role?.toUpperCase();
  const isStaff = !["STUDENT", "PARENT"].includes(role || "");
  
  const [homeworks, setHomeworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>(null);

  useEffect(() => {
    if (!isStaff) {
        fetchPersonalHomework();
    }
  }, [selectedChildId, role]);

  const fetchPersonalHomework = async () => {
    setLoading(true);
    try {
        const url = role === "STUDENT" ? "/students/my/homework" : `/parent/child/${selectedChildId}/homework`;
        const res = await api.get(url);
        setHomeworks(res.data);
        setActiveFilters(true); // To show the grid
    } catch (err) {
        toast.error("Failed to load homework");
    } finally {
        setLoading(false);
    }
  };

  const handleFilterApply = async (filters: any) => {
    setActiveFilters(filters);
    setLoading(true);
    try {
      const res = await api.get("/teacher/homework", { params: filters });
      setHomeworks(res.data);
    } catch (err) {
      toast.error("Failed to load homework records");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {isStaff ? "Homework Repository" : "My Assignments"}
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            {isStaff ? "Organize and monitor subject-wise assignments for your classes." : "View and track assigned academic tasks."}
          </p>
        </div>
        {isStaff && (
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus className="h-4 w-4 mr-2" /> Assign New Task
          </button>
        )}
      </div>

      {isStaff && <TeacherFilter onFilter={handleFilterApply} />}

      {!activeFilters ? (
        <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm p-20 text-center flex flex-col items-center">
           <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-slate-300" />
           </div>
           <h3 className="text-lg font-bold text-slate-800">No Class Selected</h3>
           <p className="text-slate-400 text-sm max-w-xs mt-1">Please apply filters to view or manage homework for a specific subject and class.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full h-96 flex items-center justify-center">
               <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : homeworks.length > 0 ? (
            homeworks.map((h) => (
              <Card key={h._id} className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden group bg-white">
                <CardHeader className="bg-slate-50/50 pb-4 border-b border-slate-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-base">{h.title}</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mt-1">{h.subject} • {h.class}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest ${h.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                        {h.status}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-xs font-bold text-slate-500">
                      <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" /> Due: {new Date(h.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <Paperclip className="h-3 w-3 mr-1" /> 2 Attachments
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <span>Submissions Received</span>
                      <span>{h.submissions}/{h.total} ({Math.round((h.submissions/h.total)*100)}%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full transition-all duration-700" style={{ width: `${(h.submissions/h.total)*100}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isStaff ? (
                      <>
                        <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center">
                           <Send className="h-3.5 w-3.5 mr-2" /> Review Submissions
                        </button>
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 transition-all border border-slate-100"><Edit3 className="h-4 w-4" /></button>
                        <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-600 transition-all border border-slate-100"><Trash2 className="h-4 w-4" /></button>
                      </>
                    ) : (
                        <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-200">
                           <CheckCircle2 className="h-3.5 w-3.5 mr-2" /> Submit Assignment
                        </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full h-64 flex flex-col items-center justify-center text-slate-400 italic">
               No homework records found for this selection.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
