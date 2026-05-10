"use client";

import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  Building2, 
  BookOpen, 
  UserSquare, 
  Users, 
  Briefcase,
  CheckCircle2,
  XCircle,
  Lock,
  Database,
  ShieldCheck,
  Zap,
  Globe,
  Settings,
  Key
} from "lucide-react";

// The role definitions
const roleData = {
  superAdmin: {
    title: "Super Admin",
    accessLevel: "Full System Access",
    description: "Controls the complete ERP ecosystem including schools, admins, permissions, subscriptions, security, and global system configuration.",
    icon: ShieldAlert,
    theme: "yellow",
    modules: ["System Core", "Multi-School", "Billing", "Security"],
    access: [
      "Manage all schools & domains",
      "Create/Delete Admin accounts",
      "Global role permission control",
      "System security & backups"
    ],
    restrictions: [],
    cta: "Control Entire Platform"
  },
  admin: {
    title: "Admin",
    accessLevel: "School Operations",
    description: "Manages daily school operations including students, teachers, admissions, attendance, examinations, finance, and communication.",
    icon: Building2,
    theme: "blue",
    modules: ["Admissions", "HR", "Finance", "Academics"],
    access: [
      "Student & Teacher management",
      "Fees, payroll & admissions",
      "Timetable & attendance reports"
    ],
    restrictions: [
      "Cannot modify Super Admin settings",
      "Limited to assigned school database"
    ],
    cta: "Manage School Operations"
  },
  teacher: {
    title: "Teacher",
    accessLevel: "Academic Access",
    description: "Teachers manage classroom activities, attendance, assignments, exams, and student performance tracking.",
    icon: BookOpen,
    theme: "emerald",
    modules: ["Classroom", "Exams", "Assignments"],
    access: [
      "Take attendance & conduct exams",
      "Upload assignments & enter marks",
      "Parent communication & grading"
    ],
    restrictions: [
      "No access to finance modules",
      "Cannot configure system settings"
    ],
    cta: "Access Teaching Tools"
  },
  student: {
    title: "Student",
    accessLevel: "Read-Only Access",
    description: "Students can access academic resources, schedules, attendance, assignments, and exam performance.",
    icon: UserSquare,
    theme: "purple",
    modules: ["My Classes", "Results", "Homework"],
    access: [
      "View timetable & report cards",
      "Download assignments & materials",
      "Join online classes & events"
    ],
    restrictions: [
      "Read-only academic access",
      "No administrative or peer controls"
    ],
    cta: "Explore Student Dashboard"
  },
  parent: {
    title: "Parent",
    accessLevel: "Restricted Access",
    description: "Parents can monitor their child’s attendance, fees, academic progress, transport, and school communication.",
    icon: Users,
    theme: "orange",
    modules: ["Child Stats", "Fee Portal", "Transport"],
    access: [
      "Monitor child performance & attendance",
      "Process fee payments & view transport",
      "Submit leave applications & view notices"
    ],
    restrictions: [
      "Access only strictly linked child data",
      "Cannot view other students' records"
    ],
    cta: "Monitor Child Progress"
  },
  staff: {
    title: "Staff / Accountant",
    accessLevel: "Financial Access",
    description: "Handles operational and financial workflows including payroll, inventory, transport, accounts, and office management.",
    icon: Briefcase,
    theme: "teal",
    modules: ["Payroll", "Inventory", "Accounts"],
    access: [
      "Fee collection & invoice generation",
      "Expense tracking & asset inventory",
      "Library & transport management"
    ],
    restrictions: [
      "No academic grading control",
      "Cannot manage user role permissions"
    ],
    cta: "Manage Operations"
  }
};

