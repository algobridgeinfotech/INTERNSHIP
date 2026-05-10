"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Users, BookOpen, Clock, Calendar, 
  FileText, CheckCircle2, AlertCircle, 
  TrendingUp, Play, Bell, Zap, MoreHorizontal,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function TeacherDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/teacher/dashboard");
      setData(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const metrics = [
    { title: "Assigned Classes", value: data?.metrics?.assignedClasses || 0, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Students", value: data?.metrics?.totalStudents || 0, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { title: "Pending Reviews", value: data?.metrics?.pendingHomework || 0, icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Attendance %", value: "94%", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Teacher Console</h1>
          <p className="text-slate-500 mt-1 font-medium">Welcome back! Here's an overview of your academic schedule today.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center">
            <Zap className="h-4 w-4 mr-2" /> Mark Self Attendance
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((card, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-black text-slate-400 uppercase tracking-widest">{card.title}</CardTitle>
              <div className={`${card.bg} p-2 rounded-xl`}>
                <card.icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-slate-800">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-slate-800">Today&apos;s Timetable</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {[
                { time: "09:00 AM", sub: "Mathematics", class: "Grade 10-A", room: "Room 102", status: "Completed" },
                { time: "11:00 AM", sub: "Advanced Calculus", class: "Grade 12-B", room: "Lab 04", status: "Upcoming" },
                { time: "01:30 PM", sub: "Algebra Basics", class: "Grade 8-C", room: "Room 201", status: "Upcoming" },
              ].map((item, i) => (
                <div key={i} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-all">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Time</span>
                      <span className="text-xs font-black text-slate-800">{item.time.split(' ')[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.sub}</h4>
                      <p className="text-xs text-slate-400 font-medium">{item.class} • {item.room}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest ${item.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {item.status}
                    </span>
                    <button className="p-2 text-slate-300 hover:text-slate-600"><MoreHorizontal className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Announcements / Notifications */}
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-slate-800">Notices & Alerts</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-50">
              {data?.notifications?.map((n: any) => (
                <div key={n._id} className="p-4 flex items-start space-x-3 hover:bg-slate-50/50 transition-all">
                  <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 leading-tight">{n.title}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1.5">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
              {(!data?.notifications || data.notifications.length === 0) && (
                <div className="p-10 text-center text-slate-400">
                   <p className="text-sm font-medium">No active notices</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
