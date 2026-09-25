"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  Download,
  FileText,
  CheckCircle2,
  Lock,
  Search,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FolderOpen,
} from "lucide-react";

export interface SerializedStudyMaterial {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  isFree: boolean;
  createdAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
    price: number;
    discountedPrice: number | null;
  };
}

interface StudyMaterialClientProps {
  materials: SerializedStudyMaterial[];
  enrolledCourseIds: string[];
  isAdmin: boolean;
}

const CATEGORIES = [
  "All",
  "Notes",
  "Formula Sheets",
  "PYQ Papers",
  "Memory Shortcuts",
] as const;

type Category = (typeof CATEGORIES)[number];

// Helper to deduce category from material title
function getMaterialCategory(title: string): "Formula Sheets" | "PYQ Papers" | "Memory Shortcuts" | "Notes" {
  const t = title.toLowerCase();
  if (t.includes("formula") || t.includes("t-score") || t.includes("score") || t.includes("normalization")) {
    return "Formula Sheets";
  }
  if (t.includes("pyq") || t.includes("previous year") || t.includes("solved paper") || t.includes("paper")) {
    return "PYQ Papers";
  }
  if (t.includes("memory") || t.includes("shortcut") || t.includes("mnemonic") || t.includes("trick") || t.includes("scanning")) {
    return "Memory Shortcuts";
  }
  return "Notes";
}

export default function StudyMaterialClient({
  materials,
  enrolledCourseIds,
  isAdmin,
}: StudyMaterialClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Filtered materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const itemCategory = getMaterialCategory(item.title);
      const matchesCategory =
        activeCategory === "All" || itemCategory === activeCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.course.title.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [materials, activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 md:p-10 max-w-7xl mx-auto space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#003366] hover:text-[#0284c7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official RDSO Verified Syllabus</span>
          </span>
          {isAdmin && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
              Admin Access Active
            </span>
          )}
        </div>
      </div>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 md:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 text-[#003366] border border-sky-200 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>RRB ALP & Station Master Aptitude Repository</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Study Material, Notes & Question Papers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            Download syllabus-aligned revision notes, formula charts, previous year solved test papers, and official RDSO CBT guidelines.
          </p>
        </div>

        {/* Stats pill */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 shrink-0">
          <div className="text-center">
            <div className="text-xl font-black text-[#003366]">{materials.length}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Documents</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <div className="text-xl font-black text-emerald-600">100%</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Verified</div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-[#003366] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search material title or course..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No study materials match your filter</h3>
          <p className="text-xs text-slate-500">
            Try choosing a different category or clearing your search term.
          </p>
          <button
            onClick={() => {
              setActiveCategory("All");
              setSearchQuery("");
            }}
            className="px-4 py-1.5 rounded-lg bg-[#003366] text-white text-xs font-bold hover:bg-[#0284c7] transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMaterials.map((item) => {
            const category = getMaterialCategory(item.title);
            const isEnrolled = enrolledCourseIds.includes(item.course.id);
            const isAccessible = item.isFree || isAdmin || isEnrolled;

            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#003366] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#003366] border border-sky-100 uppercase tracking-wide">
                      {category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.fileType || "PDF"}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#003366] transition-colors">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span>
                      Course:{" "}
                      <strong className="text-slate-700 font-semibold">
                        {item.course.title}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Footer Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                  <div className="flex items-center gap-1.5">
                    {item.isFree ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Free Preview
                      </span>
                    ) : isEnrolled || isAdmin ? (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Enrolled Access
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        Course Enrolled Only
                      </span>
                    )}
                  </div>

                  {/* Real Download / Locked Button */}
                  {isAccessible ? (
                    <a
                      href={item.fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#003366] hover:bg-[#0284c7] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  ) : (
                    <Link
                      href="/#pricing"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs shadow-xs transition-colors"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Locked • Enroll to Access</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
