import {
    Building2, Home, LayoutDashboard, FileText,
    UserPlus, LifeBuoy, Briefcase, UserSquare,
    Package, Cable, Users, CalendarDays, Settings2,
    Contact, ClipboardList, HelpCircle, ShieldAlert,
    GraduationCap, BookOpen, Clock, Bus,
    Bell, FileOutput, ShieldCheck, Database,
    Globe, Wallet, Users2, ScrollText, CheckSquare,
    MessageSquare, Video, PieChart, LineChart
} from "lucide-react";

export type Role = 
    | "SUPER_ADMIN" 
    | "SCHOOL_ADMIN" 
    | "TEACHER" 
    | "ACCOUNTANT" 
    | "LIBRARIAN" 
    | "SCHOOL_CONTROLLER" 
    | "STUDENT" 
    | "PARENT";

export const roleNavMenus: Record<Role, any[]> = {
    "SUPER_ADMIN": [
        {
            title: "PLATFORM CONTROL",
            items: [
                { name: "Global Operations", href: "/dashboard", icon: PieChart },
                { name: "School Management", href: "/dashboard/schools", icon: Building2 },
                { name: "Admin Control", href: "/dashboard/admins", icon: ShieldCheck },
                { name: "Permission Manager", href: "/dashboard/roles", icon: ShieldAlert },
                { name: "Subscription Manager", href: "/dashboard/subscriptions", icon: ScrollText },
                { name: "Security Center", href: "/dashboard/security", icon: Settings2 },
                { name: "CMS Control", href: "/dashboard/cms", icon: Globe },
                { name: "Database Monitoring", href: "/dashboard/database", icon: Database },
                { name: "Audit Logs", href: "/dashboard/audit-logs", icon: ClipboardList },
                { name: "Platform Settings", href: "/dashboard/settings", icon: Settings2 },
            ]
        }
    ],
    "SCHOOL_ADMIN": [
        {
            title: "SCHOOL MANAGEMENT",
            items: [
                { name: "School Overview", href: "/dashboard", icon: LayoutDashboard },
                { name: "Student Management", href: "/dashboard/students", icon: GraduationCap },
                { name: "Staff Management", href: "/dashboard/staff", icon: Users2 },
                { name: "Attendance", href: "/dashboard/attendance", icon: CheckSquare },
                { name: "Examination", href: "/dashboard/exams", icon: FileOutput },
                { name: "Fees", href: "/dashboard/fees", icon: Wallet },
                { name: "Payroll", href: "/dashboard/payroll", icon: FileText },
                { name: "Admissions", href: "/dashboard/admissions", icon: UserPlus },
                { name: "Timetable", href: "/dashboard/timetable", icon: Clock },
                { name: "Transport", href: "/dashboard/transport", icon: Bus },
                { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
                { name: "Website CMS", href: "/dashboard/cms", icon: Globe },
                { name: "Reports & Analytics", href: "/dashboard/reports", icon: LineChart },
            ]
        }
    ],
    "TEACHER": [
        {
            title: "Academic Portal",
            items: [
                { name: "My Academic Hub", href: "/dashboard", icon: LayoutDashboard },
                { name: "Attendance", href: "/dashboard/attendance", icon: CheckSquare },
                { name: "Homework", href: "/dashboard/homework", icon: BookOpen },
                { name: "Assignments", href: "/dashboard/assignments", icon: FileText },
                { name: "Exams", href: "/dashboard/exams", icon: FileOutput },
                { name: "Student Reports", href: "/dashboard/student-reports", icon: LineChart },
                { name: "Online Classes", href: "/dashboard/online-classes", icon: Video },
            ]
        }
    ],
    "ACCOUNTANT": [
        {
            title: "Finance & Accounts",
            items: [
                { name: "Financial Console", href: "/dashboard", icon: LayoutDashboard },
                { name: "Fee Management", href: "/dashboard/fees", icon: Wallet },
                { name: "Payroll", href: "/dashboard/payroll", icon: FileText },
                { name: "Expense Management", href: "/dashboard/expenses", icon: LineChart },
                { name: "Financial Reports", href: "/dashboard/reports", icon: PieChart },
            ]
        }
    ],
    "LIBRARIAN": [
        {
            title: "Library Control",
            items: [
                { name: "Library Dashboard", href: "/dashboard", icon: LayoutDashboard },
                { name: "Library Management", href: "/dashboard/library", icon: BookOpen },
                { name: "Book Inventory", href: "/dashboard/library/inventory", icon: BookOpen },
                { name: "Issue & Return", href: "/dashboard/library/transactions", icon: FileText },
                { name: "Fine Management", href: "/dashboard/library/fines", icon: Wallet },
            ]
        }
    ],
    "SCHOOL_CONTROLLER": [
        {
            title: "Academic Operations",
            items: [
                { name: "Operational Hub", href: "/dashboard", icon: LayoutDashboard },
                { name: "Timetable", href: "/dashboard/timetable", icon: Clock },
                { name: "Class Scheduling", href: "/dashboard/timetable/schedule", icon: ClipboardList },
                { name: "Teacher Allocation", href: "/dashboard/staff/allocation", icon: Users2 },
                { name: "Academic Calendar", href: "/dashboard/calendar", icon: CalendarDays },
            ]
        }
    ],
    "STUDENT": [
        {
            title: "Learning Dashboard",
            items: [
                { name: "Student Console", href: "/dashboard", icon: LayoutDashboard },
                { name: "Timetable", href: "/dashboard/timetable", icon: Clock },
                { name: "Homework", href: "/dashboard/homework", icon: BookOpen },
                { name: "Results", href: "/dashboard/results", icon: FileOutput },
                { name: "Attendance", href: "/dashboard/attendance", icon: CheckSquare },
                { name: "Learning Materials", href: "/dashboard/materials", icon: FileText },
                { name: "Notices", href: "/dashboard/notifications", icon: Bell },
            ]
        }
    ],
    "PARENT": [
        {
            title: "Parental Portal",
            items: [
                { name: "Family Dashboard", href: "/dashboard", icon: Users2 },
                { name: "Attendance Reports", href: "/dashboard/attendance", icon: CheckSquare },
                { name: "Fee Payments", href: "/dashboard/fees", icon: Wallet },
                { name: "Notices", href: "/dashboard/notifications", icon: Bell },
                { name: "Teacher Communication", href: "/dashboard/chat", icon: MessageSquare },
                { name: "Transport Tracking", href: "/dashboard/transport", icon: Bus },
                { name: "Exam Results", href: "/dashboard/results", icon: FileOutput },
            ]
        }
    ]
};

export const isRouteAllowed = (role: Role, pathname: string): boolean => {
    if (role === "SUPER_ADMIN") return true; // Super admin can access everything
    
    // Basic routes everyone can access
    if (pathname === "/dashboard" || pathname === "/dashboard/profile" || pathname === "/dashboard/notifications" || pathname === "/dashboard/settings") {
        return true;
    }

    const menus = roleNavMenus[role];
    if (!menus) return false;

    return menus.some(group => 
        group.items.some((item: any) => {
            if (pathname === item.href) return true;
            if (item.subMenu) {
                return item.subMenu.some((sub: any) => pathname === sub.href);
            }
            return false;
        })
    );
};
