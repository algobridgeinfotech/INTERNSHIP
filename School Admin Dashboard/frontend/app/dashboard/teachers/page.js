"use client";

import { useEffect, useState } from "react";
import { Save, Trash2 } from "lucide-react";
import api from "../../../services/api";

const initial = { name: "", email: "", password: "teacher123", subject: "", assignedClass: "", phone: "", salary: "" };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState("");
  const [attendance, setAttendance] = useState({ date: new Date().toISOString().slice(0, 10), status: "Present" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const { data } = await api.get("/teachers");
    setTeachers(data);
  };

  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || "Unable to load teachers.")); }, []);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      if (editingId) await api.put(`/teachers/${editingId}`, form);
      else {
        const { data } = await api.post("/teachers", form);
        setMessage(`Teacher login created. Email: ${data.email}, Password: ${data.defaultPassword || form.password}`);
      }
      setForm(initial);
      setEditingId("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save teacher.");
    }
  };

  const edit = (teacher) => {
    setEditingId(teacher._id);
    setForm({ name: teacher.name, email: teacher.email || teacher.user?.email || "", password: "", subject: teacher.subject, assignedClass: teacher.assignedClass, phone: teacher.phone || "", salary: teacher.salary || "" });
  };

  const remove = async (id) => {
    if (!confirm("Delete this teacher and login user?")) return;
    await api.delete(`/teachers/${id}`);
    load();
  };

  const markAttendance = async (teacherId) => {
    await api.post(`/teachers/${teacherId}/attendance`, attendance);
    load();
  };

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-semibold text-slate-950">Teacher Management</h2><p className="text-sm text-slate-500">Add teachers, create teacher logins, assign subjects/classes, and track attendance.</p></div>
      {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
      {message ? <div className="rounded-md bg-teal-50 px-3 py-2 text-sm text-teal-700">{message}</div> : null}
      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" type="email" placeholder="Email/login" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          {!editingId ? <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} minLength={6} required /> : null}
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Assigned class" value={form.assignedClass} onChange={(e) => setForm({ ...form, assignedClass: e.target.value })} required />
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" type="number" placeholder="Salary" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
        </div>
        <button className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"><Save size={17} />{editingId ? "Update Teacher" : "Add Teacher"}</button>
      </form>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Salary</th><th className="px-4 py-3">Attendance</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-200">
        {teachers.map((teacher) => <tr key={teacher._id}><td className="px-4 py-3 font-medium">{teacher.name}<p className="text-xs text-slate-500">{teacher.email || teacher.user?.email}</p></td><td className="px-4 py-3">{teacher.subject}</td><td className="px-4 py-3">{teacher.assignedClass}</td><td className="px-4 py-3">Rs. {teacher.salary || 0}</td><td className="px-4 py-3"><div className="flex min-w-72 gap-2"><input className="focus-ring rounded-md border border-slate-300 px-2 py-1" type="date" value={attendance.date} onChange={(e) => setAttendance({ ...attendance, date: e.target.value })} /><select className="focus-ring rounded-md border border-slate-300 px-2 py-1" value={attendance.status} onChange={(e) => setAttendance({ ...attendance, status: e.target.value })}><option>Present</option><option>Absent</option><option>Late</option></select><button type="button" onClick={() => markAttendance(teacher._id)} className="rounded-md border border-slate-300 px-2 py-1">Mark</button></div></td><td className="px-4 py-3 text-right"><button onClick={() => edit(teacher)} className="mr-2 rounded-md border border-slate-300 px-3 py-1.5">Edit</button><button onClick={() => remove(teacher._id)} className="rounded-md border border-slate-300 p-2 text-rose-600"><Trash2 size={15} /></button></td></tr>)}
        {!teachers.length ? <tr><td className="px-4 py-8 text-center text-slate-500" colSpan="6">No teachers added yet.</td></tr> : null}
      </tbody></table></div></div>
    </div>
  );
}
