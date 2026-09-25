import Link from "next/link";
import { Video, ArrowLeft, Play, Clock, Sparkles, BookOpen } from "lucide-react";

export default function VideoClassesPage() {
  const videoLessons = [
    {
      id: "v-1",
      title: "Battery 1: Memory Figures Association & 30-Second Recall Method",
      duration: "24 Mins",
      instructor: "Er. Sharma (Ex-RDSO Mentor)",
      category: "Memory Battery",
      isFree: true,
    },
    {
      id: "v-2",
      title: "Battery 2: Clock Direction & Compass Angle Rapid Solution Tricks",
      duration: "18 Mins",
      instructor: "Rajesh Kumar (ALP 1st Ranker)",
      category: "Direction Battery",
      isFree: true,
    },
    {
      id: "v-3",
      title: "Battery 3: 3D Brick Depth Perception & Hidden Block Counting",
      duration: "32 Mins",
      instructor: "Er. Sharma (Ex-RDSO Mentor)",
      category: "Brick Battery",
      isFree: false,
    },
    {
      id: "v-4",
      title: "Battery 4 & 5: Concentration (Yes/No) & Perceptual Speed Drills",
      duration: "28 Mins",
      instructor: "Dr. A. Verma",
      category: "Speed Battery",
      isFree: false,
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
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-[#0284c7]">
          4 HD Masterclasses Available
        </span>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <Video className="w-6 h-6 text-[#1d4ed8]" />
          <span>RDSO Psycho CBT Video Masterclasses</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Concept clarity, shortcut mapping tricks, and full battery walkthroughs by top psycho experts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {videoLessons.map((lesson) => (
          <div
            key={lesson.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#1d4ed8] transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                  {lesson.category}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {lesson.duration}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {lesson.title}
              </h3>
              <p className="text-xs text-slate-500">
                Instructor: <strong className="text-slate-700">{lesson.instructor}</strong>
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                lesson.isFree ? "bg-emerald-50 text-emerald-700" : "bg-indigo-50 text-indigo-700"
              }`}>
                {lesson.isFree ? "Free Preview" : "Enrolled Course"}
              </span>

              <Link
                href="/test/rdso-memory-figure-test-01?trial=true"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Watch Class</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
