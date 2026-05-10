import { Settings2 } from "lucide-react";

export default function ControlsDashboard() {
  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">System Controls</h1>
          <p className="text-slate-500 mt-2">Manage global configurations, features, and platform toggles.</p>
        </div>
      </div>

      <div className="flex-1 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <Settings2 className="h-12 w-12 mb-4 text-slate-300" />
        <p className="font-medium">System control toggles will appear here</p>
      </div>
    </div>
  );
}
