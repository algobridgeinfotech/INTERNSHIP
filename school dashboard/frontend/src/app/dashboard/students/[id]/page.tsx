"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, MapPin, Phone, Mail, GraduationCap, 
  BookOpen, CreditCard, FileText, AlertCircle, Clock, CheckCircle2,
  UserCircle, Heart
} from "lucide-react";
import api from "@/lib/api";

export default function StudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Overview");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${id}`);
        setStudent(res.data);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return <div className="p-10 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;
  }

  if (!student) return <div className="p-10">Student not found</div>;

  const tabs = ["Overview", "Academics", "Fees", "Documents", "Tickets", "Interactions"];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <Link href="/dashboard/students" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Directory
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
          <div className="absolute -bottom-12 left-8 flex items-end space-x-6">
            <div className="h-24 w-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-700 shadow-md">
              {student.name.charAt(0)}
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-slate-800">{student.name}</h1>
              <p className="text-sm font-mono text-slate-500">{student.studentId} • {student.grade || 'Grade Not Assigned'}</p>
            </div>
          </div>
          <div className="absolute top-6 right-8 flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md border border-white/30`}>
              {student.enrollmentStatus}
            </span>
          </div>
        </div>

        {/* Action Bar & Tabs */}
        <div className="pt-16 px-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex space-x-6 overflow-x-auto w-full sm:w-auto pb-4 sm:pb-0">
            {tabs.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex space-x-3 pb-4 sm:pb-0">
            <button className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-100">Edit Profile</button>
            <button className="px-4 py-2 bg-blue-600 border border-blue-600 rounded-lg text-sm font-semibold text-white hover:bg-blue-700">Actions</button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><UserCircle className="h-5 w-5 mr-2 text-blue-500" /> Basic Information</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Email Address</p>
                      <p className="font-medium text-slate-800 flex items-center"><Mail className="h-3 w-3 mr-1.5 text-slate-400" /> {student.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Phone Number</p>
                      <p className="font-medium text-slate-800 flex items-center"><Phone className="h-3 w-3 mr-1.5 text-slate-400" /> {student.countryCode} {student.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Class / Grade</p>
                      <p className="font-medium text-slate-800">{student.grade || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><Heart className="h-5 w-5 mr-2 text-rose-500" /> Parent / Guardian Information</h3>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Parent Name</p>
                      <p className="font-medium text-slate-800">{student.parentName || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Parent Phone</p>
                      <p className="font-medium text-slate-800 flex items-center"><Phone className="h-3 w-3 mr-1.5 text-slate-400" /> {student.parentPhone || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500 mb-1">Parent Email</p>
                      <p className="font-medium text-slate-800 flex items-center"><Mail className="h-3 w-3 mr-1.5 text-slate-400" /> {student.parentEmail || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><MapPin className="h-5 w-5 mr-2 text-blue-500" /> Logistics & Amenities</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${student.hostelAccess ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Hostel Access</p>
                        <p className="text-sm text-slate-500 mt-0.5">{student.hostelAccess ? student.hostelDetails || 'Assigned' : 'Day Scholar'}</p>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${student.transportAccess ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Transport</p>
                        <p className="text-sm text-slate-500 mt-0.5">{student.transportAccess ? student.routeDetails || 'Route Assigned' : 'Self Commute'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar widgets */}
              <div className="space-y-6">
                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4">Fee Summary</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-500">Current Status</span>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      student.feeStatus === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {student.feeStatus}
                    </span>
                  </div>
                  <button className="w-full mt-4 py-2 bg-slate-50 text-sm font-semibold text-blue-600 rounded-lg hover:bg-slate-100 border border-slate-200">View Transactions</button>
                </div>

                <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-slate-800 mb-4">Support & Tickets</h4>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800 leading-none">{student.openTickets}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">Open Tickets</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== "Overview" && (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl text-slate-400">
              <BookOpen className="h-12 w-12 mb-4 text-slate-300" />
              <p className="font-medium text-lg">{activeTab} details will be populated here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
