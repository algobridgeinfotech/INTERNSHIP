"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, LogIn } from "lucide-react";
import api from "../../services/api";
import { saveAuth } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", form);
      saveAuth(data);
      router.push("/dashboard");
    } catch (err) {
      if (err.response?.data?.errors?.length) {
        setError(err.response.data.errors[0].msg);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.request) {
        setError("Backend API is not reachable. Please start the backend server on port 5000.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-lg bg-teal-600 text-white">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-950">Login</h1>
            <p className="text-sm text-slate-500">Sign in as admin or teacher</p>
          </div>
        </div>
        {error ? <div className="mb-4 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div> : null}
        <label className="mb-4 block">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </label>
        <label className="mb-6 block">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input className="focus-ring mt-1 w-full rounded-md border border-slate-300 px-3 py-2" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button disabled={loading} className="focus-ring flex w-full items-center justify-center gap-2 rounded-md bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60">
          <LogIn size={17} />
          {loading ? "Signing in..." : "Login"}
        </button>
        <p className="mt-4 text-center text-sm text-slate-500">
          Need admin access?{" "}
          <Link href="/signup" className="font-semibold text-teal-700 hover:text-teal-800">
            Create admin account
          </Link>
        </p>
      </form>
    </main>
  );
}
