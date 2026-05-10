import { Users, MessageCircle, Heart } from "lucide-react";

export default function CommunityDashboard() {
  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Community</h1>
            <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-md">New</span>
          </div>
          <p className="text-slate-500 mt-2">Engage with alumni, students, and staff in discussion forums.</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          <MessageCircle className="h-5 w-5 mr-2" /> New Discussion
        </button>
      </div>

      <div className="flex-1 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <Users className="h-12 w-12 mb-4 text-slate-300" />
        <p className="font-medium">Community feed and discussions will appear here</p>
      </div>
    </div>
  );
}
