"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  FileQuestion,
  FileText,
  Users,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Settings,
  Target,
} from "lucide-react";
import type { Session } from "next-auth";

function PiEducationCrest({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#003366" strokeWidth="3" fill="#ffffff" />
      <circle cx="50" cy="50" r="41" stroke="#d97706" strokeWidth="1.5" fill="#0b192e" />
      <path
        d="M50 16 L76 26 V52 C76 68 64 80 50 85 C36 80 24 68 24 52 V26 Z"
        fill="#003366"
        stroke="#d97706"
        strokeWidth="1.5"
      />
      <text
        x="50"
        y="58"
        fill="#f59e0b"
        fontSize="34"
        fontWeight="bold"
        fontFamily="serif"
        textAnchor="middle"
      >
        π
      </text>
      <circle cx="38" cy="72" r="2" fill="#fef08a" />
      <circle cx="50" cy="75" r="2.5" fill="#fef08a" />
      <circle cx="62" cy="72" r="2" fill="#fef08a" />
    </svg>
  );
}

interface AdminLayoutClientProps {
  children: React.ReactNode;
  session: Session;
}

export default function AdminLayoutClient({
  children,
  session,
}: AdminLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Manage Courses",
      href: "/admin/courses",
      icon: BookOpen,
      exact: false,
    },
    {
      label: "RDSO Test Builder",
      href: "/admin/tests/create",
      icon: FileQuestion,
      exact: false,
    },
    {
      label: "Uploaded Materials",
      href: "/admin/materials",
      icon: FileText,
      exact: false,
    },
    {
      label: "Students Directory",
      href: "/admin/students",
      icon: Users,
      exact: false,
    },
    {
      label: "Community Settings",
      href: "/admin/settings",
      icon: Settings,
      exact: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex antialiased font-sans">
      {/* ========================================================
          1. DEEP NAVY ADMIN SIDEBAR (#0b192e)
         ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b192e] text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl lg:shadow-none lg:static`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Branding Header with Pi Crest Emblem */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <Link href="/admin" className="flex items-center gap-3 group">
              <PiEducationCrest className="w-10 h-10 shrink-0 drop-shadow-md group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="text-sm font-black text-white tracking-tight leading-none">
                  FIVE EDUCATION
                </span>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                    ADMIN CONSOLE
                  </span>
                </div>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Role Status Badge */}
          <div className="px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200">Role: ADMIN</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all ${
                    isActive
                      ? "bg-white/10 text-white font-medium shadow-sm border border-white/10"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive ? (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Credential Badge + Navigation Controls */}
        <div className="border-t border-slate-800/80">
          {/* Credential Badge ("Learn Today Lead Tomorrow" styling in #071120) */}
          <div className="p-3 bg-[#071120]">
            <div className="rounded-xl border border-slate-700/80 p-3 bg-gradient-to-b from-slate-900 to-[#071120] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-bold text-white tracking-tight">
                  Learn Today
                </span>
                <span className="text-[11px] font-bold text-slate-300 tracking-tight">
                  Lead Tomorrow
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-white text-[#0b192e] text-[8px] font-bold flex items-center justify-center">
                    F
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    Five Education
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Sidebar Controls */}
          <div className="p-3 bg-[#0b192e] space-y-2 border-t border-slate-800">
            <Link
              href="/"
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 border border-slate-700/60 hover:bg-white/10 text-xs font-semibold text-slate-200 hover:text-white transition-all shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                <span>Back to Student Portal</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ========================================================
          2. ADMIN MAIN CONTAINER & TOP BAR (LIGHT THEME)
         ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Console
              </span>
              <span className="text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-800">
                {navItems.find((n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href)))?.label || "Admin Panel"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/test/rdso-memory-figure-test-01?trial=true"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-[#003366] text-xs font-semibold hover:bg-sky-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Engine Preview</span>
            </Link>

            {/* High-contrast Admin badge per requirement 2 */}
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 border border-amber-300 px-3 py-1 font-semibold rounded-full text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-800" />
              <span>ADMIN CONSOLE</span>
            </span>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <div className="w-6 h-6 rounded-full bg-[#003366] text-white font-bold flex items-center justify-center text-[10px]">
                A
              </div>
              <span className="font-semibold text-slate-700 hidden md:inline">
                {session.user.email}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
