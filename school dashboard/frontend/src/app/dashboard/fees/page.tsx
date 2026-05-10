"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { 
  Wallet, Plus, Search, Filter, 
  ArrowUpRight, ArrowDownLeft, 
  Download, MoreHorizontal, Loader2,
  CheckCircle2, AlertCircle, Clock,
  CreditCard, Banknote
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function FeesPage() {
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/fees");
      setFees(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load fee records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const totalCollected = fees.reduce((acc, fee) => acc + fee.paidAmount, 0);
  const totalPending = fees.reduce((acc, fee) => acc + (fee.amount - fee.paidAmount), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fee Management</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">Monitor collections, manage installments, and track pending dues.</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-50 transition-all">
            <Download className="h-4 w-4 mr-2" /> Export Report
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold flex items-center justify-center hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Plus className="h-4 w-4 mr-2" /> Create Fee Structure
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">+12.5%</span>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Total Collected</p>
            <h3 className="text-2xl font-black text-slate-800">${totalCollected.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-rose-50 rounded-lg">
                <ArrowDownLeft className="h-5 w-5 text-rose-600" />
              </div>
              <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">DUE</span>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Pending Amount</p>
            <h3 className="text-2xl font-black text-slate-800">${totalPending.toLocaleString()}</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Online Payments</p>
            <h3 className="text-2xl font-black text-slate-800">84%</h3>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Banknote className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Scholarships</p>
            <h3 className="text-2xl font-black text-slate-800">$12,450</h3>
          </CardContent>
        </Card>
      </div>

      {/* Fee Table */}
      <Card className="border-none shadow-sm overflow-hidden min-h-[500px]">
        <CardHeader className="border-b border-slate-50 bg-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800">Recent Transactions</CardTitle>
            <div className="flex space-x-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input type="text" placeholder="Search by name or ID..." className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 focus:outline-none" />
              </div>
              <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                <Filter className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 bg-white">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : fees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/50 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {fees.map((fee) => (
                    <tr key={fee._id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 bg-slate-100 rounded-full flex items-center justify-center text-slate-600 font-bold text-xs">
                            {fee.studentId?.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 leading-tight">{fee.studentId?.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{fee.studentId?.rollNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-600 text-xs uppercase tracking-tighter">{fee.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800">${fee.amount}</span>
                          <span className="text-[10px] text-emerald-600 font-bold italic">Paid: ${fee.paidAmount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter ${
                          fee.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 
                          fee.status === 'partially_paid' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {fee.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-xs font-bold text-slate-500">
                          <Clock className="h-3 w-3 mr-1.5 text-slate-400" /> {new Date(fee.dueDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-slate-800 transition-all">
                          Collect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400">
              <Wallet className="h-12 w-12 opacity-20 mb-3" />
              <p className="text-sm font-bold">No fee records found</p>
              <p className="text-xs">Start by creating a fee structure for your school.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
