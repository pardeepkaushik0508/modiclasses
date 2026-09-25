"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Award,
  ArrowLeft,
  LogOut,
  Calendar,
  CheckCircle2,
  Clock,
  Settings,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function CandidateProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/profile");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading Profile Details...</p>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const initials = (user?.name ? user.name.trim().charAt(0) : "C").toUpperCase();

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* Top Header */}
      <header className="bg-[#e2e8f0] border-b-2 border-[#cbd5e1] px-4 py-2.5 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-bold text-lg shadow">
                FE
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                  FIVE EDUCATION • CANDIDATE PROFILE
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Indian Railways RDSO Psycho Aptitude Exam Engine
                </p>
              </div>
            </Link>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Dashboard</span>
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Profile Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Profile Hero Card */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-sky-400 text-white flex items-center justify-center font-bold text-3xl shadow-lg ring-4 ring-sky-100">
              {initials}
            </div>
            <div className="space-y-2 flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Candidate Account</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900">
                {user?.name || "Candidate"}
              </h2>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {user?.email || "No email available"}
                </span>
                {user?.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-slate-400" />
                    {user.phone}
                  </span>
                )}
                <span className="font-mono bg-slate-100 px-2.5 py-0.5 rounded border border-slate-200 text-slate-700 font-bold">
                  Roll: {user?.rollNo || "NOT-ASSIGNED"}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Account Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Official CBT Credentials */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-[#0284c7]" />
              <h3 className="font-bold text-slate-900 text-sm">RDSO CBT Candidate Info</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Candidate Name</span>
                <span className="font-bold text-slate-800">{user?.name || "Candidate"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">CBT Roll Number</span>
                <span className="font-mono font-bold text-[#0284c7]">{user?.rollNo || "Auto-Assigned"}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Candidate Category / Role</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {user?.role || "STUDENT"}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Exam Engine Access</span>
                <span className="font-bold text-slate-800">5-Battery RDSO Standard</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500 font-medium">Minimum Cutoff Requirement</span>
                <span className="font-bold text-emerald-600">42.0 T-Score in each Battery</span>
              </div>
            </div>
          </div>

          {/* Card 2: Quick Links & Actions */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Settings className="w-5 h-5 text-[#0284c7]" />
              <h3 className="font-bold text-slate-900 text-sm">Portal Navigation</h3>
            </div>

            <div className="space-y-2.5">
              <Link
                href="/dashboard"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-[#0284c7] hover:bg-sky-50/50 transition-all text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0284c7]" />
                  <span>Access Mock Tests & Batteries</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <Link
                href="/dashboard/settings"
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-[#0284c7] hover:bg-sky-50/50 transition-all text-xs font-semibold text-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-[#0284c7]" />
                  <span>Notification & Engine Settings</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-rose-200 bg-rose-50/50 hover:bg-rose-100/50 transition-all text-xs font-semibold text-rose-700 cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Log Out of Session</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
