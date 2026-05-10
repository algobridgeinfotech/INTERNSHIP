"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  Database, Server, Activity, AlertCircle, 
  Terminal, Cpu, HardDrive, Wifi,
  ShieldCheck, RefreshCw, Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function MonitoringPage() {
  const { data: health, isLoading, refetch } = useQuery({
    queryKey: ["system-health"],
    queryFn: async () => {
      const res = await api.get("/superadmin/monitoring/health");
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: errors } = useQuery({
    queryKey: ["error-logs"],
    queryFn: async () => {
      const res = await api.get("/superadmin/monitoring/errors");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!health) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center text-slate-500">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-4" />
        <p className="font-bold">Failed to load system monitoring data.</p>
        <button 
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Database & Monitoring</h1>
          <p className="text-slate-500 mt-1 font-medium">Real-time system health and server infrastructure status.</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* DB Status */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <Database className="h-4 w-4 mr-2 text-blue-600" /> MongoDB Instance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-slate-800">{health?.database?.status?.toUpperCase() || 'UNKNOWN'}</p>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">Cluster: {health?.database?.name || 'N/A'}</p>
              </div>
              <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Wifi className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">DB Size</p>
                <p className="text-sm font-bold text-slate-700">{health?.database?.size || '0 MB'}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Backup</p>
                <p className="text-sm font-bold text-emerald-600">{health?.database?.backupStatus || 'Pending'}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-50 flex items-center text-[10px] font-bold text-emerald-500 uppercase">
              <ShieldCheck className="h-3 w-3 mr-1" /> Last Backup: {health?.database?.lastBackup ? new Date(health.database.lastBackup).toLocaleTimeString() : 'N/A'}
            </div>
          </CardContent>
        </Card>

        {/* Server Uptime */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <Clock className="h-4 w-4 mr-2 text-indigo-600" /> Server Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-slate-800">{health?.server?.uptime || 'N/A'}</p>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">OS: {health?.server?.platform} ({health?.server?.arch})</p>
              </div>
              <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                <Server className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RAM Usage */}
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <HardDrive className="h-4 w-4 mr-2 text-emerald-600" /> Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-slate-800">{health?.server?.memory?.percentUsed || '0%'}</p>
                <p className="text-xs text-slate-400 font-bold uppercase mt-1">{health?.server?.memory?.used} / {health?.server?.memory?.total}</p>
              </div>
              <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-1000" 
                style={{ width: health?.server?.memory?.percentUsed || '0%' }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Error Logs */}
        <Card className="border-none shadow-sm bg-slate-900 text-slate-300">
          <CardHeader className="border-b border-white/5">
            <CardTitle className="text-lg font-bold text-white flex items-center">
              <Terminal className="h-5 w-5 mr-2 text-rose-500" /> System Error Logs
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-[400px] overflow-y-auto scrollbar-hide">
            {errors?.length === 0 ? (
              <div className="p-8 text-center text-slate-500 italic text-sm">No errors detected in the last 24 hours.</div>
            ) : (
              <div className="divide-y divide-white/5 font-mono text-[11px] leading-relaxed">
                {errors?.map((err: any, idx: number) => (
                  <div key={idx} className="p-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-bold px-1.5 py-0.5 rounded text-[9px] uppercase ${
                          err.level === 'error' ? 'bg-rose-500/20 text-rose-500' : 
                          err.level === 'warn' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                        }`}>
                          {err.level}
                        </span>
                        <span className="text-slate-500 font-bold">{new Date(err.createdAt).toLocaleTimeString()}</span>
                        <span className="text-blue-400">@{err.module}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {err.userId?.name || 'System'}
                      </span>
                    </div>
                    <p className="text-slate-200 line-clamp-2 leading-relaxed">{err.message}</p>
                    {err.requestPath && (
                      <p className="text-[9px] text-slate-500 mt-1 font-bold">
                        {err.method} {err.requestPath}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* API Latency Placeholder */}
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
              <Cpu className="h-5 w-5 mr-2 text-blue-500" /> API Request Latency
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {[
                { endpoint: "/api/auth/login", latency: "124ms", load: 85 },
                { endpoint: "/api/schools", latency: "210ms", load: 60 },
                { endpoint: "/api/students", latency: "345ms", load: 95 },
                { endpoint: "/api/staff", latency: "180ms", load: 45 },
              ].map((api, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-500">
                    <span>{api.endpoint}</span>
                    <span className="text-slate-900">{api.latency}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${api.load > 90 ? 'bg-rose-500' : 'bg-blue-500'}`} 
                      style={{ width: `${api.load}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
