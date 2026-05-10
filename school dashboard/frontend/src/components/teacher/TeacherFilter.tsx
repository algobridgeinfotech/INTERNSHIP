"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Filter, Search, Loader2, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface TeacherFilterProps {
  onFilter: (filters: { classId: string; section: string; subjectId: string; date?: string }) => void;
  showDate?: boolean;
}

export function TeacherFilter({ onFilter, showDate = false }: TeacherFilterProps) {
  const [metadata, setMetadata] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await api.get("/teacher/metadata");
        setMetadata(res.data);
      } catch (err) {
        console.error("Failed to load filter metadata");
      } finally {
        setLoading(false);
      }
    };
    fetchMetadata();
  }, []);

  const currentClassData = metadata.find(m => m.id === selectedClass);

  const handleApply = () => {
    if (selectedClass && selectedSection && selectedSubject) {
      onFilter({
        classId: selectedClass,
        section: selectedSection,
        subjectId: selectedSubject,
        date: showDate ? selectedDate : undefined
      });
    }
  };

  if (loading) return <div className="h-12 flex items-center justify-center bg-white rounded-xl border border-slate-100 shadow-sm mb-6"><Loader2 className="h-4 w-4 animate-spin text-blue-600 mr-2" /> <span className="text-xs font-bold text-slate-400">Loading Filters...</span></div>;

  return (
    <Card className="border-none shadow-sm mb-6 overflow-visible bg-white/80 backdrop-blur-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Class</label>
            <select 
              value={selectedClass}
              onChange={(e) => { setSelectedClass(e.target.value); setSelectedSubject(""); setSelectedSection(""); }}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select Class</option>
              {metadata.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Section</label>
            <select 
              value={selectedSection}
              disabled={!selectedClass}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            >
              <option value="">Select Section</option>
              {currentClassData?.sections.map((s: string) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject</label>
            <select 
              value={selectedSubject}
              disabled={!selectedClass}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
            >
              <option value="">Select Subject</option>
              {currentClassData?.subjects.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          {showDate && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          )}

          <div className="flex items-end">
            <button 
              onClick={handleApply}
              disabled={!selectedClass || !selectedSection || !selectedSubject}
              className="w-full px-4 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 disabled:opacity-50 disabled:shadow-none"
            >
              <Search className="h-4 w-4 mr-2" /> Load Data
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
