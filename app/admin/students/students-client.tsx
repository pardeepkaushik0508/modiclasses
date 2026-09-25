"use client";

import { useState } from "react";
import { Users, Search, Mail, Phone, BookOpen, Award } from "lucide-react";

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

  const filtered = students.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.name?.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.phone?.toLowerCase().includes(term) ||
      s.rollNo?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Students & Candidates Directory
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {students.length} Total Registered
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Registered candidates, auto-assigned 6-digit CBT roll numbers, and RDSO test engagement.
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
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-700">No candidates found.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                          {s.name ? s.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                            <span>{s.name || "Unnamed Candidate"}</span>
                            {s.role === "ADMIN" && (
                              <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                ADMIN
                              </span>
                            )}
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
  );
}
