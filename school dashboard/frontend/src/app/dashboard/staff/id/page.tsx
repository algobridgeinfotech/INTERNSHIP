"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, MapPin, Phone, Mail, Briefcase, 
  Building2, UserCircle, AlertCircle, ShieldAlert,
  Calendar, CreditCard, FileText
} from "lucide-react";

export default function StaffProfile() {
  const { id } = useParams();
  const [staff, setStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    fetch(`http://localhost:5001/api/staff/${id}`)
      .then(res => res.json())
      .then(data => {
        setStaff(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;
  }

  if (!staff) return <div className="p-10">Staff member not found</div>;

  const tabs = ["Overview", "Academic Load", "Attendance", "Payroll", "Documents", "Performance"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <Link href="/dashboard/staff" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Staff Directory
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
          <div className="absolute -bottom-12 left-8 flex items-end space-x-6">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-emerald-100 flex items-center justify-center text-3xl font-bold text-emerald-700 shadow-md">
              {staff.name.charAt(0)}
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-slate-800">{staff.name}</h1>
              <p className="text-sm font-mono text-slate-500">{staff.staffId} • {staff.jobTitle || 'Faculty'}</p>
            </div>
          </div>
          <div className="absolute top-6 right-8 flex space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30">
              Active Duty
            </span>
          </div>
        </div>

        {/* Action Bar & Tabs */}
        <div className="pt-16 px-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex space-x-6 overflow-x-auto w-full sm:w-auto pb-4 sm:pb-0 scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab ? "border-emerald-600 text-emerald-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex space-x-3 pb-4 sm:pb-0">
            <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Edit Profile</button>
            <button className="px-4 py-2 bg-emerald-600 border border-emerald-600 rounded-lg text-sm font-semibold text-white hover:bg-emerald-700 shadow-sm">Manage</button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><UserCircle className="h-5 w-5 mr-2 text-emerald-500" /> Personal & Professional</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Email Address</p>
                      <p className="font-medium text-slate-800 flex items-center"><Mail className="h-3 w-3 mr-1.5 text-slate-400" /> {staff.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                      <p className="font-medium text-slate-800 flex items-center"><Phone className="h-3 w-3 mr-1.5 text-slate-400" /> {staff.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Department</p>
                      <p className="font-medium text-slate-800 flex items-center"><Building2 className="h-3 w-3 mr-1.5 text-slate-400" /> {staff.department || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Job Title</p>
                      <p className="font-medium text-slate-800">{staff.jobTitle || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><ShieldAlert className="h-5 w-5 mr-2 text-rose-500" /> Emergency Contact</h3>
                  <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 grid grid-cols-2 gap-y-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Contact Name</p>
                      <p className="font-bold text-slate-800">{staff.emergencyContactName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Relation</p>
                      <p className="font-medium text-slate-800">{staff.emergencyContactRelation || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 mb-1">Emergency Phone</p>
                      <p className="text-lg font-bold text-rose-600 flex items-center"><Phone className="h-4 w-4 mr-2" /> {staff.emergencyContactPhone || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Widgets */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4">Organizational Unit</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Business Unit</p>
                      <p className="text-sm font-semibold text-slate-700">{staff.businessUnit || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Location</p>
                      <p className="text-sm font-semibold text-slate-700">{staff.location || 'HQ'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Reporting Manager</p>
                      <p className="text-sm font-semibold text-slate-700">{staff.reportingManager || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-600 p-5 rounded-2xl shadow-lg text-white">
                  <h4 className="font-bold mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">Issue Pass</button>
                    <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors">Payroll Info</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "Overview" && (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400">
              <Briefcase className="h-12 w-12 mb-4 text-slate-300" />
              <p className="font-medium text-lg">{activeTab} system is being prepared.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
