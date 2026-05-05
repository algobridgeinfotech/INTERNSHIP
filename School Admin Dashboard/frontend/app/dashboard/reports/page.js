"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Download } from "lucide-react";
import api from "../../../services/api";
import StatCard from "../../../components/StatCard";

const colors = ["#0f766e", "#4f46e5", "#d97706", "#be123c", "#475569"];

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/reports").then((res) => setSummary(res.data)).catch((err) => setError(err.response?.data?.message || "Unable to load reports."));
  }, []);

  const downloadCsv = () => {
    const token = localStorage.getItem("token");
    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/reports/students.csv?token=${token}`, "_blank");
  };

  const classData = summary?.classWiseStudents?.map((item) => ({ className: item._id || "Unknown", students: item.count, attendance: Math.round(item.avgAttendance || 0) })) || [];
  const feeData = summary?.feeSummary?.map((item) => ({ name: item._id, value: item.count })) || [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><h2 className="text-2xl font-semibold text-slate-950">Reports & Analytics</h2><p className="text-sm text-slate-500">Class-wise reports, fee analytics, attendance summary, and exports.</p></div>
        <button onClick={downloadCsv} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"><Download size={17} />Export CSV</button>
      </div>
      {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Students" value={summary?.totalStudents ?? "..."} />
        <StatCard label="Teachers" value={summary?.totalTeachers ?? "..."} />
        <StatCard label="Fee Collected" value={`Rs. ${summary?.feeCollected ?? 0}`} />
        <StatCard label="Avg Attendance" value={`${summary?.averageAttendance ?? 0}%`} />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-950">Class-wise Students</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="className" /><YAxis /><Tooltip /><Bar dataKey="students" fill="#0f766e" radius={[4, 4, 0, 0]} /></BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-950">Fee Status Split</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={feeData} dataKey="value" nameKey="name" outerRadius={92} label>{feeData.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}
