"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Calendar, Clock, BookOpen, User, 
  Search, Filter, Plus, Download,
  MoreHorizontal, Loader2, Edit3, Trash2,
  ChevronLeft, ChevronRight, LayoutGrid, List
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TimetablePage() {
  const { user, selectedChildId } = useAuthStore();
  const role = user?.role?.toUpperCase();
  const isAdminOrController = ["SCHOOL_ADMIN", "SUPER_ADMIN", "SCHOOL_CONTROLLER"].includes(role || "");
  
  const [timetables, setTimetables] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() - 1] || DAYS[0]);
  const [selectedClass, setSelectedClass] = useState("10th");
  const [selectedSection, setSelectedSection] = useState("A");

  const fetchTimetables = async () => {
    setLoading(true);
    try {
      let url = "/timetable";
      let params: any = {};
      
      if (role === "TEACHER") {
          url = "/timetable/my-schedule";
      } else if (role === "STUDENT") {
          url = "/timetable/student-schedule";
      } else if (role === "PARENT") {
          url = "/timetable/student-schedule";
          params.studentId = selectedChildId;
      } else {
          params.section = selectedSection;
          params.classId = selectedClass; // Assuming classId is used as name or converted
      }

      const res = await api.get(url, { params });
      setTimetables(res.data);
    } catch (err) {
      toast.error("Failed to load timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, [selectedClass, selectedSection, selectedChildId, role]);

  const activeDayTimetable = timetables.find(t => t.day === selectedDay);
  const activeDayPeriods = activeDayTimetable?.periods || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Academic Timetable</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Design and manage weekly schedules for classes and teachers.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-50 transition-all">
            <Download className="h-4 w-4 mr-2" /> Export PDF
          </button>
          {isAdminOrController && (
            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              <Plus className="h-4 w-4 mr-2" /> Create Schedule
            </button>
          )}
        </div>
      </div>

      {/* Selectors */}
      {isAdminOrController && (
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center space-x-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class:</label>
            <select 
              value={selectedClass} 
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-slate-50 border-none rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
            >
              {["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-center space-x-2 border-l border-slate-100 pl-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section:</label>
            <select 
              value={selectedSection} 
              onChange={(e) => setSelectedSection(e.target.value)}
              className="bg-slate-50 border-none rounded-lg px-3 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20"
            >
              {["A", "B", "C"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex-1"></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Day Picker */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-white self-start">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-widest">Select Day</CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0">
            <div className="space-y-1">
              {DAYS.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedDay === day ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  {day}
                  {selectedDay === day && <ChevronRight className="h-4 w-4" />}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Schedule View */}
        <Card className="lg:col-span-9 border-none shadow-sm bg-white overflow-hidden min-h-[600px]">
          <CardHeader className="border-b border-slate-50 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">{selectedDay} Schedule</CardTitle>
                <p className="text-xs text-slate-400 font-medium mt-1">
                    {isAdminOrController ? `Class ${selectedClass} - Section ${selectedSection}` : "Personal Academic Schedule"} • Academic Year 2026-27
                </p>
              </div>
              {isAdminOrController && (
                <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all border border-slate-100">
                  <Edit3 className="h-4 w-4" />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : activeDayPeriods.length === 0 ? (
                <div className="h-96 flex flex-col items-center justify-center text-slate-400 italic">
                    <Calendar className="h-12 w-12 opacity-20 mb-4" />
                    No classes scheduled for {selectedDay}.
                </div>
            ) : (
              <div className="space-y-4">
                {activeDayPeriods.map((period: any, idx: number) => (
                  <div key={idx} className={`flex items-center p-4 rounded-2xl border transition-all hover:shadow-md cursor-pointer group bg-slate-50/50 border-slate-100`}>
                    <div className="w-40 border-r border-slate-200 pr-4 shrink-0">
                      <div className="flex items-center font-black text-[10px] text-slate-500 uppercase tracking-tighter opacity-70">
                        <Clock className="h-3 w-3 mr-1.5" /> {period.startTime} - {period.endTime}
                      </div>
                      <p className="text-[10px] font-black text-blue-600 uppercase mt-1">Period {idx + 1}</p>
                    </div>
                    <div className="flex-1 px-6">
                      <h4 className="font-black text-slate-800 text-base">{period.subjectId?.name || "Subject"}</h4>
                      <div className="flex items-center mt-1 space-x-3 opacity-80">
                        <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <User className="h-3 w-3 mr-1" /> {period.teacherId?.name || "Staff"}
                        </div>
                        <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <Building2 className="h-3 w-3 mr-1" /> {period.room || "Room TBA"}
                        </div>
                      </div>
                    </div>
                    {isAdminOrController && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400"><MoreHorizontal className="h-4 w-4" /></button>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
