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
} from "lucide-react";
import type { Session } from "next-auth";

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
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex antialiased font-sans">
      {/* ========================================================
          1. CLEAN WHITE SIDEBAR (LIGHT THEME)
         ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-xl lg:shadow-none lg:static`}
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Logo & Mobile Close */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                FE
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-black text-slate-900 tracking-tight leading-none">
                  Five Education
                </span>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mt-1">
                  Admin Console
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Admin Role Status Badge */}
          <div className="px-3.5 py-2.5 rounded-xl bg-blue-50/80 border border-blue-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-blue-900">Role: ADMIN</span>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm font-bold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Controls */}
        <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/80">
          <Link
            href="/"
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100/80 text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Back to Student Portal</span>
            </div>
          </Link>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ========================================================
          2. ADMIN MAIN CONTAINER & TOP BAR (LIGHT THEME)
         ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-30 flex items-center justify-between gap-4">
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
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold hover:bg-sky-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Engine Preview</span>
            </Link>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px]">
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
