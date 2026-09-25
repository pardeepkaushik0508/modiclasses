"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Video,
  ArrowLeft,
  Play,
  Clock,
  User,
  ShieldCheck,
  Lock,
  X,
  Sparkles,
  Maximize2,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Search,
} from "lucide-react";

export interface SerializedVideoLesson {
  id: string;
  title: string;
  fileUrl: string;
  isFree: boolean;
  createdAt: string;
  course: {
    id: string;
    title: string;
    slug: string;
  };
}

interface VideoClientProps {
  videos: SerializedVideoLesson[];
  enrolledCourseIds: string[];
  isAdmin: boolean;
}

// Helper to extract clean metadata from title
function parseVideoMeta(title: string) {
  let cleanTitle = title;
  let duration = "25 Mins";
  let instructor = "Five Education RDSO Mentor";
  let batteryTag = "RDSO Battery";

  // Check battery type
  const lower = title.toLowerCase();
  if (lower.includes("memory") || lower.includes("figure")) batteryTag = "Memory Battery";
  else if (lower.includes("clock") || lower.includes("direction")) batteryTag = "Direction Battery";
  else if (lower.includes("brick") || lower.includes("depth")) batteryTag = "Brick Battery";
  else if (lower.includes("concentration") || lower.includes("yes/no")) batteryTag = "Concentration Battery";
  else if (lower.includes("speed") || lower.includes("hexagonal")) batteryTag = "Perceptual Speed";
  else if (lower.includes("strategy") || lower.includes("cutoff")) batteryTag = "Strategy Masterclass";

  // Check parenthesized metadata e.g. "(24 Mins • Er. Sharma)"
  const match = title.match(/\((.*?)\)/);
  if (match && match[1]) {
    cleanTitle = title.replace(/\(.*?\)/, "").trim();
    const parts = match[1].split(/[•|]/).map((p) => p.trim());
    for (const part of parts) {
      if (part.toLowerCase().includes("min") || part.toLowerCase().includes("hr")) {
        duration = part;
      } else if (part.length > 2) {
        instructor = part;
      }
    }
  }

  return { cleanTitle, duration, instructor, batteryTag };
}

