import { useState } from "react";
import { X, Save, Loader2, User, Briefcase, Building2, MapPin, Rocket, AlertCircle } from "lucide-react";

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddStaffModal({ isOpen, onClose, onSuccess }: AddStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", jobTitle: "", department: "",
    businessUnit: "", subDepartment: "", location: "Headquarters",
    costCenter: "", reportingManager: "", managerEmail: "", managerDepartment: "",
    emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelation: "",
    password: "", systemRole: "teacher"
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5001/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to add staff");
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
                <h2 className="text-xl font-bold">Add New Staff Member</h2>
                <p className="text-blue-100 text-sm">Create a new staff record in the system</p>
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
          <form id="staff-form" onSubmit={handleSubmit} className="space-y-8">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <User className="h-4 w-4 mr-2 text-blue-500" /> Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="Enter full name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input required name="email" value={formData.email} onChange={handleChange} type="email" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="email@school.edu" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone Number</label>
                    <input name="phone" value={formData.phone} onChange={handleChange} type="tel" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="+1 234 567 890" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <Briefcase className="h-4 w-4 mr-2 text-indigo-500" /> Job Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Job Title *</label>
                    <input required name="jobTitle" value={formData.jobTitle} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. Senior Teacher" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">System Role *</label>
                    <select required name="systemRole" value={formData.systemRole} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white">
                      <option value="Teacher">Teacher</option>
                      <option value="Accountant">Accountant</option>
                      <option value="Librarian">Librarian</option>
                      <option value="School Controller">School Controller</option>
                      <option value="Receptionist">Receptionist</option>
                      <option value="HR Staff">HR Staff</option>
                      <option value="Transport Staff">Transport Staff</option>
                      <option value="Admin">Administrator</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Department</label>
                  <input name="department" value={formData.department} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. Sciences" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Business Unit</label>
                  <input name="businessUnit" value={formData.businessUnit} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. Academics" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                  <input name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. HQ" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-teal-500" /> Reporting Structure
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Reporting Manager</label>
                  <input name="reportingManager" value={formData.reportingManager} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="Manager Name" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Manager Email</label>
                  <input name="managerEmail" value={formData.managerEmail} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="manager@school.edu" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <AlertCircle className="h-4 w-4 mr-2 text-rose-500" /> Emergency Contact Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Contact Name *</label>
                  <input required name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="Emergency contact name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone *</label>
                    <input required name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} type="tel" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="Contact phone" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Relation *</label>
                    <input required name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. Spouse, Parent" />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5 flex items-center">
                <Save className="h-4 w-4 mr-2 text-indigo-500" /> Portal Access & Security
              </h3>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Staff Portal Password *</label>
                <input required name="password" value={formData.password} onChange={handleChange} type="password" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none" placeholder="Set staff login password" />
                <p className="text-[10px] text-slate-400 mt-1">The email address above will be used as the login ID.</p>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <button form="staff-form" type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
            {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Rocket className="h-5 w-5 mr-2" />}
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}
