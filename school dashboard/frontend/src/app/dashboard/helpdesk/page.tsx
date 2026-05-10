"use client";

import { Search, Download, RefreshCw, Plus, Filter, User, FileText, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function HelpdeskPage() {
  const [activeTab, setActiveTab] = useState("Tickets");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Admin Help Center</h1>
        <p className="text-sm text-slate-500 mt-1">
          Advanced ticket management & support system
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-2 flex space-x-2 w-fit">
        <button 
          onClick={() => setActiveTab("FAQs")}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === "FAQs" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <User className="h-4 w-4 mr-2" /> FAQs
        </button>
        <button 
          onClick={() => setActiveTab("Tickets")}
          className={`flex items-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === "Tickets" ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"}`}
        >
          <FileText className="h-4 w-4 mr-2" /> Tickets
        </button>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400" />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-blue-200 bg-blue-50/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          />
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
            <Filter className="h-4 w-4 mr-2 text-slate-500" /> Filters <ChevronDown className="h-4 w-4 ml-2 text-slate-400" />
          </button>
          <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
            <Download className="h-4 w-4 mr-2 text-slate-500" /> Download
          </button>
          <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm">
            <RefreshCw className="h-4 w-4 mr-2 text-slate-500" /> Refresh
          </button>
          <button className="flex items-center px-4 py-2.5 bg-blue-600 border border-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors">
            <Plus className="h-4 w-4 mr-2" /> Create Ticket
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 text-blue-900 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-10"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></th>
                <th className="px-6 py-4">TICKET ID</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4">CUSTOMER</th>
                <th className="px-6 py-4">ISSUE TYPE</th>
                <th className="px-6 py-4">SUBJECT</th>
                <th className="px-6 py-4">BUSINESS</th>
                <th className="px-6 py-4">CREATED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: "TKT_D15DCE7B", issue: "Billing or Payment Problem", sub: "tickiting", date: "March 2, 2024" },
                { id: "TKT_C83CA8E2", issue: "Login or Access Issue", sub: "rgdfgdsgdfg", date: "March 2, 2024" },
                { id: "TKT_51F4015D", issue: "Login or Access Issue", sub: "rgdfdfgdf", date: "February 28, 2024" },
                { id: "TKT_BA5108FC", issue: "Feature Request", sub: "a123", date: "February 28, 2024" },
                { id: "TKT_F4A68522", issue: "Bug or Error", sub: "Bug", date: "February 16, 2024" },
              ].map((ticket, i) => (
                <tr key={i} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" /></td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-blue-600 hover:underline cursor-pointer">{ticket.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                      Open
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                        D
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">demo</span>
                        <span className="text-[11px] text-slate-500">himanshu.bharti@mobiloitte.com</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-800 font-medium">
                    {ticket.issue}
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {ticket.sub}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">Realtify</span>
                      <span className="text-[10px] text-slate-400 font-mono">REAL-SHAS-BAED3B</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">
                    {ticket.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
