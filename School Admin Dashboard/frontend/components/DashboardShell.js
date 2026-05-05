"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Bell, CalendarCheck, CalendarDays, ClipboardList, CreditCard, GraduationCap, LogOut, Menu, Presentation, Users, X } from "lucide-react";
import { useState } from "react";
import { clearAuth, getStoredUser } from "../lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: BarChart3, roles: ["admin", "teacher"] },
  { href: "/dashboard/students", label: "Students", icon: Users, roles: ["admin", "teacher"] },
  { href: "/dashboard/attendance", label: "Attendance", icon: CalendarCheck, roles: ["admin", "teacher"] },
  { href: "/dashboard/fees", label: "Fees", icon: CreditCard, roles: ["admin"] },
  { href: "/dashboard/exams", label: "Exams & Results", icon: ClipboardList, roles: ["admin", "teacher"] },
  { href: "/dashboard/teachers", label: "Teachers", icon: Presentation, roles: ["admin"] },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell, roles: ["admin", "teacher"] },
  { href: "/dashboard/timetable", label: "Timetable", icon: CalendarDays, roles: ["admin", "teacher"] },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3, roles: ["admin"] }
];

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const user = getStoredUser();
  const role = user?.role || "admin";
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  const logout = () => {
    clearAuth();
    router.push("/login");
  };

  const Sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-teal-600 text-white"><GraduationCap size={23} /></div>
        <div><p className="text-base font-semibold text-slate-950">Student Portal</p><p className="text-xs text-slate-500">{role === "admin" ? "Admin" : "Teacher"} Dashboard</p></div>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${active ? "bg-teal-50 text-teal-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>
              <Icon size={18} />{item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <p className="text-sm font-medium text-slate-900">{user?.name || "User"}</p>
        <p className="truncate text-xs text-slate-500">{user?.email || "Logged in"}</p>
        {user?.teacher ? <p className="mt-1 text-xs text-slate-500">Class {user.teacher.assignedClass} / {user.teacher.subject}</p> : null}
        <button onClick={logout} className="focus-ring mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"><LogOut size={16} />Logout</button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex">{Sidebar}</div>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:ml-72 lg:px-8">
        <button className="focus-ring rounded-md p-2 text-slate-700 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
        <div><p className="text-sm text-slate-500">Welcome back</p><h1 className="text-lg font-semibold text-slate-950">{role === "admin" ? "Admin" : "Teacher"} Dashboard</h1></div>
      </header>
      {open ? <div className="fixed inset-0 z-40 lg:hidden"><button className="absolute inset-0 bg-slate-950/40" onClick={() => setOpen(false)} aria-label="Close menu" /><div className="relative h-full w-72 bg-white"><button className="focus-ring absolute right-3 top-3 rounded-md p-2 text-slate-600" onClick={() => setOpen(false)} aria-label="Close menu"><X size={20} /></button>{Sidebar}</div></div> : null}
      <main className="p-4 lg:ml-72 lg:p-8">{children}</main>
    </div>
  );
}
