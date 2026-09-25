"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Settings,
  Bell,
  Volume2,
  Lock,
  ArrowLeft,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  Save,
} from "lucide-react";

export default function CandidateSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [soundEffects, setSoundEffects] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/settings");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#0284c7] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-slate-600">Loading Preferences...</p>
        </div>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

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
                  FIVE EDUCATION • SETTINGS
                </h1>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Indian Railways RDSO Psycho Aptitude Exam Engine
                </p>
              </div>
            </Link>
          </div>

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

      {/* Main Settings Body */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Exam & Account Settings</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize exam simulation feedback, notification channels, and portal behavior.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: RDSO Exam Engine Preferences */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Volume2 className="w-5 h-5 text-[#0284c7]" />
              <h3 className="font-bold text-slate-900 text-sm">CBT Test Engine Experience</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-800">Timer Warning Sound Effects</p>
                  <p className="text-[11px] text-slate-500">
                    Play a gentle audio ping when 60 seconds remain in an RDSO battery section.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 2: Notifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Bell className="w-5 h-5 text-[#0284c7]" />
              <h3 className="font-bold text-slate-900 text-sm">Notifications & Alerts</h3>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-800">Email Test Report & Analytics</p>
                  <p className="text-[11px] text-slate-500">
                    Receive your 5-battery T-Score breakdown card after each full mock attempt.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <p className="text-xs font-bold text-slate-800">SMS / WhatsApp Live Updates</p>
                  <p className="text-[11px] text-slate-500">
                    Get RDSO syllabus amendments and daily live class schedule reminders.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 text-[#0284c7] rounded border-slate-300 focus:ring-[#0284c7] cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
