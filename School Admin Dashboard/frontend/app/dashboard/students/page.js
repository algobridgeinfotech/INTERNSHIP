"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FileUp, Pencil, Plus, RotateCcw, Save, Search, Trash2, X } from "lucide-react";
import api from "../../../services/api";
import { getStoredUser } from "../../../lib/auth";

const emptyFilters = { search: "", class: "", section: "", status: "", minAttendance: "" };
const emptyStudentForm = {
  name: "",
  rollNumber: "",
  className: "",
  section: "",
  email: "",
  phone: "",
  guardianName: "",
  address: ""
};

export default function StudentsPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";
  const [filters, setFilters] = useState(emptyFilters);
  const [showAddForm, setShowAddForm] = useState(false);
  const [studentForm, setStudentForm] = useState(emptyStudentForm);
  const [photo, setPhoto] = useState(null);
  const [saving, setSaving] = useState(false);
  const [photoInputKey, setPhotoInputKey] = useState(0);
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [error, setError] = useState("");

  const fetchStudents = useCallback(async (page = 1, nextFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const params = { ...nextFilters, page, limit: 8 };
      Object.keys(params).forEach((key) => params[key] === "" && delete params[key]);
      const { data } = await api.get("/students", { params });
      setStudents(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load students.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { const timer = setTimeout(() => fetchStudents(1), 300); return () => clearTimeout(timer); }, [filters, fetchStudents]);

  const updateFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }));
  const updateStudentForm = (key, value) => setStudentForm((current) => ({ ...current, [key]: value }));
  const resetFilters = () => { setFilters(emptyFilters); fetchStudents(1, emptyFilters); };
  const resetStudentForm = () => {
    setStudentForm(emptyStudentForm);
    setPhoto(null);
    setPhotoInputKey((key) => key + 1);
  };

  const createStudent = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    const formData = new FormData();
    Object.entries(studentForm).forEach(([key, value]) => formData.append(key, value));
    if (photo) formData.append("photo", photo);

    try {
      await api.post("/students", formData);
      resetStudentForm();
      setShowAddForm(false);
      fetchStudents(1);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to add student.");
    } finally {
      setSaving(false);
    }
  };

  const deleteStudent = async (id) => {
    if (!confirm("Delete this student?")) return;
    try { await api.delete(`/students/${id}`); fetchStudents(pagination.page); } catch (err) { setError(err.response?.data?.message || "Unable to delete student."); }
  };

  const uploadBulk = async (event) => {
    event.preventDefault();
    if (!bulkFile) return;
    const formData = new FormData();
    formData.append("file", bulkFile);
    try { await api.post("/students/bulk", formData); setBulkFile(null); fetchStudents(1); } catch (err) { setError(err.response?.data?.message || "Bulk upload failed."); }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div><h2 className="text-2xl font-semibold text-slate-950">Students</h2><p className="text-sm text-slate-500">{isAdmin ? "Search, filter, edit, and manage student records." : "View students from your assigned class."}</p></div>
        {isAdmin ? <button onClick={() => setShowAddForm((visible) => !visible)} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">{showAddForm ? <X size={17} /> : <Plus size={17} />}{showAddForm ? "Close Form" : "Add Student"}</button> : null}
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"><div className="grid gap-3 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr_auto]"><label className="relative"><Search className="absolute left-3 top-2.5 text-slate-400" size={18} /><input className="focus-ring w-full rounded-md border border-slate-300 py-2 pl-10 pr-3" placeholder="Search by name, roll number, class" value={filters.search} onChange={(e) => updateFilter("search", e.target.value)} /></label><select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={filters.class} onChange={(e) => updateFilter("class", e.target.value)}><option value="">All Classes</option>{["1","2","3","4","5","6","7","8","9","10","11","12"].map((item) => <option key={item}>{item}</option>)}</select><select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={filters.section} onChange={(e) => updateFilter("section", e.target.value)}><option value="">All Sections</option>{["A","B","C","D"].map((item) => <option key={item}>{item}</option>)}</select><select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}><option value="">Fee Status</option><option>Paid</option><option>Unpaid</option><option>Partial</option></select><input className="focus-ring rounded-md border border-slate-300 px-3 py-2" type="number" min="0" max="100" placeholder="Min attendance %" value={filters.minAttendance} onChange={(e) => updateFilter("minAttendance", e.target.value)} /><button onClick={resetFilters} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"><RotateCcw size={16} />Reset</button></div></div>
      {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}

      {isAdmin && showAddForm ? (
        <form onSubmit={createStudent} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            {[
              ["name", "Name"],
              ["rollNumber", "Roll Number"],
              ["className", "Class"],
              ["section", "Section"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["guardianName", "Guardian Name"]
            ].map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-sm font-medium text-slate-700">{label}</span>
                <input className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" value={studentForm[key]} onChange={(event) => updateStudentForm(key, event.target.value)} required={["name", "rollNumber", "className", "section"].includes(key)} />
              </label>
            ))}
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Photo</span>
              <input key={photoInputKey} className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm" type="file" accept="image/*" onChange={(event) => setPhoto(event.target.files?.[0] || null)} />
            </label>
            <label className="block md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Address</span>
              <textarea className="focus-ring mt-1 min-h-24 w-full rounded-md border border-slate-300 px-3 py-2" value={studentForm.address} onChange={(event) => updateStudentForm("address", event.target.value)} />
            </label>
          </div>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button disabled={saving} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"><Save size={17} />{saving ? "Saving..." : "Save Student"}</button>
            <button type="button" onClick={resetStudentForm} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"><RotateCcw size={16} />Clear</button>
          </div>
        </form>
      ) : null}

      {isAdmin ? <form onSubmit={uploadBulk} className="flex flex-col gap-3 rounded-lg border border-dashed border-slate-300 bg-white p-4 sm:flex-row sm:items-center"><input className="focus-ring flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm" type="file" accept=".csv,.xlsx,.xls" onChange={(e) => setBulkFile(e.target.files?.[0] || null)} /><button className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"><FileUp size={17} />Bulk Upload</button></form> : null}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Roll</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Attendance</th><th className="px-4 py-3">Fee</th><th className="px-4 py-3 text-right">Actions</th></tr></thead><tbody className="divide-y divide-slate-200">
        {loading ? <tr><td className="px-4 py-8 text-center text-slate-500" colSpan="6">Loading students...</td></tr> : students.length ? students.map((student) => <tr key={student._id} className="hover:bg-slate-50"><td className="px-4 py-3"><Link href={`/dashboard/students/${student._id}`} className="font-medium text-slate-950 hover:text-teal-700">{student.name}</Link><p className="text-xs text-slate-500">{student.email || student.phone || "No contact added"}</p></td><td className="px-4 py-3">{student.rollNumber}</td><td className="px-4 py-3">{student.className} - {student.section}</td><td className="px-4 py-3">{student.attendancePercentage}%</td><td className="px-4 py-3"><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{student.feeStatus}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-2"><Link href={`/dashboard/students/${student._id}`} className="focus-ring rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-100" aria-label="View student"><Pencil size={15} /></Link>{isAdmin ? <button onClick={() => deleteStudent(student._id)} className="focus-ring rounded-md border border-slate-300 p-2 text-rose-600 hover:bg-rose-50" aria-label="Delete student"><Trash2 size={15} /></button> : null}</div></td></tr>) : <tr><td className="px-4 py-8 text-center text-slate-500" colSpan="6">No students found.</td></tr>}
      </tbody></table></div><div className="flex flex-col justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center"><p className="text-sm text-slate-500">Showing page {pagination.page} of {pagination.pages || 1} ({pagination.total} records)</p><div className="flex gap-2"><button disabled={pagination.page <= 1} onClick={() => fetchStudents(pagination.page - 1)} className="focus-ring rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50">Previous</button><button disabled={pagination.page >= pagination.pages} onClick={() => fetchStudents(pagination.page + 1)} className="focus-ring rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50">Next</button></div></div></div>
    </div>
  );
}