const getThemeColors = (theme: string) => {
  switch (theme) {
    case 'yellow': return { bg: 'bg-yellow-500/10', bgSolid: 'bg-yellow-400', border: 'border-yellow-500/20', text: 'text-yellow-400', glow: 'hover:shadow-[0_0_30px_-5px_rgba(250,204,21,0.2)]', gradient: 'from-yellow-900/20 to-transparent' };
    case 'blue': return { bg: 'bg-blue-500/10', bgSolid: 'bg-blue-400', border: 'border-blue-500/20', text: 'text-blue-400', glow: 'hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]', gradient: 'from-blue-900/20 to-transparent' };
    case 'emerald': return { bg: 'bg-emerald-500/10', bgSolid: 'bg-emerald-400', border: 'border-emerald-500/20', text: 'text-emerald-400', glow: 'hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)]', gradient: 'from-emerald-900/20 to-transparent' };
    case 'purple': return { bg: 'bg-purple-500/10', bgSolid: 'bg-purple-400', border: 'border-purple-500/20', text: 'text-purple-400', glow: 'hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.2)]', gradient: 'from-purple-900/20 to-transparent' };
    case 'orange': return { bg: 'bg-orange-500/10', bgSolid: 'bg-orange-400', border: 'border-orange-500/20', text: 'text-orange-400', glow: 'hover:shadow-[0_0_30px_-5px_rgba(249,115,22,0.2)]', gradient: 'from-orange-900/20 to-transparent' };
    case 'teal': return { bg: 'bg-teal-500/10', bgSolid: 'bg-teal-400', border: 'border-teal-500/20', text: 'text-teal-400', glow: 'hover:shadow-[0_0_30px_-5px_rgba(20,184,166,0.2)]', gradient: 'from-teal-900/20 to-transparent' };
    default: return { bg: 'bg-slate-500/10', bgSolid: 'bg-slate-400', border: 'border-slate-500/20', text: 'text-slate-400', glow: 'hover:shadow-[0_0_30px_-5px_rgba(148,163,184,0.2)]', gradient: 'from-slate-900/20 to-transparent' };
  }
};

