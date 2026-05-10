"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  FileText, Plus, Search, Filter, 
  DollarSign, CheckCircle2, Clock, 
  Download, MoreHorizontal, Loader2,
  TrendingUp, TrendingDown, Wallet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/payroll"); // Need to implement this backend route
      setPayrolls(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load payroll records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // For demo/prototype if route not yet there, we can mock or keep empty
    // fetchPayroll();
    setLoading(false);
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Payroll Management</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Manage staff salaries, process monthly payroll, and generate payslips.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-50 transition-all">
            <Download className="h-4 w-4 mr-2" /> Export Bank Data
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            Process Payroll
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Total Monthly Payout</p>
                <h3 className="text-2xl font-black text-slate-800">$0.00</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Paid Records</p>
                <h3 className="text-2xl font-black text-slate-800">0</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Pending Approval</p>
                <h3 className="text-2xl font-black text-slate-800">0</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payroll Table */}
      <Card className="border-none shadow-sm overflow-hidden min-h-[500px]">
        <CardHeader className="border-b border-slate-50 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Staff Payroll - {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</CardTitle>
            <div className="flex space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input type="text" placeholder="Search staff..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : payrolls.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Base Salary</th>
                    <th className="px-6 py-4">Deductions</th>
                    <th className="px-6 py-4">Net Salary</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {payrolls.map((payroll) => (
                    <tr key={payroll._id} className="hover:bg-slate-50/30 transition-colors group">
                      {/* Payroll Row Content */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400">
              <FileText className="h-12 w-12 opacity-20 mb-3" />
              <p className="text-sm font-bold">No payroll records for this month</p>
              <p className="text-xs">Click 'Process Payroll' to generate records for all staff.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
