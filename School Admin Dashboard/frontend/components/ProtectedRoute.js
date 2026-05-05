"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { hasToken } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!hasToken()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  if (!ready) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading dashboard...</div>;
  }

  return children;
}
