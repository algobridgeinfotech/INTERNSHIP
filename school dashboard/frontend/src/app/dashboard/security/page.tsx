"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  ShieldCheck, ShieldAlert, History, Monitor, 
  MapPin, Globe, Lock, Unlock, 
  Fingerprint, Key, AlertTriangle, Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SecurityCenterPage() {
  const { data: logs, isLoading } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const res = await api.get("/superadmin/logs/activity");
      return res.data;
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Security Center</h1>
          <p className="text-slate-500 mt-1 font-medium">Enterprise security auditing and platform access control.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all text-sm shadow-lg shadow-rose-200">
            <ShieldAlert className="h-4 w-4" />
            <span>Emergency Lockdown</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Security Summary */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Security Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-5xl font-black text-emerald-500">94%</div>
                <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                  <Fingerprint className="h-8 w-8 text-emerald-400" />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-4 leading-relaxed">
                Platform is currently under high-level protection. No critical vulnerabilities detected.
              </p>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Security Settings</h3>
            {[
              { icon: Lock, label: "Two-Factor Authentication", status: "Enforced" },
              { icon: Globe, label: "IP Whitelisting", status: "Enabled" },
              { icon: ShieldCheck, label: "SSL/TLS Certification", status: "Valid" },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-slate-50 rounded-lg">
                    <item.icon className="h-4 w-4 text-slate-600" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{item.label}</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase">{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Logs */}
        <Card className="lg:col-span-2 border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-white border-b border-slate-50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-lg font-bold text-slate-800">System Audit Logs</CardTitle>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:underline">Download Audit CSV</button>
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
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User / Action</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Module</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {logs?.map((log: any) => (
                      <tr key={log._id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-start space-x-3">
                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-[10px] font-black uppercase tracking-tighter shrink-0 mt-0.5">
                              {log.userId?.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-tight">
                                {log.userId?.name} <span className="text-slate-400 font-medium">({log.action})</span>
                              </p>
                              <p className="text-[11px] text-slate-500 font-medium mt-0.5">{log.details}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded">
                            {log.module}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className="text-[11px] font-bold text-slate-800">{new Date(log.createdAt).toLocaleDateString()}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{new Date(log.createdAt).toLocaleTimeString()}</p>
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
    </div>
  );
}
