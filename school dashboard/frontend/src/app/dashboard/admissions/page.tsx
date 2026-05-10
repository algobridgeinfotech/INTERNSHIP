"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  UserPlus, Search, Filter, 
  CheckCircle2, XCircle, Clock, 
  Download, MoreHorizontal, Loader2,
  Calendar, Phone, Mail, FileCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdmissions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/admissions"); // Need to implement this backend route
      setAdmissions(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load admission requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetchAdmissions();
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admissions Portal</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Review applications, schedule interviews, and manage the student onboarding workflow.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus className="h-4 w-4 mr-2" /> New Application
          </button>
        </div>
      </div>

      {/* Admissions Table */}
      <Card className="border-none shadow-sm overflow-hidden min-h-[500px]">
        <CardHeader className="border-b border-slate-50 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Pending Applications</CardTitle>
            <div className="flex space-x-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input type="text" placeholder="Search applicant name..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : admissions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                {/* Table Header & Rows */}
              </table>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400">
              <UserPlus className="h-12 w-12 opacity-20 mb-3" />
              <p className="text-sm font-bold">No admission requests yet</p>
              <p className="text-xs">New applications from the school website will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
  return <PlusIcon className={className} />;
}
import { Plus as PlusIcon } from "lucide-react";
