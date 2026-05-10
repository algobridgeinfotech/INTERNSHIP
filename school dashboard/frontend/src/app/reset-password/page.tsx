"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ShieldAlert, Loader2, Rocket, CheckCircle2 } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
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
            await api.post(`/auth/reset-password/${token}`, { newPassword });
            setSuccess(true);
            toast.success("Security credentials restored successfully.");
            setTimeout(() => router.push("/"), 3000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to reset security key");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 text-center max-w-md">
                    <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-white mb-2">Invalid Request</h1>
                    <p className="text-slate-400 text-sm mb-6">The password reset link is invalid or has expired.</p>
                    <Link href="/" className="inline-block bg-white text-[#0F172A] px-6 py-2 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-all">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="h-16 w-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
                            <Lock className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 italic tracking-tight uppercase">Reset Credentials</h1>
                        <p className="text-slate-400 text-sm">Define a new high-entropy security key for your account.</p>
                    </div>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
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
                                        placeholder="Confirm Security Key"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={loading}
                                type="submit" 
                                className="w-full bg-white text-[#0F172A] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center group shadow-xl shadow-white/5"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                                {loading ? "Updating..." : "Restore Access"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-6">
                            <div className="h-16 w-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                            </div>
                            <h2 className="text-white font-bold mb-2 uppercase italic">Success</h2>
                            <p className="text-slate-400 text-sm">Your password has been reset. Redirecting to login...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
