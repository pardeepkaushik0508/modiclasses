"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Home as HomeIcon,
  FileText,
  Video,
  BookOpen,
  Users,
  Gift,
  Award,
  Lock,
  GraduationCap,
  User,
  Settings,
  LogOut,
  Target,
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  Zap,
  Play,
  Download,
  Menu,
  X,
  Check,
  BarChart2,
  Copy,
  CheckCircle2,
  Share2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { Session } from "next-auth";

// ==============================================================
// DETAILED VECTOR ILLUSTRATIONS
// ==============================================================

function IndianRailwaysLocomotiveIllustration({ className = "w-44 h-36" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 170 L95 110 L145 110 L220 170" stroke="#475569" strokeWidth="3" />
      <line x1="45" y1="150" x2="195" y2="150" stroke="#334155" strokeWidth="2.5" />
      <line x1="65" y1="135" x2="175" y2="135" stroke="#334155" strokeWidth="2" />
      <line x1="80" y1="122" x2="160" y2="122" stroke="#334155" strokeWidth="1.5" />
      <line x1="50" y1="175" x2="105" y2="110" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="190" y1="175" x2="135" y2="110" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="120" y1="5" x2="120" y2="40" stroke="#94a3b8" strokeWidth="1.5" />
      <path d="M100 20 L120 40 L140 20" stroke="#cbd5e1" strokeWidth="2" fill="none" />
      <line x1="80" y1="20" x2="160" y2="20" stroke="#e2e8f0" strokeWidth="1.5" />
      <path
        d="M60 52 C60 48 64 45 68 45 L172 45 C176 45 180 48 180 52 L185 130 C185 133 182 136 178 136 L62 136 C58 136 55 133 55 130 Z"
        fill="#dc2626"
        stroke="#991b1b"
        strokeWidth="2"
      />
      <path d="M57 85 L183 85 L184 105 L56 105 Z" fill="#fef08a" />
      <line x1="57" y1="95" x2="183" y2="95" stroke="#ca8a04" strokeWidth="1" />
      <path d="M68 45 L172 45 L165 38 L75 38 Z" fill="#991b1b" />
      <rect x="70" y="55" width="45" height="24" rx="3" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
      <rect x="125" y="55" width="45" height="24" rx="3" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M72 57 L95 57 L75 77 L72 77 Z" fill="#38bdf8" fillOpacity="0.4" />
      <path d="M127 57 L150 57 L130 77 L127 77 Z" fill="#38bdf8" fillOpacity="0.4" />
      <circle cx="120" cy="95" r="7" fill="#b91c1c" stroke="#fef08a" strokeWidth="1.5" />
      <circle cx="120" cy="95" r="4" fill="#0284c7" />
      <circle cx="85" cy="115" r="5.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
      <circle cx="85" cy="115" r="3" fill="#ffffff" />
      <circle cx="155" cy="115" r="5.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
      <circle cx="155" cy="115" r="3" fill="#ffffff" />
      <polygon points="52,136 188,136 175,152 65,152" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
      <line x1="75" y1="136" x2="85" y2="152" stroke="#475569" strokeWidth="1.5" />
      <line x1="100" y1="136" x2="105" y2="152" stroke="#475569" strokeWidth="1.5" />
      <line x1="120" y1="136" x2="120" y2="152" stroke="#475569" strokeWidth="1.5" />
      <line x1="140" y1="136" x2="135" y2="152" stroke="#475569" strokeWidth="1.5" />
      <line x1="165" y1="136" x2="155" y2="152" stroke="#475569" strokeWidth="1.5" />
    </svg>
  );
}

