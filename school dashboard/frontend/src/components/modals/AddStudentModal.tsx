import { useState } from "react";
import { X, Save, Loader2, User, BookOpen, MapPin, AlertCircle, Rocket } from "lucide-react";

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", countryCode: "+1",
    grade: "Grade 1", parentName: "", parentPhone: "", parentEmail: "",
    studentPassword: "", parentPassword: "",
    country: "", feeStatus: "Pending", enrollmentStatus: "Pending",
    hostelAccess: false, transportAccess: false, hostelDetails: "", routeDetails: "", counsellorId: "",
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to add student");
      }
    } catch (error) {
      console.error(error);
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[90vh] bg-slate-50 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Add New Student</h2>
                <p className="text-blue-100 text-sm">Create a new student record in the system</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex space-x-4 mt-4 text-xs font-medium text-blue-100">
            <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5"></span> Real-time validation</span>
            <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 mr-1.5"></span> Duplicate checking</span>
            <span className="flex items-center"><span className="h-1.5 w-1.5 rounded-full bg-blue-400 mr-1.5"></span> Secure submission</span>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
          <form id="student-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-500" /> Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Enter student's full name" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                  <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Enter student's email address" />
                </div>
                <div className="flex space-x-2">
                  <div className="w-24">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Code</label>
                    <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white">
                      <option value="+1">+1</option><option value="+44">+44</option><option value="+91">+91</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Enter phone number" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-500" /> Parent Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Parent/Guardian Name *</label>
                  <input required name="parentName" value={formData.parentName} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Enter parent's full name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Parent Phone *</label>
                    <input required name="parentPhone" value={formData.parentPhone} onChange={handleChange} type="tel" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Parent phone" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Parent Email</label>
                    <input name="parentEmail" value={formData.parentEmail} onChange={handleChange} type="email" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Parent email" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <BookOpen className="h-4 w-4 mr-2 text-indigo-500" /> Academic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Class / Grade *</label>
                  <select name="grade" value={formData.grade} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white">
                    {[...Array(12)].map((_, i) => (
                      <option key={i+1} value={`Grade ${i+1}`}>Grade {i+1}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Country</label>
                  <input name="country" value={formData.country} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. USA" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-emerald-500" /> Logistics & Administrative
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Fee Status</label>
                    <select name="feeStatus" value={formData.feeStatus} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white">
                      <option value="Pending">Pending</option><option value="Paid">Paid</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Enrollment Status</label>
                    <select name="enrollmentStatus" value={formData.enrollmentStatus} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white">
                      <option value="Pending">Pending</option><option value="Active">Active</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <input type="checkbox" name="hostelAccess" checked={formData.hostelAccess} onChange={handleChange} className="rounded" />
                  <span className="text-sm text-slate-700 font-medium">Requires Hostel Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" name="transportAccess" checked={formData.transportAccess} onChange={handleChange} className="rounded" />
                  <span className="text-sm text-slate-700 font-medium">Requires Transport Access</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <Save className="h-4 w-4 mr-2 text-blue-500" /> Portal Access & Security
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Student Portal Password *</label>
                  <input required name="studentPassword" value={formData.studentPassword} onChange={handleChange} type="password" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Set student password" />
                  <p className="text-[10px] text-slate-400 mt-1">Username will be the student's email.</p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Parent Portal Password *</label>
                  <input required name="parentPassword" value={formData.parentPassword} onChange={handleChange} type="password" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Set parent password" />
                  <p className="text-[10px] text-slate-400 mt-1">Username will be the parent's email.</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <button form="student-form" type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
            {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Rocket className="h-5 w-5 mr-2" />}
            {loading ? "Creating..." : "Create Student"}
          </button>
        </div>
      </div>
    </div>
  );
}
