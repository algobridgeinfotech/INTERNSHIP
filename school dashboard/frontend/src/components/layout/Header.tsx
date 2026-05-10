"use client";

import { Search, Menu, Moon, Sun, ChevronDown, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Invalid user data in local storage");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <header className="h-20 bg-[#F8FAFC] flex items-center justify-between px-6 z-10">
      <div className="flex items-center w-full max-w-3xl">
        <button className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors mr-4 shrink-0">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search pages..."
            className="w-full h-12 bg-white rounded-2xl shadow-sm border border-slate-100 pl-11 pr-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="h-10 w-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors"
        >
          <Sun className="h-5 w-5 hidden dark:block" />
          <Moon className="h-5 w-5 block dark:hidden" />
        </button>
        
        <div className="relative">
          <div 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center px-3 cursor-pointer hover:bg-slate-50 transition-colors select-none"
          >
            <div className="h-6 w-6 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden shrink-0 text-white text-xs font-bold uppercase">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="ml-2 flex flex-col justify-center">
              <span className="text-[13px] font-bold text-slate-800 leading-none">{user?.name || 'User'}</span>
              <div className="flex items-center mt-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1"></span>
                <span className="text-[10px] font-semibold text-slate-500 leading-none capitalize">{user?.role || 'Online'}</span>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 ml-3 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden py-1 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-500 truncate">{user?.email || 'No email'}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center transition-colors font-medium"
              >
                <LogOut className="h-4 w-4 mr-2" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
