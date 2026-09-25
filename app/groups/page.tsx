"use client";

import Link from "next/link";
import { Users, ArrowLeft, Lock, ShieldCheck, MessageSquare, Sparkles } from "lucide-react";

export default function GroupsCommunityPage() {
  const groups = [
    {
      id: "grp-1",
      name: "RRB ALP & Technician Psycho CBT 2026 Batch",
      members: 1420,
      activeToday: 218,
      type: "Public Community",
      badge: "Active Discussion",
      isExclusive: false,
    },
    {
      id: "grp-2",
      name: "Station Master (SM) Psycho Cutoff Target 42.0+ Club",
      members: 890,
      activeToday: 134,
      type: "Public Community",
      badge: "Target 42.0+",
      isExclusive: false,
    },
    {
      id: "grp-3",
      name: "Five Education Close Group (Exclusive Mentorship)",
      members: 310,
      activeToday: 89,
      type: "Close Group",
      badge: "Exclusive Access",
      isExclusive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#1d4ed8] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
          Peer Discussions & Doubt Solving
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Users className="w-6 h-6 text-[#1d4ed8]" />
          <span>Candidate Communities & Close Groups</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Connect with serious RRB aspirants, discuss battery doubt patterns, and receive expert faculty mentorship.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {groups.map((group) => (
          <div
            key={group.id}
            className={`p-5 rounded-2xl border shadow-xs flex flex-col justify-between space-y-4 ${
              group.isExclusive
                ? "bg-gradient-to-b from-slate-900 to-[#0b192e] text-white border-slate-700"
                : "bg-white text-slate-800 border-slate-200"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  group.isExclusive
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                    : "bg-purple-50 text-purple-700"
                }`}>
                  {group.type}
                </span>
                <span className={`text-xs ${group.isExclusive ? "text-slate-400" : "text-slate-500"}`}>
                  {group.members} Members
                </span>
              </div>

              <h3 className="text-base font-bold leading-snug">
                {group.name}
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={group.isExclusive ? "text-slate-300" : "text-slate-600"}>
                  {group.activeToday} active members discussing right now
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/20">
              {group.isExclusive ? (
                <button
                  onClick={() => alert("Joining Exclusive Close Group mentorship channel...")}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Join Close Group</span>
                </button>
              ) : (
                <button
                  onClick={() => alert(`Joined ${group.name}!`)}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Join Discussion</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
