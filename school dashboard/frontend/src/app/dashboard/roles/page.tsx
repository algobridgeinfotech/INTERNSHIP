"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  ShieldCheck, Lock, Unlock, 
  Settings2, Fingerprint, Key,
  CheckCircle2, Plus, Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function RolesPermissionsPage() {
  const queryClient = useQueryClient();

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["all-roles"],
    queryFn: async () => {
      const res = await api.get("/superadmin/roles");
      return res.data;
    },
  });

  const { data: permissions, isLoading: permissionsLoading } = useQuery({
    queryKey: ["all-permissions"],
    queryFn: async () => {
      const res = await api.get("/superadmin/permissions");
      return res.data;
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Permission Manager</h1>
          <p className="text-slate-500 mt-1 font-medium">Configure enterprise-grade RBAC roles and module access.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
            <Plus className="h-4 w-4" />
            <span>New Permission</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all text-sm">
            <Plus className="h-4 w-4" />
            <span>Create Custom Role</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">System Roles</h2>
          {rolesLoading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            roles?.map((role: any) => (
              <div key={role._id} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-800 uppercase tracking-tight">{role.name}</span>
                </div>
                {role.isSystem && <Lock className="h-3 w-3 text-slate-300" />}
              </div>
            ))
          )}
        </div>

        {/* Permissions Matrix */}
        <Card className="lg:col-span-3 border-none shadow-sm min-h-[500px]">
          <CardHeader className="border-b border-slate-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800">Module Access Matrix</CardTitle>
              <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                <Info className="h-3 w-3 mr-1.5" />
                Select a role to configure permissions
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {permissionsLoading ? (
              <div className="h-64 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Grouped by Module */}
                {["Academics", "Finance", "Infrastructure", "Settings"].map((module) => (
                  <div key={module} className="space-y-4">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] pb-2 border-b border-slate-50">{module}</h3>
                    <div className="space-y-3">
                      {permissions?.filter((p: any) => p.module === module || !p.module).map((perm: any) => (
                        <div key={perm._id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group">
                          <div className="flex items-center space-x-3">
                            <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                            <div>
                              <p className="text-sm font-bold text-slate-700 leading-tight">{perm.name}</p>
                              <p className="text-[10px] text-slate-400 font-medium">{perm.slug}</p>
                            </div>
                          </div>
                          <div className="h-5 w-5 rounded-md border-2 border-slate-200 group-hover:border-blue-500 transition-colors flex items-center justify-center cursor-pointer">
                            <CheckCircle2 className="h-3.5 w-3.5 text-blue-500 opacity-0 group-hover:opacity-100" />
                          </div>
                        </div>
                      ))}
                    </div>
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
