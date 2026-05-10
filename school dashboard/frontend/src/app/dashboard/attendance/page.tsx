"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Users, CheckCircle2, XCircle, Clock, 
  Calendar as CalendarIcon, Search, Filter, 
  Save, Loader2, MapPin, Zap, Navigation,
  FileText, CheckSquare, AlertTriangle,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { TeacherFilter } from "@/components/teacher/TeacherFilter";

export default function AttendancePage() {
  const { user, selectedChildId } = useAuthStore();
  const role = user?.role?.toUpperCase();
  const isStaff = !["STUDENT", "PARENT"].includes(role || "");
  const isAdmin = ["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(role || "");
  
  const [type, setType] = useState<"student" | "staff" | "self" | "view">(isStaff && !isAdmin ? "self" : isAdmin ? "student" : "view");
  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (type === "self" && typeof window !== "undefined") {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => toast.error("Please enable GPS for self-attendance")
      );
    }

    if (type === "view") {
        fetchHistory();
    }
  }, [type, selectedChildId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
        let url = "";
        if (role === "STUDENT") {
            url = "/students/my/attendance";
        } else if (role === "PARENT" && selectedChildId) {
            url = `/parent/child/${selectedChildId}/attendance`;
        }
        
        if (url) {
            const res = await api.get(url);
            setAttendanceHistory(res.data);
        }
    } catch (err) {
        toast.error("Failed to fetch attendance history");
    } finally {
        setLoading(false);
    }
  };

  const handleFilterApply = async (filters: any) => {
    setActiveFilters(filters);
    setLoading(true);
    try {
      const res = await api.get("/teacher/students", { params: filters });
      setStudents(res.data.map((s: any) => ({ ...s, status: 'present', remarks: "" })));
    } catch (err) {
      toast.error("Failed to load students for selection");
    } finally {
      setLoading(false);
    }
  };

  const handleClockIn = async () => {
    if (!location) {
      toast.error("GPS location required");
      return;
    }
    setSaving(true);
    try {
      await api.post("/teacher/attendance/clock-in", { 
        ...location, 
        deviceInfo: navigator.userAgent 
      });
      toast.success("Clocked in successfully");
    } catch (err) {
      toast.error("Clock-in failed");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAttendance = async () => {
    if (!activeFilters || students.length === 0) return;
    setSaving(true);
    try {
      await api.post("/teacher/students/attendance", {
        ...activeFilters,
        attendanceData: students.map(s => ({ studentId: s._id, status: s.status, remarks: s.remarks }))
      });
      toast.success("Attendance marked and locked successfully");
      setStudents([]);
      setActiveFilters(null);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Attendance Center</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Strict class-wise tracking with role-based access control.</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-inner">
          {isStaff && !isAdmin && (
            <button 
              onClick={() => { setType("self"); setStudents([]); setActiveFilters(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${type === 'self' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              My Attendance
            </button>
          )}
          {(isAdmin || role === 'teacher') && (
            <button 
              onClick={() => { setType("student"); setStudents([]); setActiveFilters(null); }}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${type === 'student' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
            >
              Student Records
            </button>
          )}
        </div>
      </div>

      {type === "self" ? (
        <Card className="border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Navigation className="h-48 w-48 rotate-12" />
          </div>
          <CardContent className="p-10 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-md border border-white/30">
                  <MapPin className="h-3 w-3 mr-1.5" /> {location ? "Location Verified" : "Awaiting GPS..."}
                </div>
                <h2 className="text-4xl font-black">Daily Check-In</h2>
                <p className="text-blue-100 text-sm max-w-md">GPS verification active. Please clock in to log your presence and start your workday.</p>
                <div className="flex items-center space-x-6 pt-4 text-[10px] font-black uppercase tracking-widest text-blue-100">
                  <div className="flex items-center"><Clock className="h-3 w-3 mr-1.5" /> Shift: Morning</div>
                  <div className="flex items-center"><Zap className="h-3 w-3 mr-1.5" /> Auto-Sync: On</div>
                </div>
              </div>
              <button 
                onClick={handleClockIn}
                disabled={saving}
                className="h-32 w-32 rounded-full bg-white text-blue-600 flex flex-col items-center justify-center shadow-2xl shadow-blue-900/40 hover:scale-105 transition-all group"
              >
                <Zap className="h-8 w-8 mb-1 animate-pulse" />
                <span className="font-black text-[10px] uppercase tracking-widest">Clock In</span>
              </button>
            </div>
          </CardContent>
        </Card>
      ) : type === "view" ? (
        <Card className="border-none shadow-sm overflow-hidden">
             <CardHeader className="border-b border-slate-50 bg-white">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" /> Attendance History
                </CardTitle>
                <p className="text-xs text-slate-400 font-medium mt-1">Official attendance logs for the current session.</p>
             </CardHeader>
             <CardContent className="p-0 bg-white">
                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                    </div>
                ) : attendanceHistory.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 italic text-sm">
                        No records found for this period.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Class/Subject</th>
                                    <th className="px-6 py-4">Remarks</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {attendanceHistory.map((record, i) => (
                                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-slate-700">
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                                                record.status === 'present' ? 'bg-emerald-50 text-emerald-600' :
                                                record.status === 'absent' ? 'bg-rose-50 text-rose-600' :
                                                'bg-amber-50 text-amber-600'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 font-medium">
                                            {record.classId || "General"} / {record.subjectId || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 italic text-xs">
                                            {record.remarks || "No remarks"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
             </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <TeacherFilter onFilter={handleFilterApply} showDate />

          {!activeFilters ? (
            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm p-20 text-center flex flex-col items-center">
               <div className="h-16 w-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                  <Filter className="h-8 w-8 text-slate-300" />
               </div>
               <h3 className="text-lg font-bold text-slate-800">Filter First</h3>
               <p className="text-slate-400 text-sm max-w-xs mt-1">Please select an academic year, class, section, and subject to load student records.</p>
            </Card>
          ) : (
            <Card className="border-none shadow-sm overflow-hidden min-h-[500px]">
              <CardHeader className="border-b border-slate-50 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                      <CheckSquare className="h-5 w-5 mr-2 text-blue-600" /> Mark Student Attendance
                    </CardTitle>
                    <p className="text-xs text-slate-400 font-medium mt-1">Batch selection and individual remarking enabled.</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Present</p>
                       <p className="text-lg font-black text-emerald-600 leading-none mt-1">{students.filter(s => s.status === 'present').length}</p>
                    </div>
                    <div className="text-center">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Absent</p>
                       <p className="text-lg font-black text-rose-600 leading-none mt-1">{students.filter(s => s.status === 'absent').length}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 bg-white">
                {loading ? (
                  <div className="h-96 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4">Student Identity</th>
                          <th className="px-6 py-4">Roll Number</th>
                          <th className="px-6 py-4 text-center">Attendance Status</th>
                          <th className="px-6 py-4">Remarks</th>
                          <th className="px-6 py-4 text-right">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {students.map((student) => (
                          <tr key={student._id} className="hover:bg-slate-50/30 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className={`h-9 w-9 rounded-lg flex items-center justify-center font-bold text-xs shadow-sm ${
                                  student.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 
                                  student.status === 'absent' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  {student.name.charAt(0)}
                                </div>
                                <p className="font-bold text-slate-800 leading-tight">{student.name}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">{student.rollNumber || student.studentId}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center space-x-2">
                                {['present', 'absent', 'late', 'leave'].map((status) => (
                                  <button
                                    key={status}
                                    onClick={() => setStudents(prev => prev.map(s => s._id === student._id ? { ...s, status } : s))}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                                      student.status === status 
                                        ? status === 'present' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' :
                                          status === 'absent' ? 'bg-rose-500 text-white shadow-lg shadow-rose-200' :
                                          status === 'late' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' :
                                          'bg-slate-900 text-white shadow-lg'
                                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <input 
                                type="text" 
                                placeholder="Add remark..."
                                value={student.remarks}
                                onChange={(e) => setStudents(prev => prev.map(s => s._id === student._id ? { ...s, remarks: e.target.value } : s))}
                                className="w-full bg-transparent border-none focus:ring-0 text-xs text-slate-600 placeholder:text-slate-300 font-medium italic"
                              />
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="h-1.5 w-12 bg-slate-100 rounded-full ml-auto overflow-hidden">
                                  <div className="h-full bg-blue-500" style={{ width: '85%' }}></div>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="p-6 border-t border-slate-50 bg-slate-50/50 flex justify-between items-center">
                       <div className="flex items-center text-amber-600 text-xs font-bold">
                          <AlertTriangle className="h-3.5 w-3.5 mr-2" /> 
                          Records will be locked after saving.
                       </div>
                       <button 
                         onClick={handleSaveAttendance}
                         disabled={saving || students.length === 0}
                         className="px-8 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50"
                       >
                         {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                         Submit & Verify Attendance
                       </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
