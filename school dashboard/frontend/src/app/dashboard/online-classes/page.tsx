"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Plus, Search, Video, Play, 
  Clock, Calendar, Link as LinkIcon,
  Loader2, MoreHorizontal, Users,
  Globe, Laptop, Settings, Trash2, Edit3
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function OnlineClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setClasses([
      { _id: '1', title: 'Advanced Algebra Live', subject: 'Mathematics', class: '10-A', time: '10:00 AM', platform: 'Google Meet', status: 'live', link: 'https://meet.google.com/abc-defg-hij' },
      { _id: '2', title: 'Organic Chemistry Overview', subject: 'Chemistry', class: '12-B', time: '02:30 PM', platform: 'Zoom', status: 'scheduled', link: 'https://zoom.us/j/123456789' },
    ]);
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Virtual Classrooms</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Schedule and manage live teaching sessions with integrated meeting platforms.</p>
        </div>
        <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
          <Plus className="h-4 w-4 mr-2" /> Schedule Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((c) => (
          <Card key={c._id} className={`border-none shadow-sm overflow-hidden group transition-all hover:shadow-md ${c.status === 'live' ? 'ring-2 ring-rose-500 ring-offset-2' : ''}`}>
             <div className={`h-2 w-full ${c.status === 'live' ? 'bg-rose-500' : 'bg-blue-500'}`}></div>
             <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center space-x-2">
                      <div className={`h-2 w-2 rounded-full ${c.status === 'live' ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`}></div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${c.status === 'live' ? 'text-rose-600' : 'text-slate-400'}`}>
                         {c.status === 'live' ? 'Live Now' : 'Scheduled'}
                      </span>
                   </div>
                   <div className="flex space-x-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-all"><Edit3 className="h-3.5 w-3.5" /></button>
                      <button className="p-1.5 hover:bg-rose-50 rounded-lg text-slate-400 hover:text-rose-500 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                   </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">{c.title}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-6">{c.subject} • Class {c.class}</p>

                <div className="space-y-3 mb-6">
                   <div className="flex items-center text-xs font-bold text-slate-600">
                      <Clock className="h-4 w-4 mr-2.5 text-blue-500" /> Today at {c.time}
                   </div>
                   <div className="flex items-center text-xs font-bold text-slate-600">
                      <Laptop className="h-4 w-4 mr-2.5 text-blue-500" /> Platform: {c.platform}
                   </div>
                   <div className="flex items-center text-xs font-bold text-slate-600">
                      <Users className="h-4 w-4 mr-2.5 text-blue-500" /> All Students Assigned
                   </div>
                </div>

                <div className="flex items-center space-x-3">
                   {c.status === 'live' ? (
                     <a 
                       href={c.link} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className="flex-1 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                     >
                       <Play className="h-3.5 w-3.5 mr-2" /> Join Classroom
                     </a>
                   ) : (
                     <button className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center hover:bg-slate-800 transition-all">
                       <Calendar className="h-3.5 w-3.5 mr-2" /> View Details
                     </button>
                   )}
                   <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 transition-all">
                      <LinkIcon className="h-4 w-4" />
                   </button>
                </div>
             </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