// Convert various video URLs into responsive embed URLs
function getEmbedUrl(url: string): { type: "embed" | "direct"; src: string } {
  if (!url) return { type: "embed", src: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" };

  // YouTube match
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "embed",
      src: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`,
    };
  }

  // Vimeo match
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "embed",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
    };
  }

  // Direct video file (mp4, webm)
  if (url.endsWith(".mp4") || url.endsWith(".webm") || url.startsWith("blob:") || url.includes("stream.")) {
    return { type: "direct", src: url };
  }

  // Fallback embed
  return { type: "embed", src: url };
}

export default function VideoClient({
  videos,
  enrolledCourseIds,
  isAdmin,
}: VideoClientProps) {
  const [selectedVideo, setSelectedVideo] = useState<SerializedVideoLesson | null>(null);
  const [batteryFilter, setBatteryFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const parsedVideos = useMemo(() => {
    return videos.map((v) => ({
      ...v,
      meta: parseVideoMeta(v.title),
    }));
  }, [videos]);

  const batteryCategories = useMemo(() => {
    const set = new Set<string>();
    set.add("All");
    parsedVideos.forEach((v) => set.add(v.meta.batteryTag));
    return Array.from(set);
  }, [parsedVideos]);

  const filteredVideos = useMemo(() => {
    return parsedVideos.filter((v) => {
      const matchesBattery =
        batteryFilter === "All" || v.meta.batteryTag === batteryFilter;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        v.title.toLowerCase().includes(q) ||
        v.meta.instructor.toLowerCase().includes(q) ||
        v.course.title.toLowerCase().includes(q);

      return matchesBattery && matchesSearch;
    });
  }, [parsedVideos, batteryFilter, searchQuery]);

  const activeVideoMeta = selectedVideo ? parseVideoMeta(selectedVideo.title) : null;
  const isSelectedVideoAccessible = selectedVideo
    ? selectedVideo.isFree || isAdmin || enrolledCourseIds.includes(selectedVideo.course.id)
    : false;

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
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-[#003366] border border-sky-200">
            <Video className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>HD CBT Masterclasses</span>
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
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Concept Clarity & Rapid Solution Tricks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            RDSO Psycho CBT Video Masterclasses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
            In-depth battery breakdowns, 30-second recall methods, compass tricks, and depth projection geometry by top psycho faculty.
          </p>
        </div>

        {/* Video count badge */}
        <div className="flex items-center gap-4 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200 shrink-0">
          <div className="text-center">
            <div className="text-xl font-black text-[#003366]">{videos.length}</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Masterclasses</div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-center">
            <div className="text-xl font-black text-emerald-600">Full HD</div>
            <div className="text-[10px] font-bold text-slate-500 uppercase">Quality</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {batteryCategories.map((cat) => {
            const isActive = batteryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setBatteryFilter(cat)}
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

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search class or instructor..."
            className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVideos.map((video) => {
          const isEnrolled = enrolledCourseIds.includes(video.course.id);
          const isAccessible = video.isFree || isAdmin || isEnrolled;

          return (
            <div
              key={video.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#003366] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#003366] border border-sky-100 uppercase tracking-wide">
                    {video.meta.batteryTag}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{video.meta.duration}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#003366] transition-colors">
                  {video.meta.cleanTitle}
                </h3>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Instructor: <strong className="text-slate-700">{video.meta.instructor}</strong></span>
                  </span>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                <div className="flex items-center gap-1.5">
                  {video.isFree ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Free Preview
                    </span>
                  ) : isAccessible ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      Enrolled Course
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Enrolled Access
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setSelectedVideo(video)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#003366] hover:bg-[#0284c7] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Class</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          EMBEDDED VIDEO PLAYER MODAL / DRAWER
          - Supports YouTube, Vimeo & Direct MP4
          - Candidate Access Guard & Lock Barrier
         ======================================================== */}
      {selectedVideo && activeVideoMeta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white">
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0284c7] text-white uppercase">
                  {activeVideoMeta.batteryTag}
                </span>
                <h3 className="font-bold text-sm sm:text-base text-slate-100 truncate">
                  {activeVideoMeta.cleanTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
                aria-label="Close video player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player or Locked Barrier */}
            <div className="relative aspect-video w-full bg-black flex items-center justify-center">
              {isSelectedVideoAccessible ? (
                (() => {
                  const media = getEmbedUrl(selectedVideo.fileUrl);
                  if (media.type === "direct") {
                    return (
                      <video
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                        src={media.src}
                      />
                    );
                  }
                  return (
                    <iframe
                      src={media.src}
                      title={activeVideoMeta.cleanTitle}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  );
                })()
              ) : (
                /* Locked Content Barrier */
                <div className="p-6 sm:p-12 text-center max-w-md space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-lg font-bold text-white">Premium Video Lesson Locked</h4>
                    <p className="text-xs text-slate-400">
                      This masterclass is part of <strong>{selectedVideo.course.title}</strong>. Enroll in the course to unlock all video modules, concept shortcuts, and practice drills.
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <Link
                      href="/#pricing"
                      className="px-5 py-2.5 rounded-lg bg-[#0284c7] hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2"
                    >
                      <span>Enroll in Course</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setSelectedVideo(null)}
                      className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Details */}
            <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-4">
                <span>
                  Instructor: <strong className="text-slate-200">{activeVideoMeta.instructor}</strong>
                </span>
                <span>•</span>
                <span>
                  Duration: <strong className="text-slate-200">{activeVideoMeta.duration}</strong>
                </span>
                <span>•</span>
                <span>
                  Course: <strong className="text-slate-200">{selectedVideo.course.title}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>256-Bit Encrypted Stream</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
