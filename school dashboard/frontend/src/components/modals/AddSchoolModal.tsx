import { useState } from "react";
import { X, Save, Loader2, Building2, MapPin, Globe, CreditCard, User, ShieldCheck } from "lucide-react";
import api from "@/lib/api";

interface AddSchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddSchoolModal({ isOpen, onClose, onSuccess }: AddSchoolModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    contactEmail: "",
    contactPhone: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    subscriptionPlan: "basic"
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/schools", formData);
      if (res.status === 201) {
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add school");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-50 rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shrink-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Register New Institution</h2>
                <p className="text-blue-100 text-sm">Add a new school to the Campus OS platform</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <form id="school-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* School Information */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-2 flex items-center">
                <Building2 className="h-4 w-4 mr-2 text-blue-500" /> Institution Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">School Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. Green Valley International" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Registration Number *</label>
                  <input required name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. REG-123456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email *</label>
                    <input required name="contactEmail" value={formData.contactEmail} onChange={handleChange} type="email" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="contact@school.com" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Phone *</label>
                    <input required name="contactPhone" value={formData.contactPhone} onChange={handleChange} type="tel" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="+1..." />
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-2 flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-red-500" /> Location Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Address *</label>
                  <input required name="address" value={formData.address} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="Street address" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">City *</label>
                    <input required name="city" value={formData.city} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">State *</label>
                    <input required name="state" value={formData.state} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Country *</label>
                    <input required name="country" value={formData.country} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Zip Code *</label>
                    <input required name="zipCode" value={formData.zipCode} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Primary Admin */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-indigo-500" /> Primary Administrator
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Admin Full Name *</label>
                  <input required name="adminName" value={formData.adminName} onChange={handleChange} type="text" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Admin Email *</label>
                  <input required name="adminEmail" value={formData.adminEmail} onChange={handleChange} type="email" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="admin@school.com" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Admin Password *</label>
                  <input required name="adminPassword" value={formData.adminPassword} onChange={handleChange} type="password" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500" placeholder="••••••••" />
                </div>
              </div>
            </div>

            {/* Plan & Subscription */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-2 flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-emerald-500" /> Plan & Subscription
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Subscription Plan *</label>
                  <select name="subscriptionPlan" value={formData.subscriptionPlan} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500 bg-white">
                    <option value="basic">Basic Plan ($199/mo)</option>
                    <option value="premium">Premium Plan ($499/mo)</option>
                    <option value="enterprise">Enterprise Plan (Custom)</option>
                  </select>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Account Activation</p>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">
                        Registration will automatically create the school database and primary admin credentials.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-200 shrink-0">
          <div className="flex space-x-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
              Cancel
            </button>
            <button form="school-form" type="submit" disabled={loading} className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50">
              {loading ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
              {loading ? "Registering..." : "Register School"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
