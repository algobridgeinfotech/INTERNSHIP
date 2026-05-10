"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Bus, MapPin, Navigation, User, 
  Search, Filter, Plus, Clock,
  MoreHorizontal, Loader2, AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

import { useAuthStore } from "@/store/useAuthStore";

export default function TransportPage() {
  const { user, selectedChildId } = useAuthStore();
  const role = user?.role?.toUpperCase();
  const isAdmin = ["SCHOOL_ADMIN", "SUPER_ADMIN"].includes(role || "");
  const isParentOrStudent = ["PARENT", "STUDENT"].includes(role || "");
  
  const [routes, setRoutes] = useState<any[]>([]);
  const [studentTransport, setStudentTransport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchTransport = async () => {
    try {
      if (isAdmin) {
        const res = await api.get("/admin/transport");
        setRoutes(res.data);
      } else if (isParentOrStudent) {
        let url = role === "STUDENT" ? "/students/my/transport" : `/parent/child/${selectedChildId}/transport`;
        const res = await api.get(url, { params: { studentId: selectedChildId } });
        setStudentTransport(res.data);
      }
    } catch (err) {
      toast.error("Failed to load transport data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransport();
  }, [selectedChildId, role]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Transport Management</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Manage fleet, routes, drivers, and student allocations.</p>
        </div>
        <div className="flex space-x-3">
          {isAdmin && (
            <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
              <Plus className="h-4 w-4 mr-2" /> Add Route
            </button>
          )}
        </div>
      </div>

      {isParentOrStudent && (
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-none shadow-sm bg-blue-600 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Bus className="h-48 w-48 rotate-12" />
            </div>
            <CardContent className="p-10 relative z-10">
              {loading ? (
                <div className="h-32 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
              ) : studentTransport ? (
                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="space-y-4">
                    <div className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-xs font-bold backdrop-blur-md border border-white/30">
                      <Clock className="h-3 w-3 mr-1.5" /> Live Tracking Active
                    </div>
                    <h2 className="text-4xl font-black">{studentTransport.vehicleNumber}</h2>
                    <p className="text-blue-100 text-sm max-w-md">Route: <span className="text-white font-bold">{studentTransport.routeName}</span> • Status: <span className="text-emerald-400 font-bold uppercase tracking-widest">{studentTransport.status}</span></p>
                    <div className="flex items-center space-x-6 pt-4 text-[10px] font-black uppercase tracking-widest text-blue-100">
                      <div className="flex items-center"><User className="h-3 w-3 mr-1.5" /> Driver: {studentTransport.driverName}</div>
                      <div className="flex items-center"><Clock className="h-3 w-3 mr-1.5" /> ETA: 10 mins</div>
                    </div>
                  </div>
                  <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-900/40 hover:scale-105 transition-all">
                    Track Live Location
                  </button>
                </div>
              ) : (
                <div className="py-10 text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-bold">No Bus Assigned</h3>
                    <p className="text-blue-100 text-sm mt-1">Please contact school administration for transport allocation.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {isAdmin && (
        <>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Bus className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Total Buses</p>
                  <h3 className="text-2xl font-black text-slate-800">{routes.length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-sm overflow-hidden min-h-[500px]">
          <CardHeader className="border-b border-slate-50 bg-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800">Active Routes & Fleet</CardTitle>
              <div className="flex space-x-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input type="text" placeholder="Search routes..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 bg-white">
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : routes.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4">Route Name</th>
                      <th className="px-6 py-4">Vehicle No</th>
                      <th className="px-6 py-4">Driver Details</th>
                      <th className="px-6 py-4">Capacity</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {routes.map((route) => (
                      <tr key={route._id} className="hover:bg-slate-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-8 w-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                              <Navigation className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-bold text-slate-700">{route.routeName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500 uppercase">{route.vehicleNumber}</td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-700 text-xs">{route.driverName}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{route.driverPhone}</p>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-600">{route.capacity} Seats</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${route.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {route.status}
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
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-slate-400">
                <Bus className="h-12 w-12 opacity-20 mb-3" />
                <p className="text-sm font-bold">No transport routes found</p>
              </div>
            )}
          </CardContent>
        </Card>
        </>
      )}
    </div>
  );
}
