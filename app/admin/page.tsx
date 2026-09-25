import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Users,
  BookOpen,
  FileQuestion,
  Activity,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | Five Education",
  description: "Overview of platform metrics, active courses, RDSO tests, and students.",
};

export default async function AdminDashboardPage() {
  // Fetch live statistics in parallel
  const [
    totalStudents,
    totalCourses,
    publishedCourses,
    totalTests,
    totalAttempts,
    recentCourses,
    recentTests,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.test.count(),
    prisma.testAttempt.count(),
    prisma.course.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { tests: true, orders: true },
        },
      },
    }),
    prisma.test.findMany({
      take: 4,
      orderBy: { createdAt: "desc" },
      include: {
        course: { select: { title: true } },
        _count: { select: { sections: true, attempts: true } },
      },
    }),
  ]);

  const stats = [
    {
      title: "Registered Students",
      value: totalStudents,
      subtext: "Auto 6-digit Roll Numbers",
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      textColor: "text-blue-600",
      href: "/admin/students",
    },
    {
      title: "Active LMS Courses",
      value: `${publishedCourses} / ${totalCourses}`,
      subtext: `${publishedCourses} Published live`,
      icon: BookOpen,
      color: "from-emerald-600 to-teal-600",
      textColor: "text-emerald-600",
      href: "/admin/courses",
    },
    {
      title: "RDSO Psycho Tests",
      value: totalTests,
      subtext: "9 Battery Types Supported",
      icon: FileQuestion,
      color: "from-sky-600 to-cyan-600",
      textColor: "text-sky-600",
      href: "/admin/tests/create",
    },
    {
      title: "CBT Test Attempts",
      value: totalAttempts,
      subtext: "Evaluated with 42.0 T-Cutoff",
      icon: Activity,
      color: "from-amber-600 to-orange-600",
      textColor: "text-amber-600",
      href: "/admin/tests/create",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner (Clean Light Theme) */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/60 to-white border border-blue-100 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-100/70 text-blue-800 border border-blue-200">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>RBAC Engine Guard Active &bull; Role: ADMIN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Five Education LMS Administrator Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Dynamically manage candidate courses, create single-page RDSO psycho memory tests,
              and track student readiness without touching database seeds manually.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/courses"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Courses</span>
            </Link>

            <Link
              href="/admin/tests/create"
              className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-sm flex items-center gap-2 transition-transform hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4" />
              <span>RDSO Test Builder</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <Link
              key={idx}
              href={s.href}
              className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-5 space-y-3 transition-all hover:translate-y-[-2px] shadow-xs group block"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${s.color} text-white flex items-center justify-center shadow-xs`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
              </div>

              <div>
                <div className="text-2xl font-black text-slate-900 tracking-tight">{s.value}</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">{s.title}</div>
                <div className={`text-[11px] font-semibold ${s.textColor} mt-1`}>{s.subtext}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* 2-Column: Recent Courses & Recent Tests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Courses Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                Courses in Database
              </h3>
            </div>
            <Link
              href="/admin/courses"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentCourses.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No courses created yet.</p>
            ) : (
              recentCourses.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="space-y-0.5 max-w-[70%]">
                    <div className="font-bold text-slate-900 text-xs line-clamp-1">{c.title}</div>
                    <div className="text-[11px] text-slate-500">
                      ₹{c.discountedPrice ?? c.price} &bull; {c.validityDays} Days Validity
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      c.isPublished
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {c.isPublished ? "Live" : "Draft"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent RDSO Tests Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileQuestion className="w-4 h-4 text-sky-600" />
              <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                RDSO Test Batteries
              </h3>
            </div>
            <Link
              href="/admin/tests/create"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
            >
              <span>+ New Test</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentTests.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No tests created yet.</p>
            ) : (
              recentTests.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="space-y-0.5 max-w-[70%]">
                    <div className="font-bold text-slate-900 text-xs line-clamp-1">{t.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2">
                      <span className="text-blue-600 font-mono font-semibold">
                        {t.batteryType}
                      </span>
                      <span>&bull;</span>
                      <span>{t.totalDurationSeconds}s</span>
                    </div>
                  </div>

                  <Link
                    href={`/test/${t.slug}?trial=true`}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 text-slate-600 transition-colors"
                    title="Launch CBT Preview"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