function ModernLaptopIllustration({ className = "w-44 h-36" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="35" y="18" width="150" height="96" rx="8" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />
      <rect x="42" y="24" width="136" height="84" rx="4" fill="url(#screenGradClient)" />
      <circle cx="110" cy="66" r="18" fill="#ffffff" fillOpacity="0.2" stroke="#ffffff" strokeWidth="2" />
      <polygon points="105,57 121,66 105,75" fill="#ffffff" />
      <rect x="52" y="94" width="116" height="3" rx="1.5" fill="#ffffff" fillOpacity="0.3" />
      <rect x="52" y="94" width="55" height="3" rx="1.5" fill="#34d399" />
      <path d="M20 114 L200 114 L188 126 C186 128 183 129 180 129 L40 129 C37 129 34 128 32 126 Z" fill="#334155" />
      <defs>
        <linearGradient id="screenGradClient" x1="42" y1="24" x2="178" y2="108" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064e3b" />
          <stop offset="0.5" stopColor="#047857" />
          <stop offset="1" stopColor="#065f46" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function SpeedDrillIllustration({ className = "w-32 h-24" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="60" r="45" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
      <circle cx="80" cy="60" r="35" stroke="#818cf8" strokeWidth="1" strokeDasharray="4 4" />
      <polygon points="80,25 90,55 80,50 70,55" fill="#facc15" />
      <polygon points="80,95 90,65 80,70 70,65" fill="#38bdf8" />
      <line x1="35" y1="60" x2="125" y2="60" stroke="#94a3b8" strokeWidth="1.5" />
      <circle cx="80" cy="60" r="4" fill="#ffffff" />
    </svg>
  );
}

function MegaphoneSpeakerGraphic() {
  return (
    <svg className="w-20 h-20 sm:w-24 sm:h-24 drop-shadow-lg" viewBox="0 0 100 100" fill="none">
      <path d="M32 38 L68 18 C72 16 76 19 76 24 L76 76 C76 81 72 84 68 82 L32 62 Z" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
      <path d="M68 18 L76 24 L76 76 L68 82 Z" fill="#ef4444" />
      <path d="M32 38 L68 18 L68 82 L32 62 Z" fill="#3b82f6" />
      <rect x="18" y="38" width="14" height="24" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="2" />
      <rect x="22" y="42" width="6" height="16" rx="2" fill="#ef4444" />
      <path d="M26 62 L26 78 C26 81 29 84 32 84 L36 84 C39 84 42 81 42 78 L42 62" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
      <path d="M82 36 C86 42 86 58 82 64" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
      <path d="M88 28 C95 38 95 62 88 72" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function GoldenRupeeCoinsGraphic() {
  return (
    <svg className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md" viewBox="0 0 120 120" fill="none">
      <path d="M80 50 L105 25 M105 25 L92 25 M105 25 L105 38" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="40" cy="85" rx="28" ry="12" fill="#ca8a04" />
      <ellipse cx="40" cy="80" rx="28" ry="12" fill="#facc15" />
      <text x="35" y="85" fill="#854d0e" fontSize="13" fontWeight="bold">₹</text>
      <ellipse cx="40" cy="72" rx="28" ry="12" fill="#ca8a04" />
      <ellipse cx="40" cy="67" rx="28" ry="12" fill="#facc15" />
      <text x="35" y="72" fill="#854d0e" fontSize="13" fontWeight="bold">₹</text>
      <ellipse cx="78" cy="90" rx="24" ry="10" fill="#ca8a04" />
      <ellipse cx="78" cy="85" rx="24" ry="10" fill="#facc15" />
      <text x="73" y="90" fill="#854d0e" fontSize="12" fontWeight="bold">₹</text>
      <ellipse cx="78" cy="78" rx="24" ry="10" fill="#ca8a04" />
      <ellipse cx="78" cy="73" rx="24" ry="10" fill="#fde047" />
      <text x="73" y="78" fill="#854d0e" fontSize="12" fontWeight="bold">₹</text>
    </svg>
  );
}

function CommunityAvatarsIllustration() {
  return (
    <div className="flex -space-x-2 shrink-0">
      <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">R</div>
      <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">A</div>
      <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">P</div>
    </div>
  );
}

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  discountedPrice: number | null;
  features: string[];
  thumbnail: string | null;
}

interface AnnouncementItem {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  dateText: string;
}

export interface DashboardNotificationItem {
  id: string;
  type: "COURSE" | "TEST" | "MATERIAL" | "ANNOUNCEMENT";
  title: string;
  message: string;
  link: string;
  createdAt: string;
  formattedDate: string;
}

interface DashboardClientProps {
  courses: CourseItem[];
  announcements: AnnouncementItem[];
  notifications?: DashboardNotificationItem[];
  progressPercentage: number;
  completedCount: number;
  totalTestsCount: number;
  session: Session | null;
}

export default function DashboardClient({
  courses,
  announcements,
  notifications = [],
  progressPercentage,
  completedCount,
  totalTestsCount,
  session: initialSession,
}: DashboardClientProps) {
  const { data: clientSession, status } = useSession();

  // Seamless session state across SSR and Client hydration without mismatch:
  // - If client is authenticated, use clientSession
  // - If status is loading, fall back to initialSession passed from SSR
  // - If unauthenticated, session is null
  const activeSession =
    status === "authenticated"
      ? clientSession
      : status === "unauthenticated"
        ? null
        : initialSession;

  const currentUser = activeSession?.user;
  const isAuthenticated =
    status === "authenticated"
      ? true
      : status === "unauthenticated"
        ? false
        : !!initialSession?.user;

  const [activeNav, setActiveNav] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Notification State
  const [notifList, setNotifList] = useState<DashboardNotificationItem[]>(notifications || []);
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      setNotifList(notifications);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("five_edu_read_notifs");
      if (stored) {
        setReadNotifIds(new Set(JSON.parse(stored)));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Close notifications dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotifOpen]);

  const unreadCount = notifList.filter((n) => !readNotifIds.has(n.id)).length;

  const handleMarkAllRead = () => {
    const allIds = new Set(notifList.map((n) => n.id));
    setReadNotifIds(allIds);
    try {
      localStorage.setItem("five_edu_read_notifs", JSON.stringify(Array.from(allIds)));
    } catch {
      // Ignore
    }
  };

  const handleReadItem = (id: string) => {
    const next = new Set(readNotifIds);
    next.add(id);
    setReadNotifIds(next);
    try {
      localStorage.setItem("five_edu_read_notifs", JSON.stringify(Array.from(next)));
    } catch {
      // Ignore
    }
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // Accessible Modal States
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [closeGroupModalOpen, setCloseGroupModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Dynamic user details - completely removed dummy fallback
  const candidateName = currentUser?.name || "Candidate";
  const userEmail = currentUser?.email || "";
  const userInitials = (currentUser?.name ? currentUser.name.trim().charAt(0) : "U").toUpperCase();
  const referralLink = currentUser?.rollNo
    ? `https://fiveeducation.in/register?ref=${currentUser.rollNo}`
    : "https://fiveeducation.in/register";

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Filter courses dynamically based on search query
  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col antialiased text-slate-800">
      <div className="flex-1 flex w-full">
        {/* ========================================================
            1. PERSISTENT DARK BLUE LEFT SIDEBAR (#0b192e / #0f172a)
           ======================================================== */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0b192e] text-slate-300 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } shadow-2xl lg:shadow-none lg:static`}
        >
          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
            {/* Logo & Mobile Close */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-full bg-white text-[#0b192e] font-extrabold text-xl flex items-center justify-center shadow-md">
                  F
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-extrabold text-white tracking-tight leading-none">
                    Five Education
                  </span>
                </div>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Group 1 */}
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={() => {
                  setActiveNav("Home");
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeNav === "Home"
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
              >
                <HomeIcon className="w-4 h-4 shrink-0" />
                <span>Home</span>
              </Link>

              <Link
                href="/test/rdso-memory-figure-test-01?trial=true"
                onClick={() => {
                  setActiveNav("Test");
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeNav === "Test"
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Test</span>
              </Link>

              <Link
                href="/video"
                onClick={() => {
                  setActiveNav("Video");
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeNav === "Video"
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
              >
                <Video className="w-4 h-4 shrink-0" />
                <span>Video</span>
              </Link>

              <Link
                href="/study-material"
                onClick={() => {
                  setActiveNav("Study Material");
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeNav === "Study Material"
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
              >
                <BookOpen className="w-4 h-4 shrink-0" />
                <span>Study Material</span>
              </Link>

              <Link
                href="/groups"
                onClick={() => {
                  setActiveNav("Groups");
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all ${activeNav === "Groups"
                  ? "bg-[#1d4ed8] text-white shadow-md font-bold"
                  : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>Groups</span>
              </Link>
            </nav>

            {/* Navigation Group 2: Action items with colored pill badges */}
            <div className="pt-2 border-t border-slate-800/70 space-y-1">
              <button
                onClick={() => setReferModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <Gift className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Referral & Earn</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444] text-white uppercase tracking-wider">
                  New
                </span>
              </button>

              <Link
                href="/test/rdso-memory-figure-test-01?trial=true"
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <Award className="w-4 h-4 shrink-0 text-sky-400" />
                  <span>Trail Test</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b] text-white uppercase tracking-wider">
                  New
                </span>
              </Link>

              <button
                onClick={() => setCloseGroupModalOpen(true)}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <Lock className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>Close Group</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#dc2626] text-white uppercase tracking-wider">
                  Join
                </span>
              </button>
            </div>

            {/* Navigation Group 3: Account links */}
            <div className="pt-2 border-t border-slate-800/70 space-y-1">
              <Link
                href={isAuthenticated ? "/dashboard" : "/login?callbackUrl=/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
              >
                <GraduationCap className="w-4 h-4 shrink-0 text-slate-400" />
                <span>My Course</span>
              </Link>

              <Link
                href={isAuthenticated ? "/dashboard/profile" : "/login?callbackUrl=/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
              >
                <User className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Profile</span>
              </Link>

              <Link
                href={isAuthenticated ? "/dashboard/settings" : "/login?callbackUrl=/dashboard"}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
              >
                <Settings className="w-4 h-4 shrink-0 text-slate-400" />
                <span>Settings</span>
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-rose-400 hover:bg-slate-800/80 hover:text-rose-300 transition-all text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-sky-400 hover:bg-slate-800/80 hover:text-sky-300 transition-all"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Login / Register</span>
                </Link>
              )}
            </div>
          </div>

          {/* Bottom Badge Card: "Learn Today Lead Tomorrow" */}
          <div className="p-4 border-t border-slate-800/60 bg-[#071120]">
            <div className="rounded-xl border border-slate-700/80 p-3 bg-gradient-to-b from-slate-900 to-[#071120] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
                <Target className="w-5 h-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-bold text-white tracking-tight">
                  Learn Today
                </span>
                <span className="text-[11px] font-bold text-slate-300 tracking-tight">
                  Lead Tomorrow
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-white text-[#0b192e] text-[8px] font-bold flex items-center justify-center">
                    F
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">
                    Five Education
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          />
        )}

        {/* ========================================================
            2. MAIN CONTENT + RIGHT WIDGETS COLUMN
           ======================================================== */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* TOP BAR & SEARCH AREA */}
          <header className="bg-white border-b border-slate-200/90 px-4 sm:px-8 py-3 sticky top-0 z-30 shadow-2xs">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0b192e] text-white font-extrabold text-base flex items-center justify-center shadow-xs">
                    F
                  </div>
                  <span className="text-base font-extrabold text-slate-900 tracking-tight">
                    Five Education
                  </span>
                </div>
              </div>

              {/* Middle Search Bar: Desktop Centered (Hidden on Mobile) */}
              <div className="hidden md:flex flex-1 max-w-xl mx-2 sm:mx-6">
                <div className="relative w-full">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for courses, tests, videos, study material..."
                    className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full border border-slate-200 bg-slate-50/70 hover:bg-slate-50 focus:bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 focus:border-[#1d4ed8] transition-all"
                  />
                </div>
              </div>

              {/* Top-Right: Notification Bell & Profile / Auth Actions */}
              <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                {/* Functional Notification Bell Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    title="Notifications"
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer relative"
                    aria-label="View notifications"
                    aria-expanded={isNotifOpen}
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                    )}
                  </button>

                  {/* Interactive Notification Dropdown Panel */}
                  {isNotifOpen && (
                    <div className="absolute right-0 mt-2 w-74 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/90">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Latest Activity & Updates</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] shrink-0 font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                              {unreadCount} New
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-[11px] font-bold text-[#1d4ed8] hover:text-blue-800 hover:underline cursor-pointer"
                          >
                            Mark all as read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifList.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">
                            <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-xs font-semibold text-slate-600">No new notifications</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">You are all caught up with latest courses & tests.</p>
                          </div>
                        ) : (
                          notifList.map((notif) => {
                            const isRead = readNotifIds.has(notif.id);
                            const badgeIcon =
                              notif.type === "COURSE" ? (
                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                                  <BookOpen className="w-4 h-4" />
                                </div>
                              ) : notif.type === "TEST" ? (
                                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
                                  <Target className="w-4 h-4" />
                                </div>
                              ) : notif.type === "MATERIAL" ? (
                                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                                  <Sparkles className="w-4 h-4" />
                                </div>
                              );

                            return (
                              <Link
                                key={notif.id}
                                href={notif.link || "/"}
                                onClick={() => {
                                  handleReadItem(notif.id);
                                  setIsNotifOpen(false);
                                }}
                                className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors block ${isRead ? "opacity-75 bg-white" : "bg-blue-50/20"
                                  }`}
                              >
                                {badgeIcon}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <p className="text-xs font-bold text-slate-900 truncate">{notif.title}</p>
                                    {!isRead && (
                                      <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
                                    {notif.message}
                                  </p>
                                  <span className="text-[10px] text-slate-400 font-medium mt-1 inline-block">
                                    {notif.formattedDate}
                                  </span>
                                </div>
                              </Link>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {isAuthenticated ? (
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-full sm:rounded-lg hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                      aria-expanded={isProfileOpen}
                      aria-haspopup="true"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#0b192e] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-500/20">
                        {userInitials}
                      </div>
                      <span className="hidden sm:inline text-xs font-bold text-slate-800 max-w-[120px] truncate">
                        {candidateName}
                      </span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-4 py-2.5 border-b border-slate-100">
                          <p className="text-xs font-bold text-slate-900 truncate">
                            {candidateName}
                          </p>
                          {userEmail && (
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">
                              {userEmail}
                            </p>
                          )}
                        </div>
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                          <span>My Course</span>
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <Settings className="w-3.5 h-3.5 text-slate-400" />
                          <span>Settings</span>
                        </Link>
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            signOut({ callbackUrl: "/login" });
                          }}
                          className="w-full flex items-center gap-2.5 text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <Link
                      href="/login"
                      className="px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 transition-all shadow-xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg text-xs font-bold text-white bg-[#1d4ed8] hover:bg-blue-700 transition-all shadow-xs"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Second Row: Separate Full-Width Search Input (< md) */}
            <div className="block md:hidden w-full mt-2.5 pt-1 pb-0.5">
              <div className="relative w-full">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for courses, tests, videos, study material..."
                  className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/90 focus:bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1d4ed8]/30 focus:border-[#1d4ed8] transition-all"
                />
              </div>
            </div>
          </header>

          {/* MAIN GRID BODY: CENTER CONTENT + RIGHT WIDGETS */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* ========================================================
                  3. CENTER CONTENT SECTION (xl:col-span-8)
                 ======================================================== */}
              <div className="xl:col-span-8 space-y-6">
                {/* Welcome Greeting */}
                <div className="space-y-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Welcome to <span className="text-[#1d4ed8]">Five Education</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">
                    Your Preparation • Our Support • Your Success
                  </p>
                </div>

                {/* Top Featured Cards: Rendered dynamically from PostgreSQL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCourses.slice(0, 2).map((course, idx) => {
                    const isCourse1 = idx === 0;
                    return (
                      <div
                        key={course.id}
                        className={`rounded-2xl border p-5 text-white shadow-sm flex flex-col justify-between relative overflow-hidden ${isCourse1
                          ? "bg-gradient-to-br from-[#0c2340] via-[#0f172a] to-[#0284c7]/20 border-slate-800"
                          : "bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#047857]/20 border-emerald-900/60"
                          }`}
                      >
                        <div className="space-y-3 z-10">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-[#facc15] text-slate-900 uppercase tracking-wide">
                            Course No. {idx + 1}
                          </span>

                          <h2 className="text-xl font-extrabold text-white tracking-tight">
                            {course.title.replace(/^Course No\. \d+:\s*/i, "")}
                          </h2>

                          {/* Dynamic Features Checklist from DB */}
                          <ul className="space-y-1.5 text-xs text-slate-200">
                            {course.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-[#facc15] stroke-[3]" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 flex items-end justify-between z-10">
                          <Link
                            href="/test/rdso-memory-figure-test-01?trial=true"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-bold text-xs shadow transition-colors"
                          >
                            <span>Start Now</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>

                          <div className="w-32 h-24 shrink-0 -mr-2 -mb-2">
                            {isCourse1 ? (
                              <IndianRailwaysLocomotiveIllustration className="w-full h-full" />
                            ) : (
                              <ModernLaptopIllustration className="w-full h-full" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Large Promo Banner ("REFER & EARN") */}
                <div className="rounded-2xl bg-gradient-to-r from-[#4f46e5] via-[#3b82f6] to-[#2563eb] text-white p-5 sm:p-6 shadow-md relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
                    <div className="flex items-center gap-3">
                      <MegaphoneSpeakerGraphic />
                      <div className="flex flex-col">
                        <span className="text-xl sm:text-2xl font-black text-white tracking-wider leading-none drop-shadow">
                          REFER
                        </span>
                        <span className="text-xl sm:text-2xl font-black text-[#facc15] tracking-wider leading-none drop-shadow">
                          & EARN
                        </span>
                      </div>
                    </div>

                    <div className="text-center sm:text-left space-y-1">
                      <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                        Invite Your Friends
                      </h3>
                      <p className="text-xs text-sky-100">
                        Get Rewarded for Every Successful Join
                      </p>
                      <div className="pt-1">
                        <button
                          onClick={() => setReferModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-extrabold text-xs shadow cursor-pointer transition-colors"
                        >
                          <span>Refer Now</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <GoldenRupeeCoinsGraphic />
                    </div>
                  </div>
                </div>

                {/* "Our Courses" Section: Dynamic Stacking Downwards from DB */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Our Courses ({filteredCourses.length})
                    </h2>
                    <Link
                      href="/dashboard"
                      className="text-xs font-bold text-[#1d4ed8] hover:underline flex items-center gap-1"
                    >
                      <span>View All Courses</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Dynamic grid where any number of courses automatically stack downwards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCourses.map((course, cIdx) => {
                      const isBlueTheme = cIdx % 3 === 0;
                      const isGreenTheme = cIdx % 3 === 1;

                      return (
                        <div
                          key={course.id}
                          className={`rounded-2xl border p-5 shadow-2xs flex flex-col justify-between ${isBlueTheme
                            ? "bg-[#f0f7ff] border-blue-200/80"
                            : isGreenTheme
                              ? "bg-[#f0fdf4] border-emerald-200/80"
                              : "bg-[#fdf4ff] border-purple-200/80"
                            }`}
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white ${isBlueTheme
                                  ? "bg-[#1d4ed8]"
                                  : isGreenTheme
                                    ? "bg-[#059669]"
                                    : "bg-purple-700"
                                  }`}
                              >
                                Course {cIdx + 1}
                              </span>

                              <div className="flex items-center gap-1 text-xs">
                                {course.discountedPrice && (
                                  <span className="text-slate-400 line-through">
                                    ₹{course.price}
                                  </span>
                                )}
                                <span className="font-extrabold text-slate-900">
                                  ₹{course.discountedPrice || course.price}
                                </span>
                              </div>
                            </div>

                            <h3 className="text-base font-extrabold text-slate-900">
                              {course.title.replace(/^Course No\. \d+:\s*/i, "")}
                            </h3>

                            <ul className="space-y-1 text-xs text-slate-600">
                              {course.features.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-center gap-2">
                                  <Check
                                    className={`w-3.5 h-3.5 stroke-[3] ${isBlueTheme
                                      ? "text-[#1d4ed8]"
                                      : isGreenTheme
                                        ? "text-[#059669]"
                                        : "text-purple-700"
                                      }`}
                                  />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-4 flex items-end justify-between">
                            <Link
                              href="/test/rdso-memory-figure-test-01?trial=true"
                              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white font-bold text-xs shadow-xs transition-colors ${isBlueTheme
                                ? "bg-[#1d4ed8] hover:bg-blue-700"
                                : isGreenTheme
                                  ? "bg-[#059669] hover:bg-emerald-700"
                                  : "bg-purple-700 hover:bg-purple-800"
                                }`}
                            >
                              <span>Explore Course</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                            <div className="w-24 h-16 shrink-0">
                              {isBlueTheme ? (
                                <IndianRailwaysLocomotiveIllustration className="w-full h-full" />
                              ) : isGreenTheme ? (
                                <ModernLaptopIllustration className="w-full h-full" />
                              ) : (
                                <SpeedDrillIllustration className="w-full h-full" />
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* "Latest Updates" Strip: Dynamic from DB Announcements */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-blue-100 text-[#1d4ed8]">
                      <Zap className="w-3.5 h-3.5" />
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                      Latest Updates
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {announcements.map((ann) => {
                      const isTest = ann.category === "TEST";
                      const isVideo = ann.category === "VIDEO";
                      const isMaterial = ann.category === "MATERIAL";

                      return (
                        <div
                          key={ann.id}
                          className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs space-y-2 hover:border-slate-300 transition-colors"
                        >
                          <div
                            className={`w-8 h-8 rounded-full text-white flex items-center justify-center ${isTest
                              ? "bg-indigo-600"
                              : isVideo
                                ? "bg-rose-500"
                                : isMaterial
                                  ? "bg-emerald-600"
                                  : "bg-purple-600"
                              }`}
                          >
                            {isTest ? (
                              <FileText className="w-4 h-4" />
                            ) : isVideo ? (
                              <Play className="w-3.5 h-3.5 fill-current" />
                            ) : isMaterial ? (
                              <BookOpen className="w-4 h-4" />
                            ) : (
                              <Users className="w-4 h-4" />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-[11px] font-bold text-slate-900 leading-snug">
                              {ann.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 leading-tight">
                              {ann.subtitle}
                            </p>
                          </div>
                          <div className="text-[9px] font-semibold text-slate-400">
                            {ann.dateText}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ========================================================
                  4. RIGHT WIDGETS COLUMN (xl:col-span-4)
                 ======================================================== */}
              <div className="xl:col-span-4 space-y-4">
                {/* Dynamic "My Progress" Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart2 className="w-4 h-4 text-[#1d4ed8]" />
                      <h3 className="text-sm font-extrabold text-slate-900">My Progress</h3>
                    </div>
                    {isAuthenticated && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        {completedCount} / {totalTestsCount} Completed
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-600 font-medium">Overall Learning Progress</span>
                      <span className="font-extrabold text-slate-900">{progressPercentage}%</span>
                    </div>

                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-[#1d4ed8] h-full rounded-full transition-all duration-700"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* "Quick Actions" Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#1d4ed8]" />
                    <h3 className="text-sm font-extrabold text-slate-900">Quick Actions</h3>
                  </div>

                  <div className="space-y-2">
                    <Link
                      href="/test/rdso-memory-figure-test-01?trial=true"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-[#1d4ed8] transition-colors">
                            Start a Test
                          </div>
                          <div className="text-[10px] text-slate-500">Practice and improve</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1d4ed8] transition-colors" />
                    </Link>

                    <Link
                      href="/video"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Video className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                            Watch Video
                          </div>
                          <div className="text-[10px] text-slate-500">Learn from expert teachers</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    </Link>

                    <Link
                      href="/study-material"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <Download className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                            Download Study Material
                          </div>
                          <div className="text-[10px] text-slate-500">Notes, PDFs & E-Books</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                    </Link>

                    <Link
                      href="/groups"
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 border border-slate-100 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                            Join Group
                          </div>
                          <div className="text-[10px] text-slate-500">Be a part of our community</div>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-colors" />
                    </Link>
                  </div>
                </div>

                {/* Promo Card 1: Trail Test */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs relative overflow-hidden space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">Trail Test</h4>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Take free trail tests & check your level
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#1d4ed8] text-white uppercase tracking-wider transform rotate-12 shadow-xs">
                      FREE
                    </span>
                  </div>

                  <div className="pt-1">
                    <Link
                      href="/test/rdso-memory-figure-test-01?trial=true"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                    >
                      <span>Start Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Promo Card 2: Referral & Earn */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <Gift className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">Referral & Earn</h4>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Invite friends and earn rewards
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => setReferModalOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      <span>Refer Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <CommunityAvatarsIllustration />
                  </div>
                </div>

                {/* Promo Card 3: Close Group */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">Close Group</h4>
                        <p className="text-[10px] text-slate-500 leading-tight">
                          Exclusive access for serious learners
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    <button
                      onClick={() => setCloseGroupModalOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white text-[11px] font-bold shadow-xs cursor-pointer transition-colors"
                    >
                      <span>Join Now</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <CommunityAvatarsIllustration />
                  </div>
                </div>
              </div>
            </div>
          </main>

          {/* 5. FOOTER */}
          <footer className="bg-transparent border-t border-slate-200/60 py-4 px-4 sm:px-8 mt-auto text-[11px] text-slate-500">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>&copy; {new Date().getFullYear()} Five Education. All rights reserved.</p>
              <div className="flex items-center gap-4 text-slate-600">
                <Link href="/" className="hover:text-slate-900">Help</Link>
                <span>|</span>
                <Link href="/" className="hover:text-slate-900">Terms & Conditions</Link>
                <span>|</span>
                <Link href="/" className="hover:text-slate-900">Privacy Policy</Link>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* ========================================================
          ACCESSIBLE MODAL 1: REFERRAL & EARN DIALOG
         ======================================================== */}
      {referModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-[#4f46e5] to-[#2563eb] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-300" />
                <h3 className="font-extrabold text-base">Referral & Earn Rewards</h3>
              </div>
              <button
                onClick={() => setReferModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600">
              <p>
                Share your personal Five Education referral link with fellow RRB aspirants. When they join, both of you receive <strong>5 Free Psycho Mock Tests</strong> and <strong>₹200 Course Credits</strong>.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Your Unique Referral Link
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3.5 py-2 rounded-lg bg-[#1d4ed8] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                  >
                    {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? "Copied!" : "Copy"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setReferModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ACCESSIBLE MODAL 2: CLOSE GROUP ENROLLMENT DIALOG
         ======================================================== */}
      {closeGroupModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-200" />
                <h3 className="font-extrabold text-base">Close Group Exclusive Access</h3>
              </div>
              <button
                onClick={() => setCloseGroupModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-600">
              <p>
                The <strong>Five Education Close Group</strong> is an invite-only cohort reserved for candidates preparing for Indian Railways RRB ALP & Station Master Aptitude batteries.
              </p>

              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 space-y-2 text-rose-900">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-rose-600" />
                  <span>Member Privileges</span>
                </div>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-rose-800">
                  <li>Daily Live Strategy Sessions with Ex-RDSO Psychologists</li>
                  <li>Real-time Doubt Clearing for Memory & Clock Batteries</li>
                  <li>Weekly Ranking Normalized on Official 42.0 Cutoff Formulas</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setCloseGroupModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs cursor-pointer"
              >
                Cancel
              </button>
              <Link
                href="/groups"
                onClick={() => setCloseGroupModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-[#ef4444] hover:bg-red-600 text-white font-bold text-xs cursor-pointer"
              >
                Proceed to Groups Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
