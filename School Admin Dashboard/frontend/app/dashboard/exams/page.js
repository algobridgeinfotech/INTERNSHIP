"use client";

import { useEffect, useState } from "react";
import { ClipboardList, Lock, Plus, Save, Unlock } from "lucide-react";
import api from "../../../services/api";
import { getStoredUser } from "../../../lib/auth";

const examInitial = { name: "", type: "Unit Test", className: "", subjectsText: "Math:100, Science:100" };
const resultInitial = { examId: "", studentId: "", marksText: "Math:85, Science:90" };

const parseSubjects = (text) => text.split(",").map((item) => { const [name, value = "100"] = item.trim().split(":"); return { name: name?.trim(), maxMarks: Number(value), marks: Number(value), marksObtained: Number(value) }; }).filter((item) => item.name);

export default function ExamsPage() {
  const user = getStoredUser();
  const isAdmin = user?.role === "admin";
  const [exams, setExams] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [examForm, setExamForm] = useState(examInitial);
  const [resultForm, setResultForm] = useState(resultInitial);
  const [error, setError] = useState("");

  const load = async () => {
    const [examRes, studentRes, resultRes] = await Promise.all([api.get("/exam"), api.get("/students", { params: { limit: 200 } }), api.get("/result")]);
    setExams(examRes.data);
    setStudents(studentRes.data.data);
    setResults(resultRes.data);
  };

  useEffect(() => { load().catch((err) => setError(err.response?.data?.message || "Unable to load exams.")); }, []);

  const createExam = async (event) => {
    event.preventDefault();
    setError("");
    try { await api.post("/exam", { ...examForm, subjects: parseSubjects(examForm.subjectsText).map(({ name, maxMarks }) => ({ name, maxMarks })) }); setExamForm(examInitial); load(); } catch (err) { setError(err.response?.data?.message || "Unable to create exam."); }
  };

  const saveResult = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const selectedExam = exams.find((exam) => exam._id === resultForm.examId);
      const subjects = parseSubjects(resultForm.marksText);
      const marks = subjects.map((item) => { const subject = selectedExam?.subjects.find((examSubject) => examSubject.name.toLowerCase() === item.name.toLowerCase()); return { subject: item.name, marks: item.marks, marksObtained: item.marks, maxMarks: subject?.maxMarks || 100 }; });
      await api.post("/result", { examId: resultForm.examId, studentId: resultForm.studentId, marks });
      setResultForm(resultInitial);
      load();
    } catch (err) { setError(err.response?.data?.message || "Unable to save result."); }
  };

  const toggleLock = async (exam) => { await api.patch(`/exam/${exam._id}/lock`, { locked: !exam.resultsLocked }); load(); };

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-semibold text-slate-950">Examination & Results</h2><p className="text-sm text-slate-500">{isAdmin ? "Create exams, override marks, lock/unlock results, and view ranks." : "Enter draft marks only for your assigned subject and class."}</p></div>
      {error ? <div className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
      <div className="grid gap-5 xl:grid-cols-2">
        {isAdmin ? <form onSubmit={createExam} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2 font-semibold text-slate-950"><ClipboardList size={18} />Create Exam</div><div className="grid gap-3 md:grid-cols-2"><input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Exam name" value={examForm.name} onChange={(e) => setExamForm({ ...examForm, name: e.target.value })} required /><select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={examForm.type} onChange={(e) => setExamForm({ ...examForm, type: e.target.value })}><option>Unit Test</option><option>Midterm</option><option>Final</option><option>Other</option></select><input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Class" value={examForm.className} onChange={(e) => setExamForm({ ...examForm, className: e.target.value })} required /><input className="focus-ring rounded-md border border-slate-300 px-3 py-2" placeholder="Subjects e.g. Math:100, Science:100" value={examForm.subjectsText} onChange={(e) => setExamForm({ ...examForm, subjectsText: e.target.value })} required /></div><button className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white"><Plus size={17} />Add Exam</button></form> : null}
        <form onSubmit={saveResult} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><div className="mb-4 flex items-center gap-2 font-semibold text-slate-950"><Save size={18} />Enter Marks</div><div className="grid gap-3 md:grid-cols-2"><select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={resultForm.examId} onChange={(e) => setResultForm({ ...resultForm, examId: e.target.value })} required><option value="">Select exam</option>{exams.map((exam) => <option key={exam._id} value={exam._id}>{exam.name} - Class {exam.className}{exam.resultsLocked ? " (Locked)" : ""}</option>)}</select><select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={resultForm.studentId} onChange={(e) => setResultForm({ ...resultForm, studentId: e.target.value })} required><option value="">Select student</option>{students.map((student) => <option key={student._id} value={student._id}>{student.name} - {student.rollNumber}</option>)}</select><input className="focus-ring rounded-md border border-slate-300 px-3 py-2 md:col-span-2" placeholder="Marks e.g. Math:85, Science:90" value={resultForm.marksText} onChange={(e) => setResultForm({ ...resultForm, marksText: e.target.value })} required /></div><button className="focus-ring mt-4 inline-flex items-center gap-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"><Save size={17} />Save Marks</button></form>
      </div>
      {isAdmin ? <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"><h3 className="mb-3 font-semibold text-slate-950">Result Locks</h3><div className="flex flex-wrap gap-2">{exams.map((exam) => <button key={exam._id} onClick={() => toggleLock(exam)} className="inline-flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100">{exam.resultsLocked ? <Unlock size={15} /> : <Lock size={15} />}{exam.resultsLocked ? "Unlock" : "Lock"} {exam.name} - Class {exam.className}</button>)}</div></div> : null}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-950">Result Rankings</div><div className="overflow-x-auto"><table className="min-w-full divide-y divide-slate-200 text-sm"><thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3">Rank</th><th className="px-4 py-3">Student</th><th className="px-4 py-3">Exam</th><th className="px-4 py-3">Marks</th><th className="px-4 py-3">%</th><th className="px-4 py-3">Grade</th><th className="px-4 py-3">Status</th></tr></thead><tbody className="divide-y divide-slate-200">{results.map((result) => <tr key={result._id}><td className="px-4 py-3">{result.rank || "-"}</td><td className="px-4 py-3 font-medium">{result.student?.name}</td><td className="px-4 py-3">{result.exam?.name}</td><td className="px-4 py-3">{result.totalMarks}/{result.maxTotalMarks}<p className="text-xs text-slate-500">{result.marks?.map((mark) => `${mark.subject}: ${mark.marksObtained}/${mark.maxMarks}`).join(", ")}</p></td><td className="px-4 py-3">{result.percentage}%</td><td className="px-4 py-3">{result.grade}</td><td className="px-4 py-3">{result.status}</td></tr>)}{!results.length ? <tr><td className="px-4 py-8 text-center text-slate-500" colSpan="7">No results entered yet.</td></tr> : null}</tbody></table></div></div>
    </div>
  );
}
