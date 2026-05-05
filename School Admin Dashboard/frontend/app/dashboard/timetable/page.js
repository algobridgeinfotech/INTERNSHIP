"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import api from "../../../services/api";
import { getStoredUser } from "../../../lib/auth";

const initial = { className: "", day: "Monday", subject: "", teacher: "", timeSlot: "" };
const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function TimetablePage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";
  const [entries, setEntries] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const load = async () => {
    const timetableRes = await api.get("/timetable");
    setEntries(timetableRes.data);
    if (isAdmin) { const teacherRes = await api.get("/teachers"); setTeachers(teacherRes.data); }
  };

  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || "Unable to load timetable.")); }, []);
  const submit = async (event) => { event.preventDefault(); setError(""); try { await api.post("/timetable", form); setForm(initial); load(); } catch (err) { setError(err.response?.data?.message || "Unable to save timetable entry."); } };
  const remove = async (id) => { await api.delete(`/timetable/${id}`); load(); };

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-semibold text-slate-950">Timetable</h2><p className="text-sm text-slate-500">{isAdmin ? "Assign class, subject, teacher, and time slot. Conflicts are blocked automatically." : "View your assigned teaching schedule."}</p></div>
      {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
      {isAdmin ? <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="grid gap-3 md:grid-cols-5"><input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Class" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} required /><select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })}>{days.map((day) => <option key={day}>{day}</option>)}</select><input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /><select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} required><option value="">Teacher</option>{teachers.map((teacher) => <option key={teacher._id} value={teacher._id}>{teacher.name} - {teacher.subject}</option>)}</select><input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="09:00-10:00" value={form.timeSlot} onChange={(e) => setForm({ ...form, timeSlot: e.target.value })} required /></div><button className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"><CalendarDays size={17} />Add Slot</button></form> : null}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Class</th><th className="px-4 py-3">Day</th><th className="px-4 py-3">Time</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Teacher</th>{isAdmin ? <th className="px-4 py-3 text-right">Action</th> : null}</tr></thead><tbody className="divide-y divide-slate-200">{entries.map((entry) => <tr key={entry._id}><td className="px-4 py-3">{entry.className}</td><td className="px-4 py-3">{entry.day}</td><td className="px-4 py-3">{entry.timeSlot}</td><td className="px-4 py-3">{entry.subject}</td><td className="px-4 py-3">{entry.teacher?.name}</td>{isAdmin ? <td className="px-4 py-3 text-right"><button onClick={() => remove(entry._id)} className="rounded-md border border-slate-300 p-2 text-rose-600"><Trash2 size={15} /></button></td> : null}</tr>)}{!entries.length ? <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={isAdmin ? 6 : 5}>No timetable slots added yet.</td></tr> : null}</tbody></table></div></div>
    </div>
  );
}
