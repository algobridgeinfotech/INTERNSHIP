"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Bell, Mail, MessageSquare, Send, 
  Search, Filter, Plus, Calendar,
  MoreHorizontal, Loader2, Info, AlertTriangle, Megaphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const isAdmin = ["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(user?.role?.toUpperCase() || "");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-4 w-4 text-rose-600" />;
      case 'holiday': return <Calendar className="h-4 w-4 text-amber-600" />;
      case 'fee': return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Megaphone className="h-4 w-4 text-slate-600" />;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'medium': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Notification Center</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Send announcements, alerts, and reminders to students, parents, and staff.</p>
        </div>
        <div className="flex space-x-3">
          {isAdmin && (
            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              <Send className="h-4 w-4 mr-2" /> Broadcast New
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm md:col-span-2">
          <CardHeader className="border-b border-slate-50 bg-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800">Recent Announcements</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input type="text" placeholder="Search history..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white min-h-[500px]">
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {notifications.map((n) => (
                  <div key={n._id} className="p-5 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border ${getPriorityClass(n.priority)} shadow-sm`}>
                          {getTypeIcon(n.type)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                            <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest ${getPriorityClass(n.priority)}`}>
                              {n.priority}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{n.message}</p>
                          <div className="flex items-center space-x-3 mt-3">
                            <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              <Calendar className="h-3 w-3 mr-1" /> {new Date(n.createdAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                              <Bell className="h-3 w-3 mr-1" /> Sent to: {n.targetType}
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-slate-400">
                <Bell className="h-12 w-12 opacity-20 mb-3" />
                <p className="text-sm font-bold">No notifications sent yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isAdmin && (
            <>
            <Card className="border-none shadow-sm bg-blue-600 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Megaphone className="h-24 w-24 rotate-12" />
              </div>
              <CardContent className="p-6 relative z-10">
                <h3 className="font-bold text-xl mb-2">Quick Broadcast</h3>
                <p className="text-blue-100 text-xs font-medium mb-6 leading-relaxed">Send an immediate notification to all active students and staff members in Springfield Academy.</p>
                <button className="w-full py-3 bg-white text-blue-600 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:bg-blue-50 transition-all">
                  Compose Now
                </button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-slate-800">Communication Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "SMS Sent", val: "1,240", color: "bg-blue-500" },
                  { label: "Emails Delivered", val: "4,820", color: "bg-emerald-500" },
                  { label: "Push Alerts", val: "892", color: "bg-amber-500" },
                ].map((stat, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{stat.label}</span>
                      <span>{stat.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${stat.color} rounded-full`} style={{ width: '70%' }}></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
