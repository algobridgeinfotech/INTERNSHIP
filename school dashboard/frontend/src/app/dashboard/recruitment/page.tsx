import { Briefcase, Search, Plus, Filter, Users } from "lucide-react";

export default function RecruitmentDashboard() {
  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Recruitment Dashboard</h1>
          <p className="text-slate-500 mt-2">Manage job postings, applicant tracking, and interviews.</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium flex items-center hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
          <Plus className="h-5 w-5 mr-2" /> New Job Posting
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Active Jobs", value: "12", icon: Briefcase, color: "text-blue-500", bg: "bg-blue-50" },
          { title: "Total Applicants", value: "348", icon: Users, color: "text-indigo-500", bg: "bg-indigo-50" },
          { title: "Interviews Scheduled", value: "24", icon: Search, color: "text-purple-500", bg: "bg-purple-50" }
        ].map((stat, i) => (
          <div key={i} className="border border-slate-100 rounded-2xl p-6 flex items-center space-x-4">
            <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-1 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400">
        <Briefcase className="h-12 w-12 mb-4 text-slate-300" />
        <p className="font-medium">Applicant tracking table will be displayed here</p>
      </div>
    </div>
  );
}
