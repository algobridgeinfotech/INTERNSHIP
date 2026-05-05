"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, CreditCard, IndianRupee, Users } from "lucide-react";
import api from "../../services/api";
import StatCard from "../../components/StatCard";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load dashboard stats."));
  }, []);

  const fees = stats?.fees || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Overview</h2>
        <p className="text-sm text-slate-500">Live summary for students, attendance, and fees.</p>
      </div>
      {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={stats?.totalStudents ?? "..."} icon={Users} tone="teal" />
        <StatCard label="Total Teachers" value={stats?.totalTeachers ?? "..."} icon={Users} tone="indigo" />
        <StatCard label="Present Today" value={stats?.attendance?.presentToday ?? "..."} helper={`${stats?.attendance?.absentToday ?? 0} absent today`} icon={CalendarCheck} tone="indigo" />
        <StatCard label="Fee Collected" value={`Rs. ${fees.collected ?? 0}`} helper={`Expected Rs. ${fees.expected ?? 0}`} icon={IndianRupee} tone="amber" />
        <StatCard label="Unpaid Fees" value={fees.unpaidCount ?? "..."} icon={CreditCard} tone="rose" />
      </div>
    </div>
  );
}
