"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, Send } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/auth/forgot-password", { email });
            setSubmitted(true);
            toast.success("Reset link dispatched to your inbox.");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to initiate recovery");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                            <Mail className="h-8 w-8 text-blue-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2 italic tracking-tight uppercase">Credential Recovery</h1>
                        <p className="text-slate-400 text-sm">Enter your registered email to receive a secure access restoration link.</p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <input 
                                    required
                                    type="email"
                                    placeholder="Registered Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                                />
                            </div>

                            <button 
                                disabled={loading}
                                type="submit" 
                                className="w-full bg-white text-[#0F172A] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center group shadow-xl shadow-white/5"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                {loading ? "Dispatching..." : "Send Reset Link"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-6">
                                <p className="text-blue-200 text-sm font-medium leading-relaxed">
                                    If an account exists for {email}, a recovery link has been sent. Please check your inbox and spam folders.
                                </p>
                            </div>
                            <button 
                                onClick={() => setSubmitted(false)}
                                className="text-xs font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-colors"
                            >
                                Try another email
                            </button>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <Link 
                            href="/" 
                            className="flex items-center justify-center text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest transition-all group"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Return to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
