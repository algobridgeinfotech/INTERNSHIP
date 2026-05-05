"use client";

import { useEffect, useState } from "react";
import { Bell, Trash2 } from "lucide-react";
import api from "../../../services/api";
import { getStoredUser } from "../../../lib/auth";

const initial = { title: "", message: "", type: "Announcement" };

export default function NotificationsPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";
  const [notifications, setNotifications] = useState([]);
  const [form, setForm] = useState(initial);
  const [error, setError] = useState("");

  const load = async () => { const { data } = await api.get("/notifications"); setNotifications(data); };
  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || "Unable to load notifications.")); }, []);

  const submit = async (event) => { event.preventDefault(); setError(""); try { await api.post("/notifications", form); setForm(initial); load(); } catch (err) { setError(err.response?.data?.message || "Unable to send notification."); } };
  const remove = async (id) => { await api.delete(`/notifications/${id}`); load(); };

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-semibold text-slate-950">Notifications</h2><p className="text-sm text-slate-500">{isAdmin ? "Send announcements, reminders, and holiday notices." : "Read school announcements, reminders, and holiday notices."}</p></div>
      {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
      {isAdmin ? <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="grid gap-3 md:grid-cols-[1fr_220px]"><input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /><select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Announcement</option><option>Fee Reminder</option><option>Holiday</option><option>General</option></select><textarea className="focus-ring min-h-24 rounded-md border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required /></div><button className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"><Bell size={17} />Send Notice</button></form> : null}
      <div className="grid gap-3 lg:grid-cols-2">{notifications.map((item) => <article key={item._id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium uppercase text-teal-700">{item.type}</p><h3 className="font-semibold text-slate-950">{item.title}</h3></div>{isAdmin ? <button onClick={() => remove(item._id)} className="rounded-md border border-slate-300 p-2 text-rose-600"><Trash2 size={15} /></button> : null}</div><p className="mt-2 text-sm text-slate-600">{item.message}</p><p className="mt-3 text-xs text-slate-400">{new Date(item.date).toLocaleDateString()}</p></article>)}</div>
    </div>
  );
}
