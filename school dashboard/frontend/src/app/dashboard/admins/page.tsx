"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  Users, ShieldCheck, Key, Lock, 
  Unlock, UserMinus, Search, Mail,
  ExternalLink, MoreVertical, ShieldAlert,
  Building2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  const { data: admins, isLoading } = useQuery({
    queryKey: ["all-admins"],
    queryFn: async () => {
      const res = await api.get("/superadmin/admins");
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      await api.patch(`/superadmin/admins/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-admins"] });
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (id: string) => {
      const newPassword = Math.random().toString(36).slice(-8);
      await api.post("/superadmin/admins/reset-password", { userId: id, newPassword });
      alert(`Password reset successfully. New temporary password: ${newPassword}`);
    },
  });

  const filteredAdmins = admins?.filter((admin: any) => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Control</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage primary administrators for all institutions.</p>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-50 p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrator</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Institution</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Login</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Access Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAdmins?.map((admin: any) => (
                    <tr key={admin._id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 bg-slate-800 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm border border-slate-700">
                            {admin.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800 leading-tight">{admin.name}</p>
                            <p className="text-[11px] text-slate-400 font-semibold flex items-center">
                              <Mail className="h-3 w-3 mr-1" />
                              {admin.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-bold text-slate-700">
                          <Building2 className="h-3.5 w-3.5 text-blue-500 mr-1.5" />
                          {admin.schoolId?.name || "Global Admin"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs font-medium text-slate-500 italic">
                        {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : "Never logged in"}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-sm border ${
                          admin.status === 'active' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => resetPasswordMutation.mutate(admin._id)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset Password"
                          >
                            <Key className="h-4 w-4" />
                          </button>
                          {admin.status === 'active' ? (
                            <button 
                              onClick={() => statusMutation.mutate({ id: admin._id, status: 'suspended' })}
                              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Suspend Admin"
                            >
                              <Lock className="h-4 w-4" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => statusMutation.mutate({ id: admin._id, status: 'active' })}
                              className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Activate Admin"
                            >
                              <Unlock className="h-4 w-4" />
                            </button>
                          )}
                          <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical className="h-4 w-4" />
                          </button>
                        </div>
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
