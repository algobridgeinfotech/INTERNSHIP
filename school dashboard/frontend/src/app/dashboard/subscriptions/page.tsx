"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  CreditCard, Package, ScrollText, 
  CheckCircle2, AlertCircle, DollarSign,
  Plus, ArrowRight, Wallet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function SubscriptionsPage() {
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const res = await api.get("/superadmin/subscriptions/plans");
      return res.data;
    },
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ["all-invoices"],
    queryFn: async () => {
      const res = await api.get("/superadmin/subscriptions/invoices");
      return res.data;
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Subscription Manager</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage SaaS plans, billing, and institutional invoices.</p>
        </div>
        <button className="flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-bold transition-all shadow-lg shadow-slate-200">
          <Plus className="h-5 w-5" />
          <span>Create New Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Plans */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center space-x-2 px-1">
            <Package className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-slate-800">Active Platform Plans</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plansLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            ) : (
              plans?.map((plan: any) => (
                <Card key={plan._id} className="border-none shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4">
                    <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-md uppercase tracking-widest border border-emerald-100">Active</span>
                  </div>
                  <CardHeader className="pt-8 pb-4">
                    <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">{plan.name}</CardTitle>
                    <div className="flex items-baseline mt-2">
                      <span className="text-3xl font-black text-blue-600">${plan.price}</span>
                      <span className="text-xs font-bold text-slate-400 ml-1">/{plan.billingCycle}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-8">
                    <ul className="space-y-3">
                      {plan.features?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center text-sm font-medium text-slate-600">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mr-2 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <button className="w-full py-2.5 rounded-xl border border-slate-100 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center group">
                      Edit Plan Details <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="space-y-6">
          <div className="flex items-center space-x-2 px-1">
            <ScrollText className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-800">Recent Invoices</h2>
          </div>

          <div className="space-y-4">
            {invoicesLoading ? (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            ) : (
              invoices?.map((invoice: any) => (
                <div key={invoice._id} className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                      invoice.status === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      <DollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 leading-tight">{invoice.schoolId?.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{invoice.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">${invoice.amount}</p>
                    <p className={`text-[10px] font-black uppercase ${
                      invoice.status === 'paid' ? 'text-emerald-500' : 'text-rose-500'
                    }`}>{invoice.status}</p>
                  </div>
                </div>
              ))
            )}
            <button className="w-full py-3 text-sm font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
              View All Billing History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
