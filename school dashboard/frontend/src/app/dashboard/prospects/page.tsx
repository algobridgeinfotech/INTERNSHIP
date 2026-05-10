import { Target, Users, ArrowUpRight, Plus } from "lucide-react";

export default function ProspectsDashboard() {
  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Prospects Dashboard</h1>
          <p className="text-slate-500 mt-2">Track leads, inquiries, and potential student conversions.</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          <Plus className="h-5 w-5 mr-2" /> Add Prospect
        </button>
      </div>

      <div className="flex-1 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <Target className="h-12 w-12 mb-4 text-slate-300" />
        <p className="font-medium">CRM Pipeline view will be displayed here</p>
      </div>
    </div>
  );
}
