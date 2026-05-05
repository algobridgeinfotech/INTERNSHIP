"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileUp, Save } from "lucide-react";
import api from "../../../../services/api";
import { getStoredUser } from "../../../../lib/auth";

export default function StudentProfilePage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [error, setError] = useState("");

  const fetchStudent = async () => {
    setError("");
    try {
      const res = await api.get(`/students/${id}`);
      setData(res.data);
      setForm(res.data.student);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load student profile.");
    }
  };

  useEffect(() => { fetchStudent(); }, [id]);

  const update = async (event) => {
    event.preventDefault();
    if (!isAdmin) return;
    setError("");
    try {
      const formData = new FormData();
      ["name", "rollNumber", "className", "section", "email", "phone", "guardianName", "address"].forEach((key) => formData.append(key, form[key] || ""));
      if (photoFile) formData.append("photo", photoFile);
      const { data: updated } = await api.put(`/students/${id}`, formData);
      setForm(updated);
      setPhotoFile(null);
      fetchStudent();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to update student.");
    }
  };

  const uploadDocument = async (event) => {
    event.preventDefault();
    if (!isAdmin || !documentFile) return;
    const formData = new FormData();
    formData.append("document", documentFile);
    setError("");
    try {
      await api.post(`/students/${id}/documents`, formData);
      setDocumentFile(null);
      fetchStudent();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to upload document.");
    }
  };

  if (!form) return <div className="text-sm text-slate-500">{error || "Loading profile..."}</div>;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><h2 className="text-2xl font-semibold text-slate-950">{form.name}</h2><p className="text-sm text-slate-500">Roll {form.rollNumber} - Class {form.className} {form.section}</p></div>
        <button onClick={() => router.push("/dashboard/students")} className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-medium">Back to Students</button>
      </div>
      {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <form onSubmit={update} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {["name", "rollNumber", "className", "section", "email", "phone", "guardianName", "address"].map((key) => (
              <label key={key} className={key === "address" ? "block md:col-span-2" : "block"}>
                <span className="text-sm font-medium capitalize text-slate-700">{key.replace("className", "class").replace(/([A-Z])/g, " $1")}</span>
                <input disabled={!isAdmin} className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2 disabled:bg-slate-100" value={form[key] || ""} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
              </label>
            ))}
          </div>
          {isAdmin ? <button className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"><Save size={17} />Save Changes</button> : <p className="mt-5 text-sm text-slate-500">Teacher view is read-only for profile details.</p>}
        </form>
        <aside className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            {form.photo?.url ? <Image src={form.photo.url} alt={form.name} width={320} height={220} className="h-52 w-full rounded-md object-cover" /> : <div className="grid h-52 place-items-center rounded-md bg-slate-100 text-sm text-slate-500">No photo uploaded</div>}
            {isAdmin ? <label className="mt-4 block"><span className="text-sm font-medium text-slate-700">Update Photo</span><input className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} /></label> : null}
            {isAdmin && photoFile ? <p className="mt-2 text-xs text-slate-500">Click Save Changes to upload {photoFile.name}.</p> : null}
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-slate-500">Attendance</dt><dd className="font-semibold text-slate-950">{form.attendancePercentage}%</dd></div><div><dt className="text-slate-500">Fee Status</dt><dd className="font-semibold text-slate-950">{form.feeStatus}</dd></div></dl>
          </div>
          <form onSubmit={uploadDocument} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-semibold text-slate-950">Documents</h3>
            <div className="mt-3 space-y-2">{data?.student.documents?.length ? data.student.documents.map((doc) => <a key={doc.publicId} className="block rounded-md border border-slate-200 px-3 py-2 text-sm text-teal-700 hover:bg-teal-50" href={doc.url} target="_blank">{doc.label}</a>) : <p className="text-sm text-slate-500">No documents uploaded.</p>}</div>
            {isAdmin ? <><input className="focus-ring mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="file" onChange={(e) => setDocumentFile(e.target.files?.[0] || null)} /><button className="focus-ring mt-3 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"><FileUp size={17} />Upload</button></> : null}
          </form>
        </aside>
      </div>
    </div>
  );
}
