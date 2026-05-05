"use client";

import { useEffect, useState } from "react";
import { CalendarCheck, Presentation, Save } from "lucide-react";
import api from "../../../services/api";
import { getStoredUser } from "../../../lib/auth";

const sameDay = (value, date) => {
  if (!value) return false;
  return new Date(value).toISOString().slice(0, 10) === date;
};

export default function AttendancePage() {
  const user = getStoredUser();
  const isTeacher = user?.role === "teacher";
  const isAdmin = user?.role === "admin";
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [statuses, setStatuses] = useState({});
  const [teacherStatuses, setTeacherStatuses] = useState({});
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const cleanParams = (params) => {
    Object.keys(params).forEach((key) => params[key] === "" && delete params[key]);
    return params;
  };

  const loadStudentAttendance = async () => {
    setError("");
    try {
      const params = cleanParams({ limit: 100, class: className, section });
      const attendanceParams = cleanParams({ date, class: className, section });
      const [{ data: studentData }, { data: attendanceData }] = await Promise.all([
        api.get("/students", { params }),
        api.get("/attendance", { params: attendanceParams })
      ]);

      setStudents(studentData.data);
      setRecords(attendanceData);
      setStatuses(
        Object.fromEntries(
          studentData.data.map((student) => {
            const marked = attendanceData.find((record) => record.student?._id === student._id);
            return [student._id, marked?.status || "Present"];
          })
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load student attendance.");
    }
  };

  const loadTeacherAttendance = async () => {
    if (!isAdmin) return;
    try {
      const { data } = await api.get("/teachers");
      setTeachers(data);
      setTeacherStatuses(
        Object.fromEntries(
          data.map((teacher) => {
            const marked = teacher.attendance?.find((item) => sameDay(item.date, date));
            return [teacher._id, marked?.status || "Present"];
          })
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load teacher attendance.");
    }
  };

  useEffect(() => {
    loadStudentAttendance();
  }, [className, section, date]);

  useEffect(() => {
    loadTeacherAttendance();
  }, [date, isAdmin]);

  const submit = async () => {
    const saveRecords = Object.entries(statuses).map(([studentId, status]) => ({ studentId, status }));
    setError("");
    setMessage("");
    try {
      await api.post("/attendance/bulk", { date, records: saveRecords });
      setMessage("Student attendance saved successfully.");
      loadStudentAttendance();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save attendance.");
    }
  };

  const markTeacherAttendance = async (teacherId) => {
    setError("");
    setMessage("");
    try {
      await api.post(`/teachers/${teacherId}/attendance`, {
        date,
        status: teacherStatuses[teacherId] || "Present"
      });
      setMessage("Teacher attendance saved successfully.");
      loadTeacherAttendance();
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save teacher attendance.");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">Attendance</h2>
        <p className="text-sm text-slate-500">
          {isTeacher ? "Mark daily attendance for your assigned class." : "View and manage student and teacher attendance."}
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <input className="focus-ring rounded-md border border-slate-300 px-3 py-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={className} onChange={(e) => setClassName(e.target.value)}>
            <option value="">All Classes</option>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={section} onChange={(e) => setSection(e.target.value)}>
            <option value="">All Sections</option>
            {["A", "B", "C", "D"].map((item) => <option key={item}>{item}</option>)}
          </select>
          {isTeacher ? (
            <button onClick={submit} className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700">
              <Save size={17} />Save Attendance
            </button>
          ) : (
            <div className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-600">Admin attendance view</div>
          )}
        </div>
        {message ? <p className="mt-3 text-sm font-medium text-teal-700">{message}</p> : null}
        {error ? <p className="mt-3 text-sm font-medium text-rose-700">{error}</p> : null}
      </div>

      {isTeacher ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 font-semibold text-slate-950"><CalendarCheck size={18} />Daily Register</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Roll</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Current %</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {students.map((student) => (
                  <tr key={student._id}>
                    <td className="px-4 py-3 font-medium text-slate-950">{student.name}</td>
                    <td className="px-4 py-3">{student.rollNumber}</td>
                    <td className="px-4 py-3">{student.className} - {student.section}</td>
                    <td className="px-4 py-3">
                      <select className="focus-ring rounded-md border border-slate-300 px-3 py-2" value={statuses[student._id] || "Present"} onChange={(e) => setStatuses({ ...statuses, [student._id]: e.target.value })}>
                        <option>Present</option><option>Absent</option><option>Late</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">{student.attendancePercentage}%</td>
                  </tr>
                ))}
                {!students.length ? <tr><td className="px-4 py-8 text-center text-slate-500" colSpan="5">No students found for this class.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="flex items-center gap-2 font-semibold text-slate-950"><CalendarCheck size={18} />Student Attendance</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
              <tr><th className="px-4 py-3">Student</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Marked By</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((record) => (
                <tr key={record._id}>
                  <td className="px-4 py-3">{record.student?.name}</td>
                  <td className="px-4 py-3">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{record.status}</td>
                  <td className="px-4 py-3">{record.markedBy?.name || "-"}</td>
                </tr>
              ))}
              {!records.length ? <tr><td className="px-4 py-8 text-center text-slate-500" colSpan="4">No student attendance records found.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </div>

      {isAdmin ? (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-3">
            <div className="flex items-center gap-2 font-semibold text-slate-950"><Presentation size={18} />Teacher Attendance</div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr><th className="px-4 py-3">Teacher</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Class</th><th className="px-4 py-3">Saved Status</th><th className="px-4 py-3">Mark</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teachers.map((teacher) => {
                  const marked = teacher.attendance?.find((item) => sameDay(item.date, date));
                  return (
                    <tr key={teacher._id}>
                      <td className="px-4 py-3 font-medium text-slate-950">{teacher.name}<p className="text-xs text-slate-500">{teacher.email || teacher.user?.email}</p></td>
                      <td className="px-4 py-3">{teacher.subject}</td>
                      <td className="px-4 py-3">{teacher.assignedClass}</td>
                      <td className="px-4 py-3">{marked?.status || "Not marked"}</td>
                      <td className="px-4 py-3">
                        <div className="flex min-w-56 gap-2">
                          <select className="focus-ring rounded-md border border-slate-300 px-2 py-1" value={teacherStatuses[teacher._id] || "Present"} onChange={(e) => setTeacherStatuses({ ...teacherStatuses, [teacher._id]: e.target.value })}>
                            <option>Present</option><option>Absent</option><option>Late</option>
                          </select>
                          <button type="button" onClick={() => markTeacherAttendance(teacher._id)} className="rounded-md border border-slate-300 px-3 py-1 hover:bg-slate-100">Save</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {!teachers.length ? <tr><td className="px-4 py-8 text-center text-slate-500" colSpan="5">No teachers added yet.</td></tr> : null}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  );
}
