"use client";

import { useState, useMemo } from "react";
import { Users, Search, Mail, Phone, BookOpen, Award, ShieldCheck, ShieldAlert, GraduationCap, CheckCircle2 } from "lucide-react";

interface StudentItem {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  rollNo: string | null;
  role: string;
  createdAt: Date | string;
  _count: {
    orders: number;
    attempts: number;
  };
}

export default function StudentsClient({ students }: { students: StudentItem[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "ADMINS" | "STUDENTS">("ALL");

  const admins = useMemo(() => students.filter((s) => s.role === "ADMIN"), [students]);
  const regularStudents = useMemo(() => students.filter((s) => s.role !== "ADMIN"), [students]);

  const filterUser = (s: StudentItem) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term) ||
      s.rollNo?.toLowerCase().includes(term)
    );
  };

  const filteredAdmins = useMemo(() => admins.filter(filterUser), [admins, searchTerm]);
  const filteredStudents = useMemo(() => regularStudents.filter(filterUser), [regularStudents, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              User & Candidate Directory
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#003366] border border-sky-200">
              {students.length} Total Accounts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Separated view of system administrators, enrolled students, auto-assigned CBT roll numbers, and examination progress.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, roll no, email..."
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#003366] focus:ring-1 focus:ring-[#003366]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("ALL")}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "ALL"
              ? "bg-[#003366] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Accounts ({students.length})
        </button>
        <button
          onClick={() => setActiveTab("ADMINS")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "ADMINS"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Administrators ({admins.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("STUDENTS")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
            activeTab === "STUDENTS"
              ? "bg-[#003366] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Students & Candidates ({regularStudents.length})</span>
        </button>
      </div>

      {/* ========================================================
          1. PINNED ADMINISTRATOR HIERARCHY SECTION
         ======================================================== */}
      {(activeTab === "ALL" || activeTab === "ADMINS") && (
        <div className="bg-gradient-to-r from-slate-900 via-[#0b192e] to-slate-900 border-2 border-amber-500/40 rounded-2xl p-5 shadow-sm space-y-4 text-white">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>System Administrators</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wide">
                    PINNED AT TOP
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Accounts with root access, academic creation rights, and portal governance.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-amber-300 border border-white/10">
              {filteredAdmins.length} Superuser Account{filteredAdmins.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredAdmins.map((admin) => (
              <div
                key={admin.id}
                className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-700 text-white font-black flex items-center justify-center text-sm shadow">
                    {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
                  </div>
                  <div>
                    <div className="font-extrabold text-xs text-white flex items-center gap-2">
                      <span>{admin.name || "Administrator"}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase">
                        ROOT ADMIN
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{admin.email}</span>
                    </div>
                    {admin.phone && (
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Phone className="w-2.5 h-2.5 text-slate-500" />
                        <span>{admin.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-700/60 px-2 py-0.5 rounded">
                    {admin.rollNo || "FE-ADMIN"}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Full Access Granted
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================
          2. CANDIDATES & STUDENTS DIRECTORY SECTION
         ======================================================== */}
      {(activeTab === "ALL" || activeTab === "STUDENTS") && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#003366]" />
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Registered Candidates & Students ({filteredStudents.length})
              </h2>
            </div>
            <span className="text-[11px] font-medium text-slate-500">
              Ordered by registration date
            </span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-xs">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Roll Number</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Enrolled Courses</th>
                    <th className="py-3.5 px-4">Test Attempts</th>
                    <th className="py-3.5 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                        <p className="font-semibold text-sm text-slate-700">No student candidates found.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#003366] to-indigo-700 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                              {s.name ? s.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-xs">
                                {s.name || "Unnamed Candidate"}
                              </div>
                              <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-slate-400" />
                                <span>{s.email}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                            {s.rollNo || "N/A"}
                          </span>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-slate-700">
                          {s.phone ? (
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>{s.phone}</span>
                            </div>
                          ) : (
                            <span className="text-slate-400">Not provided</span>
                          )}
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                            <span className="font-semibold">{s._count.orders} Courses</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            <span className="font-semibold">{s._count.attempts} Tests</span>
                          </div>
                        </td>

                        <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                          {new Date(s.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
