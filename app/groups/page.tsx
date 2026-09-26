import Link from "next/link";
import {
  Users,
  ArrowLeft,
  Lock,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Clock,
  Send,
  MessageCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getGroupSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function GroupsCommunityPage() {
  // Query total enrolled/registered aspirants and dynamic site group settings from PostgreSQL
  const [totalStudents, groupSettings] = await Promise.all([
    prisma.user.count({
      where: { role: Role.STUDENT },
    }),
    getGroupSettings(),
  ]);

  const baseAspirantCount = Math.max(14200, totalStudents * 100 + 14200);

  const groups = [
    {
      id: "grp-1",
      name: groupSettings.telegramName,
      platform: "Telegram Community",
      platformIcon: Send,
      link: groupSettings.telegramLink,
      members: `${(baseAspirantCount).toLocaleString()}+ Members`,
      activeToday: "1,840 Active Aspirants",
      type: "Public Community",
      badge: "Official Telegram",
      badgeColor: "bg-sky-50 text-[#0284c7] border-sky-200",
      isExclusive: false,
      description: groupSettings.telegramDescription,
      features: [
        "Daily 12-Figure Memory Chart Practice",
        "Instant T-Score Discussion & Rank Polls",
        "Live Notice & RRB Exam Date Alerts",
      ],
      buttonText: "Join Telegram Channel",
      buttonBg: "bg-[#0088cc] hover:bg-[#0077b5]",
    },
    {
      id: "grp-2",
      name: groupSettings.whatsappName,
      platform: "WhatsApp Community",
      platformIcon: MessageCircle,
      link: groupSettings.whatsappLink,
      members: "1,024 Members (Max Capacity)",
      activeToday: "340 Active Today",
      type: "Aspirant Community",
      badge: "WhatsApp Batch",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      isExclusive: false,
      description: groupSettings.whatsappDescription,
      features: [
        "Compass & Clock Test Mental Rotation Tricks",
        "Sectional Qualifying Threshold Discussions",
        "Peer Doubt Solving & Practice PDFs",
      ],
      buttonText: "Join WhatsApp Group",
      buttonBg: "bg-[#25D366] hover:bg-[#20ba59]",
    },
    {
      id: "grp-3",
      name: groupSettings.mentorshipName,
      platform: "VIP Mentorship Desk",
      platformIcon: ShieldCheck,
      link: groupSettings.mentorshipLink,
      members: "650 Enrolled Scholars",
      activeToday: "120 Active Now",
      type: "Close Group",
      badge: "Exclusive Access",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      isExclusive: true,
      description: groupSettings.mentorshipDescription,
      features: [
        "Direct Voice & Chat with Ex-RDSO Faculty",
        "Personalized Diagnostic Scorecard Reviews",
        "Exclusive Speed Battery Strategy Sessions",
      ],
      buttonText: "Join Close Group Mentorship",
      buttonBg: "bg-[#ef4444] hover:bg-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      {/* Top Navigation & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#003366] hover:text-[#0284c7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Peer Discussions & Doubt Solving</span>
        </span>
      </div>

      {/* Main Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 text-[#003366] border border-sky-200 text-xs font-bold">
            <Users className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Community Learning & Mentorship Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Candidate Communities & Close Groups
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Connect with serious RRB aspirants, discuss battery doubt patterns, participate in daily timed quizzes, and receive expert faculty guidance.
          </p>
        </div>

        {/* Live Active Aspirants Badge */}
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-3 rounded-xl shrink-0">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <div>
            <div className="text-sm font-black text-emerald-900 leading-tight">Live Aspirant Hub</div>
            <div className="text-[11px] font-semibold text-emerald-700">3,840+ Online Across Channels</div>
          </div>
        </div>
      </div>

      {/* Live-Style Stats Ribbon (Requirement 3: Active Aspirants, Daily Quizzes, Mentor Support) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Stat 1: Active Aspirants */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Active Aspirants
            </div>
            <div className="text-lg font-black text-slate-900">
              3,840+ Online
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Active across Telegram & WhatsApp</span>
            </div>
          </div>
        </div>

        {/* Stat 2: Daily Quizzes */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Daily Quizzes
            </div>
            <div className="text-lg font-black text-slate-900">
              10:00 AM & 8:00 PM
            </div>
            <div className="text-[11px] text-amber-700 font-semibold">
              Daily timed memory & speed polls
            </div>
          </div>
        </div>

        {/* Stat 3: Mentor Support */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-200 text-[#003366] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-[#0284c7]" />
          </div>
          <div className="space-y-0.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              Mentor Support
            </div>
            <div className="text-lg font-black text-slate-900">
              24/7 Expert Faculty
            </div>
            <div className="text-[11px] text-sky-800 font-semibold">
              Ex-RDSO specialists & ALP rankers
            </div>
          </div>
        </div>
      </div>

      {/* Community Groups Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {groups.map((group) => {
          const Icon = group.platformIcon;
          return (
            <div
              key={group.id}
              className={`p-5 sm:p-6 rounded-2xl border shadow-xs flex flex-col justify-between space-y-5 transition-all hover:shadow-md ${
                group.isExclusive
                  ? "bg-gradient-to-b from-slate-950 via-slate-900 to-[#07152b] text-white border-slate-800"
                  : "bg-white text-slate-800 border-slate-200"
              }`}
            >
              <div className="space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${group.badgeColor}`}
                  >
                    {group.badge}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      group.isExclusive ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {group.members}
                  </span>
                </div>

                {/* Title & Platform */}
                <div>
                  <h3 className="text-lg font-black leading-snug">
                    {group.name}
                  </h3>
                  <p
                    className={`text-xs mt-1.5 line-clamp-2 ${
                      group.isExclusive ? "text-slate-300" : "text-slate-600"
                    }`}
                  >
                    {group.description}
                  </p>
                </div>

                {/* Live Active Pill */}
                <div
                  className={`inline-flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                    group.isExclusive
                      ? "bg-slate-800/80 text-emerald-400 border border-slate-700"
                      : "bg-slate-50 text-emerald-700 border border-slate-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{group.activeToday}</span>
                </div>

                {/* Feature Bullet Checklist */}
                <ul className="space-y-2 pt-2 border-t border-slate-200/20 text-xs">
                  {group.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          group.isExclusive ? "text-rose-400" : "text-[#0284c7]"
                        }`}
                      />
                      <span
                        className={
                          group.isExclusive ? "text-slate-300" : "text-slate-600"
                        }
                      >
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button: Real External Direct Link */}
              <div className="pt-3 border-t border-slate-200/20">
                <a
                  href={group.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white font-bold text-xs shadow-xs transition-all cursor-pointer ${group.buttonBg}`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{group.buttonText}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
