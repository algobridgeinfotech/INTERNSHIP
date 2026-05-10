"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    GraduationCap, ChevronDown, LogOut, ShieldAlert
} from "lucide-react";
import { useState, useEffect } from "react";
import { roleNavMenus, Role } from "@/lib/roles";

import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout, selectedChildId, setSelectedChildId } = useAuthStore();
    const [children, setChildren] = useState<any[]>([]);
    
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        "Resources": true,
        "Dashboards": false
    });
    
    const [currentRole, setCurrentRole] = useState<Role>("SCHOOL_ADMIN"); // Default role

    useEffect(() => {
        if (user) {
            if (user.role && Object.keys(roleNavMenus).includes(user.role)) {
                setCurrentRole(user.role as Role);
            } else {
                setCurrentRole(mapBackendRole(user.role || ""));
            }

            if (user.role === "PARENT") {
                fetchChildren();
            }
        }
    }, [user]);

    const fetchChildren = async () => {
        try {
            const res = await api.get("/parent/children");
            setChildren(res.data);
            if (res.data.length > 0 && !selectedChildId) {
                setSelectedChildId(res.data[0]._id);
            }
        } catch (error) {
            console.error("Failed to fetch children");
        }
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    const mapBackendRole = (roleStr: string): Role => {
        const normalized = roleStr.toUpperCase();
        if (normalized === "SUPER_ADMIN") return "SUPER_ADMIN";
        if (normalized === "SCHOOL_ADMIN") return "SCHOOL_ADMIN";
        if (normalized === "TEACHER") return "TEACHER";
        if (normalized === "ACCOUNTANT") return "ACCOUNTANT";
        if (normalized === "LIBRARIAN") return "LIBRARIAN";
        if (normalized === "SCHOOL_CONTROLLER") return "SCHOOL_CONTROLLER";
        if (normalized === "STUDENT") return "STUDENT";
        if (normalized === "PARENT") return "PARENT";
        return "SCHOOL_ADMIN"; // Fallback
    };

    const toggleMenu = (name: string) => {
        setOpenMenus(prev => ({ ...prev, [name]: !prev[name] }));
    };

    const navGroups = roleNavMenus[currentRole] || roleNavMenus["Admin"];

    return (
        <aside className="w-72 border-r border-border bg-card/80 backdrop-blur-xl h-screen flex flex-col hidden md:flex sticky top-0 shadow-sm">
            <div className="h-[72px] flex items-center px-6 border-b border-border bg-background/50">
                <div className="flex items-center space-x-3 bg-background border border-border px-3 py-1.5 rounded-lg shadow-sm">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                    <div className="flex flex-col">
                        <span className="font-bold text-sm tracking-tight leading-tight text-foreground">Green Valley</span>
                        <span className="text-[10px] font-semibold text-emerald-600 uppercase tracking-widest">Smart School ERP</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
                {currentRole === "PARENT" && children.length > 0 && (
                    <div className="px-3 mb-6">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Switch Child Profile</label>
                        <select 
                            value={selectedChildId || ""}
                            onChange={(e) => setSelectedChildId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-primary/20"
                        >
                            {children.map(child => (
                                <option key={child._id} value={child._id}>
                                    {child.name} (Grade {child.grade}-{child.section})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {navGroups.map((group, idx) => (
                    <div key={idx} className="space-y-1">
                        {group.title && (
                            <label className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest block mb-2 px-4 mt-6 first:mt-0">
                                {group.title}
                            </label>
                        )}
                        {group.items.map((item: any) => {
                            const isActive = pathname === item.href || (item.subMenu && item.subMenu.some((sub: any) => pathname === sub.href));
                            const isOpen = openMenus[item.name];

                            return (
                                <div key={item.name}>
                                    {item.subMenu ? (
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                                isActive ? "bg-primary/5 text-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <item.icon className={cn("h-4 w-4 mr-3 transition-colors", isActive ? "text-primary" : "text-muted-foreground")} />
                                                {item.name}
                                            </div>
                                            <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
                                        </button>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                                                isActive ? "bg-secondary shadow-sm text-foreground border border-border/50" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border border-transparent"
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <item.icon className={cn("h-4 w-4 mr-3 transition-colors", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                                {item.name}
                                            </div>
                                            {item.badge && (
                                                <span className="text-[10px] uppercase tracking-wider font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    )}

                                    {/* Submenu rendering */}
                                    {item.subMenu && isOpen && (
                                        <div className="ml-9 mt-1 space-y-1 border-l-2 border-border/50 pl-2">
                                            {item.subMenu.map((subItem: any) => {
                                                const isSubActive = pathname === subItem.href;
                                                return (
                                                    <Link
                                                        key={subItem.name}
                                                        href={subItem.href}
                                                        className={cn(
                                                            "block px-3 py-2 rounded-md text-xs font-medium transition-all",
                                                            isSubActive ? "bg-secondary text-foreground font-semibold" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                                        )}
                                                    >
                                                        {subItem.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            <div className="px-4 py-2 bg-secondary/30 border-t border-border">

                <div className="flex items-center px-3 py-3 rounded-xl border border-border bg-card shadow-sm group">
                    <div className="h-9 w-9 rounded-full bg-slate-800 flex items-center justify-center text-white font-bold mr-3 shadow-inner uppercase shrink-0">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-foreground truncate">{user?.name || 'User'}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</p>
                    </div>
                    <button onClick={handleLogout} className="ml-2 p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Log Out">
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
