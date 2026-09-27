"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

import {
  Home as HomeIcon,
  FileText,
  Video,
  BookOpen,
  Users,
  Gift,
  Award,
  Lock,
  GraduationCap,
  User,
  Settings,
  LogOut,
  Target,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  CheckCircle2,
  Copy,
  ShieldCheck,
  Sparkles,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";

export interface StudentAppLayoutProps {
  children: ReactNode;
}

export default function StudentAppLayout({ children }: StudentAppLayoutProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const currentUser = session?.user;
  const isAuthenticated = status === "authenticated" && !!currentUser;
  const isAdmin = currentUser?.role === "ADMIN";

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [closeGroupModalOpen, setCloseGroupModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Notifications
  const defaultNotifications = [
    {
      id: "n-1",
      title: "RDSO Mock Test Series 2024",
      message: "New 12-Figure Spatial Memory Battery is now active.",
      link: "/test/trial",
      time: "Just now",
    },
    {
      id: "n-2",
      title: "CBT Video Masterclass Added",
      message: "Clock Test Directional Shortcuts masterclass released.",
      link: "/video",
      time: "2h ago",
    },
    {
      id: "n-3",
      title: "Formula & Cutoff Notes",
      message: "42.0 T-Score normalization guide updated in Study Material.",
      link: "/study-material",
      time: "1d ago",
    },
  ];

  const candidateName = currentUser?.name || "Candidate";
  const userInitials = (currentUser?.name ? currentUser.name.trim().charAt(0) : "C").toUpperCase();
  const referralLink = currentUser?.rollNo
    ? `https://fiveeducation.in/register?ref=${currentUser.rollNo}`
    : "https://fiveeducation.in/register";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Nav link active helper
  const isNavActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased flex flex-col">
      {/* ========================================================
          1. STRICT FIXED LEFT SIDEBAR (Pinned, Never Scrolls Away)
         ======================================================== */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0b192e] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-800/80 shadow-2xl lg:shadow-none lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Scrollable Sidebar Body */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
          {/* Logo & Mobile Close */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <Link href="/" className="flex items-center gap-3 group" onClick={() => setSidebarOpen(false)}>
              <div className="w-9 h-9 rounded-full bg-white text-[#0b192e] font-black text-xl flex items-center justify-center shadow-md ring-2 ring-blue-500/20">
                F
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold text-white tracking-tight leading-none">
                  PI EDUCATION
                </span>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-1">
                  RDSO CBT Engine
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Group 1: Core Portal Pages */}
          <nav className="space-y-1">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname === "/"
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
            >
              <HomeIcon className="w-4 h-4 shrink-0" />
              <span>Home</span>
            </Link>

            <Link
              href="/test/trial"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname.startsWith("/test")
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
            >
              <div className="flex items-center gap-3.5">
                <FileText className="w-4 h-4 shrink-0" />
                <span>Psycho Test CBT</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#f59e0b] text-slate-950 uppercase tracking-wider">
                FREE TRIAL
              </span>
            </Link>

            <Link
              href="/video"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname.startsWith("/video")
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>Video Classes</span>
            </Link>

            <Link
              href="/study-material"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname.startsWith("/study-material")
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
            >
              <BookOpen className="w-4 h-4 shrink-0" />
              <span>Study Material</span>
            </Link>

            <Link
              href="/groups"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname.startsWith("/groups")
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Community Groups</span>
            </Link>
          </nav>

          {/* Navigation Group 2: Action Shortcuts */}
          <div className="pt-2 border-t border-slate-800/70 space-y-1">
            <button
              onClick={() => setReferModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Gift className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Refer & Earn</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#ef4444] text-white uppercase tracking-wider">
                Bonus
              </span>
            </button>

            <button
              onClick={() => setCloseGroupModalOpen(true)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-left cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <Lock className="w-4 h-4 shrink-0 text-rose-400" />
                <span>Close Group</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#dc2626] text-white uppercase tracking-wider">
                VIP
              </span>
            </button>
          </div>

          {/* Navigation Group 3: Account & Management */}
          <div className="pt-2 border-t border-slate-800/70 space-y-1">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4" />
                  <span>Admin Panel</span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black">
                  ROOT
                </span>
              </Link>
            )}

            <Link
              href={isAuthenticated ? "/dashboard" : "/login?callbackUrl=/dashboard"}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname === "/dashboard"
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
            >
              <GraduationCap className="w-4 h-4 shrink-0 text-slate-400" />
              <span>My Dashboard</span>
            </Link>

            <Link
              href={isAuthenticated ? "/dashboard/profile" : "/login?callbackUrl=/dashboard/profile"}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname.startsWith("/dashboard/profile")
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
            >
              <User className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Profile</span>
            </Link>

            <Link
              href={isAuthenticated ? "/dashboard/settings" : "/login?callbackUrl=/dashboard/settings"}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${pathname.startsWith("/dashboard/settings")
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                }`}
            >
              <Settings className="w-4 h-4 shrink-0 text-slate-400" />
              <span>Settings</span>
            </Link>

            {isAuthenticated ? (
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-slate-800/80 hover:text-rose-300 transition-all text-left cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Logout</span>
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-sky-400 hover:bg-slate-800/80 hover:text-sky-300 transition-all"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Login / Register</span>
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar Footer Badge */}
        <div className="p-4 border-t border-slate-800/80 bg-[#071120] shrink-0">
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
                  PI EDUCATION
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* ========================================================
          2. RIGHT-HAND PERSISTENT CONTAINER (Offset by Sidebar)
         ======================================================== */}
      <div className="lg:pl-64 flex flex-col min-h-screen w-full min-w-0 bg-[#f8fafc]">
        {/* ========================================================
            STICKY HEADER (Always Visible & Pinned at Top)
           ======================================================== */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/90 px-4 sm:px-6 flex items-center justify-between gap-4 shadow-2xs shrink-0">
          {/* Left: Mobile Toggle & Page Brand Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#0b192e] text-white font-black text-sm flex items-center justify-center shadow-xs">
                F
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-black text-slate-900 tracking-tight leading-none">
                  PI EDUCATION
                </span>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5">
                  RDSO Psycho CBT Engine
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search / Info Pill */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-[#1d4ed8]" />
            <span className="font-semibold text-slate-700">Official RDSO CBT Exam Platform</span>
            <span className="text-slate-400">•</span>
            <span className="text-[11px] text-slate-500">RRB ALP & Station Master</span>
          </div>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Free Trial Button */}
            <Link
              href="/test/trial"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950 fill-current" />
              <span className="hidden sm:inline">Free Trial</span>
              <span className="sm:hidden">Trial</span>
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen((prev) => !prev)}
                className="w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-colors relative cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-blue-600" />
                      <h4 className="font-bold text-xs text-slate-900">Notifications & Alerts</h4>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      3 New
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                    {defaultNotifications.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.link}
                        onClick={() => setIsNotifOpen(false)}
                        className="p-3.5 block hover:bg-slate-50 transition-colors"
                      >
                        <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                      </Link>
                    ))}
                  </div>

                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                    <Link
                      href="/study-material"
                      onClick={() => setIsNotifOpen(false)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      View All Course Updates &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Menu Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-[#003366] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    {userInitials}
                  </div>
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-slate-900 max-w-[110px] truncate">
                      {candidateName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {currentUser?.rollNo || "Roll: Verified"}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-4 bg-slate-50/80 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-sm">
                          {userInitials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{candidateName}</p>
                          <p className="text-[11px] text-slate-500 truncate">{currentUser?.email}</p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700">
                              {currentUser?.role === "ADMIN" ? "ADMIN" : "CANDIDATE"}
                            </span>
                            {currentUser?.rollNo && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                #{currentUser.rollNo}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-2 space-y-1 text-xs">
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-700 bg-amber-50 hover:bg-amber-100 font-bold transition-colors"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <GraduationCap className="w-4 h-4 text-slate-400" />
                        <span>My Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Account Profile</span>
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        <span>Exam Settings</span>
                      </Link>

                      <div className="border-t border-slate-100 my-1" />

                      <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="px-3.5 py-1.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* ========================================================
            SCROLLABLE MAIN CONTENT AREA
           ======================================================== */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* ========================================================
          ACCESSIBLE MODAL 1: REFERRAL & EARN (DEAD-CENTER & RESPONSIVE)
         ======================================================== */}
      {referModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-[#4f46e5] to-[#2563eb] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">Referral & Earn Rewards</h3>
              </div>
              <button
                onClick={() => setReferModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 overflow-y-auto flex-1">
              <p>
                Share your personal PI EDUCATION referral link with fellow RRB aspirants. When they join, both of you receive <strong>5 Free Psycho Mock Tests</strong> and <strong>₹200 Course Credits</strong>.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Your Unique Referral Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setReferModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ACCESSIBLE MODAL 2: CLOSE GROUP ENROLLMENT (DEAD-CENTER & RESPONSIVE)
         ======================================================== */}
      {closeGroupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-200" />
                <h3 className="font-extrabold text-base">Close Group Exclusive Access</h3>
              </div>
              <button
                onClick={() => setCloseGroupModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600 overflow-y-auto flex-1">
              <p>
                The <strong>PI EDUCATION Close Group</strong> is an invite-only cohort reserved for candidates preparing for Indian Railways RRB ALP & Station Master Aptitude batteries.
              </p>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-2 text-rose-900">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Member Privileges</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-rose-800">
                  <li>Daily Live Strategy Sessions with Ex-RDSO Psychologists</li>
                  <li>Real-time Doubt Clearing for Memory & Clock Batteries</li>
                  <li>Weekly Ranking Normalized on Official 42.0 Cutoff Formulas</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setCloseGroupModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <Link
                href="/groups"
                onClick={() => setCloseGroupModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white font-bold text-xs cursor-pointer"
              >
                Proceed to Groups Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
