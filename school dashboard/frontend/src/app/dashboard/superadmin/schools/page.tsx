"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Building2, Plus, Search, Filter, 
  CheckCircle2, AlertCircle, MoreHorizontal, 
  Loader2, ShieldCheck, CreditCard, Globe
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSchools = async () => {
    try {
      const res = await api.get("/superadmin/admins"); // Actually we need a real /superadmin/schools endpoint
      // For now, I'll mock the school list if the endpoint isn't fully there yet
      setSchools(res.data);
    } catch (err) {
      toast.error("Failed to load schools");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Institutional Network</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Manage all registered schools, their subscriptions, and administrative access.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus className="h-4 w-4 mr-2" /> Register New School
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Global Institutions</p>
                <h3 className="text-2xl font-black text-slate-800">{schools.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Active Licenses</p>
                <h3 className="text-2xl font-black text-slate-800">{schools.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Renewal Pending</p>
                <h3 className="text-2xl font-black text-slate-800">2</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm overflow-hidden min-h-[500px]">
        <CardHeader className="border-b border-slate-50 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Managed Institutions</CardTitle>
            <div className="flex space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input type="text" placeholder="Search school name..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" />
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
                    <th className="px-6 py-4">Institution Name</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Subscription</th>
                    <th className="px-6 py-4">Admin Email</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {schools.map((school) => (
                    <tr key={school._id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3 font-bold text-blue-600">
                            {school.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-700">{school.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium text-xs">{school.city}, {school.state}</td>
                      <td className="px-6 py-4">
                         <span className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-black uppercase tracking-widest text-slate-600 border border-slate-200">
                           Enterprise
                         </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">{school.email || "admin@school.com"}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black uppercase tracking-wider">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><MoreHorizontal className="h-4 w-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
