import { UserSquare, Calendar, FileText, IndianRupee } from "lucide-react";

export default function StaffESSDashboard() {
  return (
    <div className="h-full flex flex-col bg-white rounded-3xl shadow-sm border border-slate-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Staff Self-Service</h1>
          <p className="text-slate-500 mt-2">Your personal employee portal for HR operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "My Payslips", desc: "View and download", icon: FileText },
          { title: "Leave Management", desc: "Apply for leaves", icon: Calendar },
          { title: "My Expenses", desc: "Submit reimbursements", icon: IndianRupee },
          { title: "Profile Settings", desc: "Update personal info", icon: UserSquare },
        ].map((module, i) => (
          <div key={i} className="border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer group">
            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <module.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{module.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{module.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