const RoleNode = ({ role }: { role: any }) => {
  const colors = getThemeColors(role.theme);
  const Icon = role.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, scale: 1.01 }}
      className={`relative group rounded-2xl border ${colors.border} bg-slate-900/80 p-6 ${colors.glow} backdrop-blur-xl overflow-hidden transition-all duration-300 w-full h-full flex flex-col`}
    >
      <div className={`absolute inset-0 bg-gradient-to-b ${colors.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
      
      {/* Top row: Access Level */}
      <div className="flex justify-between items-center mb-5 relative z-10">
        <div className={`flex items-center px-3 py-1.5 rounded-md bg-slate-950/80 border ${colors.border} shadow-inner`}>
          <div className={`w-2 h-2 rounded-full mr-2.5 ${colors.bgSolid} shadow-[0_0_8px] shadow-${role.theme}-500/50`} />
          <span className={`text-[10px] uppercase font-bold tracking-wider ${colors.text}`}>{role.accessLevel}</span>
        </div>
        <Lock className={`w-4 h-4 ${colors.text} opacity-40 group-hover:opacity-100 transition-opacity`} />
      </div>

      <div className="flex items-start mb-5 relative z-10">
        <div className={`p-3.5 rounded-xl bg-slate-950/80 border ${colors.border} mr-4 shrink-0 shadow-lg`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1.5 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">{role.title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
            {role.description}
          </p>
        </div>
      </div>

      {/* Modules */}
      <div className="flex flex-wrap gap-2 mb-6 relative z-10">
        {role.modules.map((mod: string, i: number) => (
          <span key={i} className="text-[10px] px-2.5 py-1 rounded-md bg-slate-950 border border-slate-800 text-slate-300 flex items-center font-medium">
            <Database className="w-3 h-3 mr-1.5 opacity-50" />
            {mod}
          </span>
        ))}
      </div>

      {/* Permissions */}
      <div className="space-y-4 relative z-10 bg-slate-950/60 p-5 rounded-xl border border-slate-800/50 flex-grow">
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-500" /> Granted Permissions
          </p>
          <ul className="space-y-2">
            {role.access.map((item: string, i: number) => (
              <li key={i} className="text-xs text-slate-300 flex items-start leading-snug">
                <span className={`mr-2 mt-0.5 ${colors.text}`}>▸</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {role.restrictions.length > 0 && (
          <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
              <XCircle className="w-3.5 h-3.5 mr-2 text-rose-500" /> Restrictions
            </p>
            <ul className="space-y-2">
              {role.restrictions.map((item: string, i: number) => (
                <li key={i} className="text-xs text-slate-400 flex items-start leading-snug">
                  <span className="text-rose-500/50 mr-2 mt-0.5 font-bold">×</span> {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default function RBACSection() {
  return (
    <section className="relative py-28 bg-[#020617] overflow-hidden min-h-screen font-sans">
      {/* Blueprint / ERP Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50"></div>
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-blue-900/20 blur-[120px]"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold uppercase tracking-widest mb-6 shadow-xl"
          >
            <ShieldCheck className="w-4 h-4 mr-2 text-blue-400" />
            Role-Based ERP Architecture
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight leading-tight"
          >
            Smart Access Control for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-400">Every User Level</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
          >
            Our ERP system provides secure role-based access, allowing every user to access only the tools, data, and modules relevant to their responsibilities.
          </motion.p>
        </div>

        {/* Enterprise Architecture Hierarchy Layout */}
        <div className="relative flex flex-col items-center">
          
          {/* Level 1: Super Admin */}
          <div className="w-full max-w-2xl mx-auto z-20">
            <RoleNode role={roleData.superAdmin} />
          </div>

          {/* Connection Line 1 */}
          <div className="hidden lg:flex flex-col items-center relative z-10 my-4 h-24">
            <div className="w-px h-full bg-gradient-to-b from-yellow-500/50 to-blue-500/50 relative">
              <motion.div
                animate={{ y: [0, 96] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]"
              />
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center shadow-xl">
               <Settings className="w-3.5 h-3.5 mr-2 text-yellow-400" />
               Controls & Provisions
            </div>
          </div>
          <div className="lg:hidden w-px h-12 bg-slate-800" />

          {/* Level 2: Admin */}
          <div className="w-full max-w-2xl mx-auto z-20">
            <RoleNode role={roleData.admin} />
          </div>

          {/* Connection Line 2 - Forking into 4 */}
          <div className="hidden lg:flex flex-col items-center w-full relative z-10 my-4 h-24">
            {/* Vertical stem */}
            <div className="w-px h-12 bg-gradient-to-b from-blue-500/50 to-slate-700 relative">
               <motion.div
                animate={{ y: [0, 48] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-6 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              />
            </div>
            
            {/* Horizontal distributor bar */}
            <div className="w-[85%] max-w-5xl h-px bg-slate-700 relative">
              <motion.div
                animate={{ left: ["50%", "0%"], opacity: [1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 w-8 h-[2px] rounded-full bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.8)]"
              />
              <motion.div
                animate={{ left: ["50%", "100%"], opacity: [1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="absolute top-1/2 -translate-y-1/2 w-8 h-[2px] rounded-full bg-slate-400 shadow-[0_0_10px_rgba(148,163,184,0.8)]"
              />
            </div>
            
            {/* Vertical drops */}
            <div className="w-[85%] max-w-5xl flex justify-between h-12">
              <div className="w-px h-full bg-gradient-to-b from-slate-700 to-emerald-500/30 relative">
                <motion.div animate={{ y: [0, 48], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.5 }} className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full bg-emerald-400" />
              </div>
              <div className="w-px h-full bg-gradient-to-b from-slate-700 to-purple-500/30 relative">
                <motion.div animate={{ y: [0, 48], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.7 }} className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full bg-purple-400" />
              </div>
              <div className="w-px h-full bg-gradient-to-b from-slate-700 to-orange-500/30 relative">
                <motion.div animate={{ y: [0, 48], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 0.9 }} className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full bg-orange-400" />
              </div>
              <div className="w-px h-full bg-gradient-to-b from-slate-700 to-teal-500/30 relative">
                <motion.div animate={{ y: [0, 48], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: 1.1 }} className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 rounded-full bg-teal-400" />
              </div>
            </div>

            <div className="absolute top-4 -translate-y-1/2 bg-slate-900 border border-slate-700 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center shadow-xl">
               <Key className="w-3.5 h-3.5 mr-2 text-blue-400" />
               Delegates Module Access
            </div>
          </div>
          <div className="lg:hidden w-px h-12 bg-slate-800" />

          {/* Level 3: Department Cards */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 z-20 relative max-w-7xl mx-auto">
            <RoleNode role={roleData.teacher} />
            <RoleNode role={roleData.student} />
            <RoleNode role={roleData.parent} />
            <RoleNode role={roleData.staff} />
          </div>
        </div>

        {/* Professional ERP Statistics Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-32 grid grid-cols-2 md:grid-cols-5 gap-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-teal-500/5"></div>
          <div className="text-center space-y-2 relative z-10">
            <h4 className="text-3xl font-extrabold text-white">6</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Roles</p>
          </div>
          <div className="text-center space-y-2 relative z-10">
            <h4 className="text-3xl font-extrabold text-blue-400">25+</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ERP Modules</p>
          </div>
          <div className="text-center space-y-2 col-span-2 md:col-span-1 relative z-10 border-x border-slate-800/50">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">100% Secure Access</p>
          </div>
          <div className="text-center space-y-2 relative z-10">
            <div className="flex justify-center mb-2">
              <Globe className="w-8 h-8 text-indigo-400 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Multi-School Support</p>
          </div>
          <div className="text-center space-y-2 relative z-10">
            <div className="flex justify-center mb-2">
              <Zap className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-Time Monitoring</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
