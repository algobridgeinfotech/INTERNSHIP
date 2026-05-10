"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Users, Plus, Search, Filter, MoreHorizontal, Download, 
  Upload, RefreshCw, LayoutGrid, List, Briefcase, Mail, MapPin, 
  Trash2, Edit2, AlertCircle, ShieldCheck, UserCheck, UserX,
  BookOpen, Wallet, Clock, Bus, MessageSquare, Phone
} from "lucide-react";
import { AddStaffModal } from "@/components/modals/AddStaffModal";
import { EditStaffModal } from "@/components/modals/EditStaffModal";
import { BulkUploadModal } from "@/components/modals/BulkUploadModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import api from "@/lib/api";

const ROLES = [
  "Teacher", "Accountant", "School Controller", "Librarian", 
  "Receptionist", "HR Staff", "Transport Staff"
];

export default function StaffManagementPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"table" | "card">("card");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const endpoint = activeRole === "All" ? "/staff" : `/staff?role=${activeRole}`;
      const res = await api.get(endpoint);
      setStaff(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [activeRole]);

  const stats = {
    total: staff.length,
    online: staff.filter(s => s.status === 'online').length,
    present: staff.filter(s => s.attendanceStatus === 'present').length,
    onLeave: staff.filter(s => s.attendanceStatus === 'on_leave').length
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Staff Management</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Unified control center for all school personnel and roles.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsAddModalOpen(true)} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all">
            <Plus className="h-4 w-4 mr-2" /> Add Personnel
          </button>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto no-scrollbar scroll-smooth">
        <button 
          onClick={() => setActiveRole("All")}
          className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${activeRole === 'All' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:bg-white/50'}`}
        >
          All Staff
        </button>
        {ROLES.map(role => (
          <button 
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all shrink-0 ${activeRole === role ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:bg-white/50'}`}
          >
            {role}s
          </button>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "Total Strength", value: stats.total, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Active Now", value: stats.online, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Present Today", value: stats.present, icon: UserCheck, color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "On Leave", value: stats.onLeave, icon: UserX, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={`h-12 w-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <h4 className="text-2xl font-black text-slate-800 leading-none">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Directory & Management View */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-50 py-5 px-6 bg-slate-50/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
               <CardTitle className="text-lg font-bold text-slate-800">Personnel Directory</CardTitle>
               <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                  <button onClick={() => setViewMode("table")} className={`p-1.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><List className="h-4 w-4" /></button>
                  <button onClick={() => setViewMode("card")} className={`p-1.5 rounded-lg transition-all ${viewMode === 'card' ? 'bg-slate-100 text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="h-4 w-4" /></button>
               </div>
            </div>
            <div className="flex items-center space-x-2">
               <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input type="text" placeholder="Search by name or ID..." className="w-full pl-10 pr-4 py-2.5 bg-white border-slate-200 border rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/20 outline-none" />
               </div>
               <button onClick={fetchStaff} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-400 transition-all"><RefreshCw className="h-4 w-4" /></button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
           {loading ? (
             <div className="h-96 flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
             </div>
           ) : viewMode === "card" ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-slate-50/30">
                {staff.map((member) => (
                  <div key={member._id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-1.5 h-full ${member.status === 'online' ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                    <div className="flex items-start justify-between mb-4">
                       <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black text-xl border border-slate-200 shadow-sm overflow-hidden uppercase">
                          {member.name.charAt(0)}
                       </div>
                       <div className="flex flex-col items-end">
                          <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest mb-1 ${
                             member.attendanceStatus === 'present' ? 'bg-emerald-50 text-emerald-600' : 
                             member.attendanceStatus === 'on_leave' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                             {member.attendanceStatus?.replace('_', ' ') || 'Absent'}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-tighter">ID: {member.staffId}</span>
                       </div>
                    </div>
                    <h3 className="font-bold text-slate-800 text-base mb-1">{member.name}</h3>
                    <div className="flex items-center text-[10px] font-black text-blue-600 uppercase tracking-widest mb-4">
                       <Briefcase className="h-3 w-3 mr-1.5" /> {member.role || 'Staff'} • {member.department}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-6">
                       <div className="flex items-center text-[10px] text-slate-500 font-bold">
                          <Phone className="h-3 w-3 mr-1.5 text-slate-300" /> {member.phone || 'No Phone'}
                       </div>
                       <div className="flex items-center text-[10px] text-slate-500 font-bold truncate">
                          <Mail className="h-3 w-3 mr-1.5 text-slate-300" /> {member.email}
                       </div>
                    </div>

                    <div className="flex items-center space-x-2 pt-4 border-t border-slate-50">
                       <button 
                         onClick={() => { setSelectedStaff(member); setIsEditModalOpen(true); }}
                         className="flex-1 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg shadow-slate-100"
                       >
                          <Edit2 className="h-3 w-3 mr-2" /> Modify
                       </button>
                       <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-blue-600 transition-all"><MessageSquare className="h-3.5 w-3.5" /></button>
                       <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-rose-600 transition-all"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="overflow-x-auto min-h-[400px]">
               <table className="w-full text-sm text-left">
                 <thead className="bg-slate-50/80 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                   <tr>
                     <th className="px-6 py-4">Employee Identity</th>
                     <th className="px-6 py-4">Role & Status</th>
                     <th className="px-6 py-4">Department</th>
                     <th className="px-6 py-4">Attendance</th>
                     <th className="px-6 py-4 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 bg-white">
                   {staff.map((member) => (
                     <tr key={member._id} className="hover:bg-slate-50/30 transition-colors">
                       <td className="px-6 py-4">
                         <div className="flex items-center space-x-3">
                           <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs uppercase">{member.name.charAt(0)}</div>
                           <div>
                             <p className="font-bold text-slate-800 leading-tight">{member.name}</p>
                             <p className="text-[10px] text-slate-400 font-mono mt-0.5">{member.staffId}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                             <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">{member.role}</span>
                             <div className={`h-1.5 w-1.5 rounded-full ${member.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                          </div>
                       </td>
                       <td className="px-6 py-4 font-bold text-slate-600 text-xs">{member.department}</td>
                       <td className="px-6 py-4">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${member.attendanceStatus === 'present' ? 'text-emerald-600' : 'text-slate-400'}`}>
                             {member.attendanceStatus?.replace('_', ' ') || 'Absent'}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right space-x-2">
                          <button onClick={() => { setSelectedStaff(member); setIsEditModalOpen(true); }} className="text-slate-400 hover:text-slate-900 transition-colors"><Edit2 className="h-4 w-4" /></button>
                          <button className="text-slate-400 hover:text-rose-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           )}
        </CardContent>
      </Card>

      {/* Modals */}
      <AddStaffModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={fetchStaff} 
      />
      {selectedStaff && (
        <EditStaffModal
          isOpen={isEditModalOpen}
          onClose={() => { setIsEditModalOpen(false); setSelectedStaff(null); }}
          onSuccess={fetchStaff}
          staffData={selectedStaff}
        />
      )}
      <BulkUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={fetchStaff}
        type="staff"
      />
    </div>
  );
}
