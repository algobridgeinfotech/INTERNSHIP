"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { ShieldCheck, Rocket, Lock, Loader2, CheckCircle2, Mail, Phone, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function SetupPasswordPage() {
  const [step, setStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
       toast.error("Passwords do not match");
       return;
    }
    if (newPassword.length < 6) {
       toast.error("Password must be at least 6 characters");
       return;
    }

    setLoading(true);
    try {
      await api.post("/auth/setup-password", { newPassword });
      toast.success("Security key updated!");
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to setup password");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate verification for now
    setTimeout(() => {
        toast.success("Email verified successfully");
        setStep(3);
        setLoading(false);
    }, 1000);
  };

  const handlePhoneVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate verification
    setTimeout(() => {
        if (user) {
            const updatedUser = { ...user, isFirstLogin: false };
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        toast.success("Identity verified! Welcome to Campus OS.");
        router.push("/dashboard");
        setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          
          {/* Progress Indicators */}
          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-1 w-8 rounded-full transition-all duration-500 ${s <= step ? "bg-blue-500" : "bg-white/10"}`} 
              />
            ))}
          </div>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
              {step === 1 && <Lock className="h-8 w-8 text-white" />}
              {step === 2 && <Mail className="h-8 w-8 text-white" />}
              {step === 3 && <Phone className="h-8 w-8 text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 italic tracking-tight uppercase">
                {step === 1 && "Security Protocol"}
                {step === 2 && "Email Verification"}
                {step === 3 && "Mobile Authentication"}
            </h1>
            <p className="text-slate-400 text-sm">
                {step === 1 && "Please establish your secure credentials to proceed."}
                {step === 2 && `We've sent a code to ${user?.email || 'your email'}.`}
                {step === 3 && "Final step: verify your mobile device for 2FA."}
            </p>
          </div>

          {step === 1 && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    required
                    type="password"
                    placeholder="New Security Key"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <input 
                    required
                    type="password"
                    placeholder="Verify Security Key"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>
              <button disabled={loading} type="submit" className="w-full bg-white text-[#0F172A] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center group shadow-xl shadow-white/5">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ArrowRight className="h-4 w-4 mr-2" />}
                {loading ? "Processing..." : "Continue to Verification"}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleEmailVerify} className="space-y-6">
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  required
                  type="text"
                  placeholder="6-Digit Verification Code"
                  value={emailCode}
                  onChange={(e) => setEmailCode(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-center tracking-[0.5em] font-bold"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center group shadow-xl shadow-blue-600/20">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                {loading ? "Verifying..." : "Verify Email"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handlePhoneVerify} className="space-y-6">
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  required
                  type="text"
                  placeholder="SMS OTP Code"
                  value={phoneCode}
                  onChange={(e) => setPhoneCode(e.target.value)}
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-center tracking-[0.5em] font-bold"
                />
              </div>
              <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center group shadow-xl shadow-blue-600/20">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                {loading ? "Finalizing..." : "Complete Onboarding"}
              </button>
            </form>
          )}

          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">Identity</span>
                <span className="text-xs font-bold text-white leading-tight">{user?.name}</span>
             </div>
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter leading-tight">Assigned Role</span>
                <span className="text-xs font-bold text-blue-400 leading-tight uppercase">{user?.role}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
