"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";
      console.log("Attempting login to:", `${apiUrl}/auth/login`);

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response received:", res.status, data);

      if (res.ok) {
        // Update both localStorage (for persistence if needed) and global store
        const { setAuth } = useAuthStore.getState();
        setAuth(data, data.token);
        console.log("Auth state updated, redirecting to /dashboard...");
        
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Network error. Please check if the backend is running on port 5001.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center space-x-3 mb-12">
            <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="h-6 w-6 text-emerald-600" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-tight text-slate-800">Green Valley</span>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">Smart School ERP</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-500 mb-8 font-medium">Please sign in to access your portal.</p>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-semibold border border-red-100">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="superadmin@gmail.com"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-700"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium text-slate-700"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center py-3.5 px-4 bg-gradient-to-r from-[#B8860B] to-[#DAA520] hover:from-[#DAA520] hover:to-[#B8860B] text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-yellow-600/20 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm font-medium text-slate-500 mt-8">
            Don&apos;t have an account? <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Contact Administrator</a>
          </p>
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex w-1/2 bg-[#0B132B] relative overflow-hidden items-center justify-center p-12">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
            School Management <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">Re-imagined</span>
          </h2>
          <p className="text-lg text-blue-100/80 leading-relaxed font-medium">
            Empower your institution with an AI-native operating system designed to optimize administration, recruitment, and academic excellence.
          </p>
          
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5">
              <h3 className="text-yellow-400 font-bold text-2xl mb-1">98%</h3>
              <p className="text-blue-100/70 text-sm font-medium">Administrative Efficiency</p>
            </div>
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5">
              <h3 className="text-yellow-400 font-bold text-2xl mb-1">2.4x</h3>
              <p className="text-blue-100/70 text-sm font-medium">Faster Enrollments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
