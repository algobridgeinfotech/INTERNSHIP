import { BookOpen, Calendar, BookMarked, Award } from "lucide-react";

export default function AcademicsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academics Center</h1>
        <p className="text-muted-foreground mt-1">
          Curriculum, exams, assignments, and timetable management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModuleCard title="Classes & Sections" icon={BookOpen} color="text-blue-500" bg="bg-blue-500/10" desc="Manage class hierarchy" />
        <ModuleCard title="Subjects & Syllabus" icon={BookMarked} color="text-purple-500" bg="bg-purple-500/10" desc="Define curriculum" />
        <ModuleCard title="Timetable" icon={Calendar} color="text-emerald-500" bg="bg-emerald-500/10" desc="Schedule classes" />
        <ModuleCard title="Examinations" icon={Award} color="text-amber-500" bg="bg-amber-500/10" desc="Manage tests and grades" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Upcoming Examinations</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary/20 transition-colors cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex flex-col items-center justify-center text-primary">
                  <span className="text-xs font-bold uppercase">Oct</span>
                  <span className="text-lg font-bold leading-none">15</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Mid-Term Assessments</p>
                  <p className="text-sm text-muted-foreground">Classes 6 to 10</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-medium">Scheduled</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Today&apos;s Timetable Overview</h3>
          <div className="flex h-40 items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-lg">
            Calendar Widget Placeholder
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleCard({ title, icon: Icon, color, bg, desc }: any) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:-translate-y-1">
      <div className={`h-12 w-12 rounded-lg ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1">{desc}</p>
    </div>
  );
}
