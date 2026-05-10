import { Contact, Plus } from "lucide-react";

export default function ContactsDashboard() {
  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Global Contacts</h1>
          <p className="text-slate-500 mt-2">Centralized directory for all vendors, alumni, and external partners.</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          <Plus className="h-5 w-5 mr-2" /> Add Contact
        </button>
      </div>

      <div className="flex-1 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <Contact className="h-12 w-12 mb-4 text-slate-300" />
        <p className="font-medium">Contacts directory will appear here</p>
      </div>
    </div>
  );
}
