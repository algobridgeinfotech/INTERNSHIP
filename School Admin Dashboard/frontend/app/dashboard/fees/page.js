"use client";

import { useEffect, useState } from "react";
import { CreditCard, FileText, Plus } from "lucide-react";
import api from "../../../services/api";

const initial = { studentId: "", title: "", amount: "", paidAmount: "0", dueDate: "", paymentMethod: "" };

export default function FeesPage() {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const fetchFees = async () => {
    setError("");
    try {
      const params = status ? { status } : {};
      const { data } = await api.get("/fees", { params });
      setFees(data);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load fee records.");
    }
  };

  useEffect(() => {
    api
      .get("/students", { params: { limit: 100 } })
      .then((res) => setStudents(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Unable to load students."));
  }, []);

  useEffect(() => {
    fetchFees();
  }, [status]);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/fees", form);
      setForm(initial);
      fetchFees();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save fee.");
    }
  };

  const receiptUrl = (feeId) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    return `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/fees/${feeId}/receipt?token=${token}`;
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Fees</h2>
        <p className="text-sm text-slate-500">Add fee details, track payment status, and generate receipts.</p>
      </div>

      <form onSubmit={submit} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2 font-semibold text-slate-950">
          <CreditCard size={18} />
          Add Fee
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} required>
            <option value="">Select student</option>
            {students.map((student) => <option key={student._id} value={student._id}>{student.name} - {student.rollNumber}</option>)}
          </select>
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Fee title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" type="number" placeholder="Paid amount" value={form.paidAmount} onChange={(e) => setForm({ ...form, paidAmount: e.target.value })} />
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required />
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Payment method" value={form.paymentMethod} onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })} />
        </div>
        <button className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
          <Plus size={17} />
          Save Fee
        </button>
        {error ? <p className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}
      </form>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center">
          <h3 className="font-semibold text-slate-950">Fee Records</h3>
          <select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option>Paid</option>
            <option>Unpaid</option>
            <option>Partial</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Fee</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Paid</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fees.map((fee) => (
                <tr key={fee._id}>
                  <td className="px-4 py-3 font-medium text-slate-950">{fee.student?.name}</td>
                  <td className="px-4 py-3">{fee.title}</td>
                  <td className="px-4 py-3">Rs. {fee.amount}</td>
                  <td className="px-4 py-3">Rs. {fee.paidAmount}</td>
                  <td className="px-4 py-3"><span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">{fee.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <a className="focus-ring inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100" href={receiptUrl(fee._id)} target="_blank">
                      <FileText size={15} />
                      PDF
                    </a>
                  </td>
                </tr>
              ))}
              {!fees.length ? <tr><td className="px-4 py-8 text-center text-slate-500" colSpan="6">No fee records found.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
