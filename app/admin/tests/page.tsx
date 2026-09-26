import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Plus, FileQuestion, ExternalLink, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "RDSO Psycho Tests | Admin Console - Five Education",
  description: "Manage and preview RDSO CBT battery tests configured in the database.",
};

export default async function AdminTestsDirectoryPage() {
  const tests = await prisma.test.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      course: { select: { title: true } },
      _count: { select: { sections: true, attempts: true } },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header & New Test Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              RDSO Test Batteries
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-50 text-[#003366] border border-sky-200">
              {tests.length} Batteries
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse, manage, preview, and build simulated RDSO psycho aptitude CBT batteries.
          </p>
        </div>

        <Link
          href="/admin/tests/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Build RDSO Test</span>
        </Link>
      </div>

      {/* Tests Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3.5 px-4">Test Title & Slug</th>
                <th className="py-3.5 px-4">Battery Type</th>
                <th className="py-3.5 px-4">Linked Course</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Preview</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <FileQuestion className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-700">No tests created yet.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click &ldquo;Build RDSO Test&rdquo; above to create your first battery test.
                    </p>
                  </td>
                </tr>
              ) : (
                tests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-bold text-slate-900 text-xs">{t.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          slug: {t.slug}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-md text-[10px] font-bold bg-sky-50 text-[#003366] border border-sky-200">
                        {t.batteryType}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {t.course?.title || <span className="text-slate-400 italic">Universal Battery</span>}
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {t.totalDurationSeconds}s ({Math.round(t.totalDurationSeconds / 60)} min)
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                          t.isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {t.isPublished ? "Live" : "Draft"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <Link
                        href={`/test/${t.slug || t.id}?trial=true`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-[#003366] hover:border-sky-300 text-slate-600 transition-colors inline-block"
                        title="Launch CBT Preview"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
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
