"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Clock,
  BookOpen,
  Award,
  Layers,
  Lock,
  LogOut,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
} from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading Candidate Profile...</p>
        </div>
      </div>
    );
  }

  const user = session?.user;

  const batteries = [
    {
      id: "MEMORY_FIGURE",
      name: "Memory Test (Figures)",
      description: "RDSO Standard 12-figure spatial association and recall battery.",
      questions: 12,
      time: "4m Study + 4m Test",
      status: "Ready to Attempt",
      scoreCutoff: "42.0 T-Score",
    },
    {
      id: "CLOCK",
      name: "Direction Test (Clock & Table)",
      description: "Rapid mental compass rotation and clock face orientation.",
      questions: 10,
      time: "5 Minutes",
      status: "Available",
      scoreCutoff: "42.0 T-Score",
    },
    {
      id: "BRICK",
      name: "Depth Perception (Brick Test)",
      description: "3D block counting & surface contact perception assessment.",
      questions: 50,
      time: "5 Minutes",
      status: "Available",
      scoreCutoff: "42.0 T-Score",
    },
    {
      id: "YES_NO",
      name: "Concentration (Yes / No Test)",
      description: "High-speed selective attention and character string matching.",
      questions: 96,
      time: "4 Minutes",
      status: "Available",
      scoreCutoff: "42.0 T-Score",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* Top RDSO CBT Header */}
      <header className="bg-[#e2e8f0] border-b-2 border-[#cbd5e1] px-4 py-2.5 shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#0284c7] flex items-center justify-center text-white font-bold text-lg shadow">
                FE
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-none">
                  FIVE EDUCATION • STUDENT CBT PORTAL
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Indian Railways RDSO Psycho Aptitude Exam Engine
                </p>
              </div>
            </Link>
          </div>

          {/* User Details & Sign Out */}
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300">
              <span className="text-slate-500 font-medium">Roll No:</span>
              <span className="font-mono font-bold text-[#0284c7]">
                {user?.rollNo || "NOT-ASSIGNED"}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{user?.role || "STUDENT"}</span>
            </div>

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

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 space-y-6">
        {/* Candidate Profile Summary Banner */}
        <section className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0284c7] to-sky-400 text-white flex items-center justify-center font-bold text-xl shadow">
                {user?.name ? user.name[0].toUpperCase() : "C"}
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-[#0284c7] border border-sky-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Authenticated Session Active</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                  Welcome back, {user?.name || "Candidate"}!
                </h2>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {user?.email}
                  </span>
                  {user?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {user.phone}
                    </span>
                  )}
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                    CBT Roll: <strong>{user?.rollNo}</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center min-w-[100px]">
                <div className="text-xl font-bold text-[#0284c7]">5</div>
                <div className="text-xs text-slate-500 font-medium">Batteries</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-center min-w-[100px]">
                <div className="text-xl font-bold text-emerald-600">42.0+</div>
                <div className="text-xs text-slate-500 font-medium">Req. T-Score</div>
              </div>
            </div>
          </div>
        </section>

        {/* Available CBT Test Batteries */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Official RDSO CBT Test Batteries</h3>
              <p className="text-xs text-slate-500">
                Simulated under official RDSO examination timings with strict anti-selection security.
              </p>
            </div>
            <Link
              href="/test/rdso-memory-figure-test-01?trial=true"
              className="text-xs font-semibold text-[#0284c7] hover:underline flex items-center gap-1"
            >
              <span>Test Engine Demo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {batteries.map((battery) => (
              <div
                key={battery.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-[#0284c7] hover:shadow transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm sm:text-base">{battery.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{battery.description}</p>
                  </div>
                  <span className="shrink-0 text-[11px] font-semibold bg-sky-50 text-[#0284c7] border border-sky-200 px-2 py-0.5 rounded">
                    {battery.time}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-600">
                  <div>
                    <span>Questions: </span>
                    <strong className="text-slate-800">{battery.questions}</strong>
                  </div>
                  <div>
                    <span>Cutoff: </span>
                    <strong className="text-emerald-700">{battery.scoreCutoff}</strong>
                  </div>
                  <Link
                    href={battery.id === "MEMORY_FIGURE" ? "/test/rdso-memory-figure-test-01" : "/test/rdso-memory-figure-test-01?trial=true"}
                    className="inline-flex items-center gap-1 font-semibold text-[#0284c7] hover:text-[#0369a1]"
                  >
                    <span>Launch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
