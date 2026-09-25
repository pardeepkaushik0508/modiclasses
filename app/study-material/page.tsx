"use client";

import Link from "next/link";
import { BookOpen, ArrowLeft, Download, FileText, CheckCircle2 } from "lucide-react";

export default function StudyMaterialPage() {
  const materials = [
    {
      id: "mat-1",
      title: "RDSO Official T-Score Formula & Normalization Cutoff Booklet (PDF)",
      size: "2.4 MB",
      format: "PDF",
      type: "Official Guide",
      downloads: 4120,
    },
    {
      id: "mat-2",
      title: "Memory Battery Figure Patterns & Mnemonics Fast Revision Sheet",
      size: "4.1 MB",
      format: "PDF",
      type: "Notes",
      downloads: 6890,
    },
    {
      id: "mat-3",
      title: "Brick Aptitude Test 3D Contact Rules & Projection Geometry Formula",
      size: "1.8 MB",
      format: "PDF",
      type: "Formula Chart",
      downloads: 3240,
    },
    {
      id: "mat-4",
      title: "Concentration (Yes/No) Error Reduction Guide & 500 Practice Pairs",
      size: "3.2 MB",
      format: "PDF",
      type: "Practice Workbook",
      downloads: 5120,
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
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
          Official RDSO Verified Material
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <BookOpen className="w-6 h-6 text-[#1d4ed8]" />
          <span>Study Material, Notes & PDFs</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Download syllabus-aligned revision notes, formula charts, and official RDSO CBT guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {materials.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#1d4ed8] transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 uppercase">
                  {item.type}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {item.size} &bull; {item.format}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500">
                Downloaded by <strong className="text-slate-700">{item.downloads.toLocaleString()}</strong> candidates
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Content</span>
              </span>

              <button
                onClick={() => alert(`Starting download for: ${item.title}`)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
