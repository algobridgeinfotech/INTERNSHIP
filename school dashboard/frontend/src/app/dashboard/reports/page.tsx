import { FileText, Download, TrendingUp, PieChart } from "lucide-react";

export default function ReportsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-1">
          Generate, view, and export comprehensive platform analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 cursor-pointer transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <Download className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold text-lg">Financial Report</h3>
            <p className="text-sm text-muted-foreground mt-1">Monthly fee collection, expenses, and revenue projections.</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/50 cursor-pointer transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <div className="h-10 w-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <Download className="h-5 w-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
            </div>
            <h3 className="font-semibold text-lg">Academic Performance</h3>
            <p className="text-sm text-muted-foreground mt-1">Class-wise grading trends, pass percentages, and subject analytics.</p>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm min-h-[400px] flex items-center justify-center flex-col">
          <PieChart className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">Select a report to view interactive visualizations</p>
        </div>
      </div>
    </div>
  );
}
