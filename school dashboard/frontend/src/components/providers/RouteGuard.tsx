"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { isRouteAllowed, Role } from "@/lib/roles";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);
  const { token, user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    const checkAuth = () => {
      // Basic authentication check
      if (!token || !user || !isAuthenticated) {
        setAuthorized(false);
        if (pathname !== "/" && !pathname.startsWith("/login")) {
          router.push("/");
        }
        return;
      }

      // Check account status if available
      if (user.status && user.status !== "active") {
        setAuthorized(false);
        logout();
        router.push("/");
        return;
      }

      // Enforce Password Setup for First Login
      if (user.isFirstLogin && pathname !== "/setup-password") {
        setAuthorized(false);
        router.push("/setup-password");
        return;
      }

      // Prevent accessing setup-password if already done
      if (!user.isFirstLogin && pathname === "/setup-password") {
        router.push("/dashboard");
        return;
      }

      // Role-based route protection
      if (pathname.startsWith("/dashboard") && pathname !== "/dashboard") {
        if (!isRouteAllowed(user.role as Role, pathname)) {
          console.warn(`Access denied to ${pathname} for role ${user.role}`);
          router.push("/dashboard");
          return;
        }
      }

      // If we reach here, user is authenticated and setup is done (if required)
      setAuthorized(true);
    };

    checkAuth();
  }, [pathname, token, user, isAuthenticated, router, logout]);

  if (!authorized) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mb-4" />
          <p className="text-slate-400 text-sm font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
