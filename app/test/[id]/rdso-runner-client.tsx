"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Clock,
  Pause,
  Play,
  Maximize2,
  Minimize2,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  User,
  ChevronLeft,
  ChevronRight,
  Shield,
  Save,
  RotateCcw,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Award,
  Eye,
  LogOut,
} from "lucide-react";
import { submitTestAttemptAction, SubmissionResult } from "../actions";
import type { Session } from "next-auth";

// ==============================================================
// 1. PI EDUCATION OFFICIAL CREST LOGO SVG
// ==============================================================
function PiEducationCrest({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Laurel Shield / Circle */}
      <circle cx="50" cy="50" r="46" stroke="#003366" strokeWidth="3" fill="#ffffff" />
      <circle cx="50" cy="50" r="41" stroke="#d97706" strokeWidth="1.5" fill="#f8fafc" />
      {/* Inner Crest Shield */}
      <path
        d="M50 16 L76 26 V52 C76 68 64 80 50 85 C36 80 24 68 24 52 V26 Z"
        fill="#003366"
        stroke="#d97706"
        strokeWidth="1.5"
      />
      {/* Golden Pi Symbol π */}
      <text
        x="50"
        y="58"
        fill="#f59e0b"
        fontSize="34"
        fontWeight="bold"
        fontFamily="serif"
        textAnchor="middle"
      >
        &pi;
      </text>
      {/* Crest Stars */}
      <circle cx="38" cy="72" r="2" fill="#fef08a" />
      <circle cx="50" cy="75" r="2.5" fill="#fef08a" />
      <circle cx="62" cy="72" r="2" fill="#fef08a" />
    </svg>
  );
}

// ==============================================================
// 2. INDIAN RAILWAYS OFFICIAL CREST EMBLEM SVG
// ==============================================================
function IndianRailwaysEmblem({ className = "w-11 h-11" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="46" stroke="#991b1b" strokeWidth="4" fill="#ffffff" />
      <circle cx="50" cy="50" r="42" stroke="#d97706" strokeWidth="1.5" fill="none" />
      <circle cx="50" cy="50" r="32" fill="#003366" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <rect
          key={deg}
          x="48"
          y="15"
          width="4"
          height="6"
          fill="#d97706"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="22" fill="#ffffff" />
      <path
        d="M38 52h24v6H38z M41 44h18v7H41z M45 37h10v6H45z M36 58h28v4H36z"
        fill="#991b1b"
      />
      <circle cx="43" cy="62" r="3.5" fill="#1e293b" />
      <circle cx="50" cy="62" r="3.5" fill="#1e293b" />
      <circle cx="57" cy="62" r="3.5" fill="#1e293b" />
      <path d="M22 50 A28 28 0 0 1 78 50" stroke="#d97706" strokeWidth="1" fill="none" />
    </svg>
  );
}

// ==============================================================
// 3. INDIAN RAILWAYS ELECTRIC LOCOMOTIVE (WAP-7 BANNER SVG)
// ==============================================================
function IndianRailwaysTrainBanner() {
  return (
    <div className="hidden lg:flex items-center h-14 w-60 bg-gradient-to-r from-sky-900 to-indigo-950 rounded-lg p-1.5 shadow-inner border border-sky-700/50 overflow-hidden relative">
      <svg className="w-full h-full" viewBox="0 0 260 64" fill="none">
        <line x1="0" y1="10" x2="260" y2="10" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="0" y1="14" x2="260" y2="14" stroke="#cbd5e1" strokeWidth="1.5" />
        <path d="M120 14 L135 24 L150 14" stroke="#e2e8f0" strokeWidth="1.5" fill="none" />
        <line x1="135" y1="24" x2="135" y2="28" stroke="#f59e0b" strokeWidth="2" />
        <path
          d="M30 28 h180 c8 0 14 4 18 12 l8 14 c2 3 0 6 -4 6 H20 c-4 0 -6 -3 -4 -6 l6 -14 c4 -8 10 -12 18 -12 z"
          fill="#f8fafc"
          stroke="#0284c7"
          strokeWidth="1.5"
        />
        <path d="M22 46 h216 v7 H22 z" fill="#0284c7" />
        <path d="M25 53 h210 v3 H25 z" fill="#dc2626" />
        <path d="M205 32 l18 10 h-28 v-10 z" fill="#0f172a" />
        <rect x="160" y="32" width="24" height="9" rx="2" fill="#0f172a" />
        <rect x="125" y="32" width="24" height="9" rx="2" fill="#0f172a" />
        <rect x="90" y="32" width="24" height="9" rx="2" fill="#0f172a" />
        <circle cx="236" cy="46" r="3" fill="#fef08a" />
        <path d="M239 46 L260 40 L260 52 Z" fill="#fef08a" fillOpacity="0.25" />
        <rect x="40" y="58" width="55" height="5" fill="#334155" />
        <circle cx="50" cy="60" r="3.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="68" cy="60" r="3.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="85" cy="60" r="3.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <rect x="150" y="58" width="55" height="5" fill="#334155" />
        <circle cx="160" cy="60" r="3.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="178" cy="60" r="3.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <circle cx="195" cy="60" r="3.5" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
        <text x="50" y="42" fill="#0369a1" fontSize="9" fontWeight="bold" fontFamily="monospace">
          WAP-7 &bull; IR
        </text>
      </svg>
    </div>
  );
}

// Data Interfaces
export interface QuestionData {
  id: string;
  questionNo: number;
  questionImageUrl: string | null;
  optionsJson: any; // [{ id: "A", label: "A", image?: string }]
  correctOption: string;
  marks: number;
}

export interface SectionData {
  id: string;
  title: string;
  phaseType: "STUDY_PHASE" | "QUESTION_PHASE";
  durationSeconds: number;
  order: number;
  instructions: string | null;
  studyImageUrl: string | null;
  questions: QuestionData[];
}

export interface TestData {
  id: string;
  title: string;
  slug: string;
  batteryType: string;
  totalDurationSeconds: number;
  passingScore: number;
  sections: SectionData[];
}

interface RDSOExamRunnerClientProps {
  test: TestData;
  session: Session | null;
}

type PhaseState = "STUDY_PHASE" | "PHASE_TRANSITION" | "QUESTION_PHASE" | "RESULT_MODAL";

export default function RDSOExamRunnerClient({
  test,
  session,
}: RDSOExamRunnerClientProps) {
  const router = useRouter();

  // Find Study Phase Section and Question Phase Section
  const studySection = test.sections.find((s) => s.phaseType === "STUDY_PHASE");
  const questionSections = test.sections.filter((s) => s.phaseType === "QUESTION_PHASE");
  const defaultQuestionSection = questionSections[0] || test.sections[0];

  const hasStudyPhase = Boolean(studySection);

  // Active section tab index
  const [activeSectionId, setActiveSectionId] = useState<string>(
    hasStudyPhase && studySection ? studySection.id : defaultQuestionSection.id
  );

  // Finite State Machine: Starts in STUDY_PHASE if configured, else QUESTION_PHASE
  const [phaseState, setPhaseState] = useState<PhaseState>(
    hasStudyPhase ? "STUDY_PHASE" : "QUESTION_PHASE"
  );

  // Security: Study Image URL kept in state and destroyed completely on phase transition
  const [studyImageUrl, setStudyImageUrl] = useState<string | null>(
    studySection?.studyImageUrl || "/tests/memory/set-1-study-chart.png"
  );

  // Transition countdown timer (3 seconds)
  const [transitionSeconds, setTransitionSeconds] = useState(3);

  // Independent Phase Timers
  const initialStudyDuration = studySection?.durationSeconds || 240;
  const initialQuestionDuration = defaultQuestionSection?.durationSeconds || test.totalDurationSeconds || 240;

  const [studyTimeLeft, setStudyTimeLeft] = useState(initialStudyDuration);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(initialQuestionDuration);

  // Timer controls
  const [isPaused, setIsPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Zoom control: 80% vs 100%
  const [zoomLevel, setZoomLevel] = useState<"80" | "100">("100");

  // Candidate Response State: { [questionId]: "A" | "B" | "C" | "D" | "E" }
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  // UI Modals
  const [showInstructions, setShowInstructions] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Final Result State
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);

  // Candidate info
  const candidateName = session?.user?.name || "Guest Candidate";
  const rollNo = session?.user?.rollNo || "FE-DEMO-420";
  const avatarUrl = (session?.user as any)?.avatarUrl || null;

  // Active question section based on activeSectionId
  const currentSection =
    test.sections.find((s) => s.id === activeSectionId) || defaultQuestionSection;
  const questionsList = currentSection?.questions || defaultQuestionSection?.questions || [];

  // Tabs list for horizontal navigation
  const tabList = test.sections.map((sec, idx) => {
    let label = sec.title;
    if (sec.phaseType === "STUDY_PHASE") {
      label = `Test ${idx + 1}- Memory Test (i)`;
    } else {
      label = `Test ${idx + 1}- Memory Test (${idx === 1 ? "ii" : "iii"})`;
    }
    return {
      id: sec.id,
      label,
      phaseType: sec.phaseType,
    };
  });

  // ==============================================================
  // 1. TIMER EFFECTS & FINITE STATE MACHINE TRANSITIONS
  // ==============================================================

  // Study Phase Timer
  useEffect(() => {
    if (phaseState !== "STUDY_PHASE" || isPaused) return;

    if (studyTimeLeft <= 0) {
      // Security: Destroy study image from state immediately
      setStudyImageUrl(null);
      setPhaseState("PHASE_TRANSITION");
      setTransitionSeconds(3);
      return;
    }

    const timer = setInterval(() => {
      setStudyTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Destroy study image
          setStudyImageUrl(null);
          setPhaseState("PHASE_TRANSITION");
          setTransitionSeconds(3);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseState, isPaused, studyTimeLeft]);

  // Phase Transition Effect (3 seconds countdown)
  useEffect(() => {
    if (phaseState !== "PHASE_TRANSITION") return;

    const timer = setInterval(() => {
      setTransitionSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Switch to Question Phase and set active section to Question Section
          setPhaseState("QUESTION_PHASE");
          if (defaultQuestionSection) {
            setActiveSectionId(defaultQuestionSection.id);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseState, defaultQuestionSection]);

  // Question Phase Timer
  useEffect(() => {
    if (phaseState !== "QUESTION_PHASE" || isPaused) return;

    if (questionTimeLeft <= 0) {
      handleFinalSubmit();
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phaseState, isPaused, questionTimeLeft]);

  // Timer formatter (mm:ss)
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(Math.max(0, totalSeconds) / 60);
    const secs = Math.max(0, totalSeconds) % 60;
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${pad(mins)}:${pad(secs)}`;
  };

  // Full Screen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => console.log(e));
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((e) => console.log(e));
        setIsFullscreen(false);
      }
    }
  };

  // Option selection handler - Strictly changes only the radio state
  const handleSelectOption = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  // Clear single question response
  const handleClearResponse = (questionId: string) => {
    setAnswers((prev) => {
      const copy = { ...prev };
      delete copy[questionId];
      return copy;
    });
  };

  // Save progress toast
  const handleSave = () => {
    const count = Object.keys(answers).length;
    setSavedNotification(`Saved ${count} responses successfully!`);
    setTimeout(() => setSavedNotification(null), 3000);
  };

  // Submit test attempt to PostgreSQL via Server Action
  const handleFinalSubmit = async () => {
    setShowConfirmSubmit(false);
    setIsSubmitting(true);

    try {
      const responsePayload = questionsList.map((q) => ({
        questionId: q.id,
        selectedOption: answers[q.id] || null,
        timeSpentSeconds: 0,
      }));

      const result = await submitTestAttemptAction({
        testId: test.id,
        responses: responsePayload,
      });

      setSubmissionResult(result);
      setPhaseState("RESULT_MODAL");
    } catch (err: any) {
      alert("Submission error: " + (err.message || "Failed to submit test."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tab navigation handler
  const handleTabClick = (tabId: string) => {
    if (phaseState === "STUDY_PHASE") {
      alert("अध्ययन चरण सक्रिय है। समय समाप्त होने से पहले आप प्रश्न पृष्ठ पर नहीं जा सकते।");
      return;
    }
    setActiveSectionId(tabId);
  };

  const handleNextTab = () => {
    if (phaseState === "STUDY_PHASE") return;
    const currentIdx = tabList.findIndex((t) => t.id === activeSectionId);
    if (currentIdx < tabList.length - 1) {
      setActiveSectionId(tabList[currentIdx + 1].id);
    }
  };

  const handlePrevTab = () => {
    if (phaseState === "STUDY_PHASE") return;
    const currentIdx = tabList.findIndex((t) => t.id === activeSectionId);
    if (currentIdx > 0) {
      setActiveSectionId(tabList[currentIdx - 1].id);
    }
  };

  // Stats calculation
  const totalQuestionsCount = questionsList.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQuestionsCount - answeredCount;

  // Active time for the current phase
  const currentSecondsLeft =
    phaseState === "STUDY_PHASE" ? studyTimeLeft : questionTimeLeft;
  const isTimeCritical = currentSecondsLeft <= 60;

  return (
    <div
      className={`min-h-screen bg-[#f1f5f9] select-none text-slate-800 font-sans flex flex-col ${
        zoomLevel === "80" ? "origin-top scale-[0.85] w-[117.6%]" : "w-full"
      } transition-transform duration-150`}
    >
      {/* Toast Notification */}
      {savedNotification && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{savedNotification}</span>
        </div>
      )}

      {/* ========================================================
          1. TOP EXAM HEADER (OFFICIAL RDSO CBT HEADER)
         ======================================================== */}
      <header className="bg-[#e2e8f0] border-b-2 border-[#cbd5e1] px-3 sm:px-6 py-2 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left: Pi Education Crest Logo AND Indian Railways Official Crest */}
          <div className="flex items-center gap-3 shrink-0">
            <PiEducationCrest className="w-11 h-11 shrink-0 drop-shadow-xs" />
            <IndianRailwaysEmblem className="w-11 h-11 shrink-0 drop-shadow-xs" />
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold text-[#003366] tracking-tight leading-none uppercase">
                Five Education &bull; RDSO CBT Engine
              </span>
              <span className="text-[10px] text-slate-600 font-bold mt-1">
                Indian Railways Aptitude Assessment System
              </span>
            </div>
          </div>

          {/* Center: Bilingual Examination Title */}
          <div className="hidden md:flex flex-col items-center text-center">
            <h1 className="text-sm lg:text-base font-extrabold text-[#003366] tracking-tight leading-snug">
              रेलवे भर्ती बोर्ड | RAILWAY RECRUITMENT BOARD
            </h1>
            <p className="text-[11px] font-bold text-slate-700">
              सी ई एन आर आर बी - 01/2024 &bull; CEN RRB - 01/2024
            </p>
            <p className="text-[10px] font-semibold text-rose-700">
              RRB ALP Aptitude Test
            </p>
          </div>

          {/* Right: Electric Locomotive Graphic Banner */}
          <div className="flex items-center gap-2">
            <IndianRailwaysTrainBanner />
          </div>
        </div>
      </header>

      {/* ========================================================
          2. EXAM STATUS & CONTROLS BAR
         ======================================================== */}
      <div className="bg-[#003366] text-white px-3 sm:px-6 py-2 border-b border-sky-900 shadow-sm sticky top-[68px] z-20">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Digital Timer */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono font-bold tracking-wider text-sm shadow-inner transition-colors ${
              isTimeCritical
                ? "bg-rose-600 text-white animate-pulse"
                : "bg-[#0284c7] text-white"
            }`}
          >
            <Clock className="w-4 h-4 text-sky-200" />
            <span>
              {phaseState === "STUDY_PHASE"
                ? `Study Time: ${formatTimer(studyTimeLeft)}`
                : `Time Left: ${formatTimer(questionTimeLeft)}`}
            </span>
          </div>

          {/* Controls: Instructions, Pause, Fullscreen, Zoom Switcher */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInstructions(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-800 hover:bg-sky-700 text-white font-semibold transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-sky-300" />
              <span>Instructions</span>
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-800 hover:bg-sky-700 text-white font-semibold transition-colors cursor-pointer"
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-300" />
                  <span>Pause</span>
                </>
              )}
            </button>

            <button
              onClick={toggleFullScreen}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-800 hover:bg-sky-700 text-white font-semibold transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5" />
                  <span>Exit Full Screen</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </>
              )}
            </button>

            {/* Zoom Switcher (80% | 100%) */}
            <div className="flex items-center bg-sky-950 border border-sky-800 rounded px-1.5 py-0.5 text-[11px] font-bold">
              <span className="text-slate-400 mr-1.5 hidden md:inline">Zoom:</span>
              <button
                onClick={() => setZoomLevel("80")}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  zoomLevel === "80"
                    ? "bg-[#0284c7] text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                80%
              </button>
              <span className="text-slate-500 mx-1">|</span>
              <button
                onClick={() => setZoomLevel("100")}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                  zoomLevel === "100"
                    ? "bg-[#0284c7] text-white"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                100%
              </button>
            </div>
          </div>

          {/* Candidate Identity Block */}
          <div className="flex items-center gap-3 bg-sky-950/90 px-3 py-1.5 rounded border border-sky-800/80">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-6 h-6 rounded-full object-cover border border-sky-400"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-sky-400/20 text-sky-200 flex items-center justify-center font-bold text-xs">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
            <div className="flex items-center gap-2 leading-tight">
              <span className="font-bold text-white text-xs">{candidateName}</span>
              <span className="text-slate-400">|</span>
              <span className="font-mono text-sky-300 font-semibold text-xs">
                Roll No: {rollNo}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. SECTION NAVIGATION TABS (< Tab 1 | Tab 2 >)
         ======================================================== */}
      <div className="bg-[#cbd5e1] border-b border-slate-300 px-3 sm:px-6 py-1 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-1.5">
          {/* Left chevron button */}
          <button
            type="button"
            onClick={handlePrevTab}
            disabled={phaseState === "STUDY_PHASE"}
            className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer disabled:opacity-40"
            title="Previous Section"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Navigation Tabs */}
          {tabList.map((tab) => {
            const isStudy = tab.phaseType === "STUDY_PHASE";
            const isActive =
              (isStudy && phaseState === "STUDY_PHASE") ||
              (!isStudy && phaseState === "QUESTION_PHASE" && activeSectionId === tab.id);

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-t whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? "bg-[#0284c7] text-white shadow-xs"
                    : "bg-slate-200 text-slate-700 border border-slate-300 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}

          {/* Right chevron button */}
          <button
            type="button"
            onClick={handleNextTab}
            disabled={phaseState === "STUDY_PHASE"}
            className="p-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer disabled:opacity-40"
            title="Next Section"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[11px] font-bold text-slate-600 shrink-0">
          Cutoff: <span className="text-emerald-700">{test.passingScore || 42.0} T-Score</span>
        </div>
      </div>

      {/* ========================================================
          4. MAIN CONTENT CONTAINER (STATE MACHINE CONTROLLED)
             - Only one master page scrollbar for entire test area
             - No nested scrollers on individual question cards
         ======================================================== */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 space-y-4 pb-24 overflow-visible">
        {/* Blue Sub-Header Bar */}
        <div className="bg-[#0284c7] text-white px-4 py-2.5 rounded-t-lg shadow-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-200" />
            <h2 className="text-sm sm:text-base font-bold tracking-tight">
              {phaseState === "STUDY_PHASE"
                ? "स्मरण पृष्ठ (Study Phase) - आकृतियों को ध्यानपूर्वक याद रखें"
                : `${test.title} &bull; उत्तर पृष्ठ (Question Recall Phase)`}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-sky-100">
            {phaseState === "STUDY_PHASE" ? (
              <span>Duration: {formatTimer(studySection?.durationSeconds || 240)}</span>
            ) : (
              <>
                <span>Total Questions: {totalQuestionsCount}</span>
                <span>Marks: +1.00</span>
                <span>Negative: 0.00</span>
              </>
            )}
          </div>
        </div>

        {/* ====================================================
            STATE 1: STUDY PHASE (स्मरण पृष्ठ)
            - Display ONLY single-page Memory Study Image
            - Unskippable countdown timer
            - Questions strictly hidden
           ==================================================== */}
        {phaseState === "STUDY_PHASE" && (
          <div className="bg-white border-2 border-slate-300 rounded-b-lg p-4 sm:p-6 space-y-4 shadow-sm overflow-visible">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>स्मरण पृष्ठ (Study Phase) - आकृतियों को ध्यानपूर्वक याद रखें:</strong> आकृतियों एवं उनके क्रमांक/स्थान को ध्यानपूर्वक याद करें। समय समाप्त होते ही यह पृष्ठ स्वतः हट जाएगा और प्रश्न पृष्ठ सामने आएगा।
              </span>
            </div>

            {/* Single Page High-Resolution Memory Study Image */}
            {studyImageUrl && (
              <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden min-h-[460px]">
                <img
                  src={studyImageUrl}
                  alt="RDSO Memory Study Chart"
                  className="max-h-[620px] w-auto max-w-full object-contain drop-shadow"
                />
              </div>
            )}
          </div>
        )}

        {/* ====================================================
            STATE 2: PHASE TRANSITION (3-Second Transition Screen)
            - Immediately destroys/unmounts Study Image from DOM
            - Shows animated transition message
           ==================================================== */}
        {phaseState === "PHASE_TRANSITION" && (
          <div className="bg-white border-2 border-slate-300 rounded-b-lg p-12 text-center space-y-6 shadow-sm min-h-[400px] flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center animate-spin">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-rose-700">
                समय समाप्त! अब प्रश्न पृष्ठ लोड हो रहा है...
              </h3>
              <p className="text-sm font-bold text-slate-700">
                स्मरण पृष्ठ को सुरक्षित रूप से नष्ट किया गया है। अब प्रश्न पृष्ठ लोड हो रहा है...
              </p>
              <div className="text-4xl font-black text-blue-600 font-mono pt-2">
                0{transitionSeconds}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================
            STATE 3: QUESTION RECALL PHASE (उत्तर पृष्ठ)
            - Single master page scroll
            - No nested scrollers (overflow-hidden removed)
            - Radio selection fills ONLY circular dot (no blue row highlight)
           ==================================================== */}
        {phaseState === "QUESTION_PHASE" && (
          <div className="bg-white border-2 border-slate-300 rounded-b-lg p-4 sm:p-6 space-y-6 shadow-sm overflow-visible">
            {/* Question instruction header */}
            <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg text-sky-900 text-xs flex items-center justify-between gap-2">
              <span>
                {currentSection?.instructions ||
                  "स्मरण पृष्ठ में देखी गई आकृति का सही क्रमांक अथवा विकल्प (A, B, C, D, E) चुनें।"}
              </span>
              <span className="font-bold text-sky-800 shrink-0">
                Attempted: {answeredCount} / {totalQuestionsCount}
              </span>
            </div>

            {/* Question Rows: Rendered cleanly with master page scroll */}
            <div className="space-y-6 overflow-visible">
              {questionsList.map((question) => {
                const selected = answers[question.id];

                // Parse options from optionsJson
                let options: { id: string; label: string; image?: string }[] = [];
                if (Array.isArray(question.optionsJson)) {
                  options = question.optionsJson;
                } else {
                  options = [
                    { id: "A", label: "A" },
                    { id: "B", label: "B" },
                    { id: "C", label: "C" },
                    { id: "D", label: "D" },
                    { id: "E", label: "E" },
                  ];
                }

                return (
                  <div
                    key={question.id}
                    className="border border-slate-300 rounded-xl p-4 bg-white space-y-3 overflow-visible"
                  >
                    {/* Question Header & Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {question.questionNo}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-slate-800">
                          Question #{question.questionNo}: Identify the exact recall position or matching orientation for figure #{question.questionNo}
                        </span>
                      </div>

                      {selected && (
                        <button
                          type="button"
                          onClick={() => handleClearResponse(question.id)}
                          className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Clear Selection</span>
                        </button>
                      )}
                    </div>

                    {/* Question Target Graphic */}
                    <div className="flex flex-col sm:flex-row items-center gap-6 py-2">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-2 shrink-0">
                        {question.questionImageUrl ? (
                          <img
                            src={question.questionImageUrl}
                            alt={`Question ${question.questionNo}`}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <span className="font-mono font-bold text-xl text-[#0284c7]">
                              Fig #{question.questionNo}
                            </span>
                            <span className="text-[10px]">Target</span>
                          </div>
                        )}
                      </div>

                      {/* Options Grid:
                          CRITICAL RADIO SELECTION FIX:
                          When candidate clicks an option (A, B, C, D, E),
                          ONLY the circular radio dot must fill/select.
                          DO NOT highlight or tint the entire option box or question row in blue.
                      */}
                      <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-3 w-full">
                        {options.map((opt) => {
                          const isSelected = selected === opt.id;

                          return (
                            <label
                              key={opt.id}
                              onClick={() => handleSelectOption(question.id, opt.id)}
                              className="border border-slate-300 rounded-lg p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors bg-white select-none"
                            >
                              {/* Option Image (if available) */}
                              {opt.image && (
                                <img
                                  src={opt.image}
                                  alt={`Option ${opt.id}`}
                                  className="w-12 h-12 object-contain"
                                />
                              )}

                              {/* Option Letter */}
                              <span className="font-bold text-xs text-slate-800">
                                ({opt.id})
                              </span>

                              {/* Circular Radio Dot Only (RDSO Standard) */}
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isSelected
                                    ? "border-[#003366] bg-white"
                                    : "border-slate-400 bg-white"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-2.5 h-2.5 rounded-full bg-[#003366]" />
                                )}
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          5. BOTTOM FIXED ACTION BAR (PDF 1 REFERENCE)
         ======================================================== */}
      {phaseState === "QUESTION_PHASE" && (
        <div className="fixed bottom-0 inset-x-0 bg-[#e2e8f0] border-t-2 border-[#cbd5e1] p-3 z-30 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Question Counters */}
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span>Answered: {answeredCount}</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-200 text-slate-700 font-bold border border-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-500" />
                <span>Unanswered: {unansweredCount}</span>
              </span>
            </div>

            {/* Bottom Right: Blue "Save" button and Green/Blue "Submit" button */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded bg-sky-700 hover:bg-sky-800 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              <button
                type="button"
                onClick={() => setShowConfirmSubmit(true)}
                className="flex items-center gap-2 px-5 py-2 rounded bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Battery</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. CONFIRM SUBMIT MODAL
         ======================================================== */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Submit Test Battery Confirmation</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to finish and submit your RDSO CBT test?
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-bold text-slate-800">{candidateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roll Number:</span>
                <span className="font-mono font-bold text-blue-700">{rollNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Questions:</span>
                <span className="font-bold text-slate-800">{totalQuestionsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Attempted:</span>
                <span className="font-bold text-emerald-700">{answeredCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Unanswered:</span>
                <span className="font-bold text-rose-600">{unansweredCount}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-xs font-bold text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold shadow transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "Calculating T-Score..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          7. INSTRUCTIONS MODAL (RDSO OFFICIAL RULES)
         ======================================================== */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-[#003366]" />
                <h3 className="font-bold text-slate-900 text-base">
                  RDSO CBT Exam Instructions (परीक्षा निर्देश)
                </h3>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-700 space-y-2.5 max-h-[60vh] overflow-y-auto leading-relaxed">
              <p>
                <strong>1. Two-Phase Rule (द्वि-चरणीय नियम):</strong> स्मृति परीक्षण (Memory Test) दो भागों में आयोजित होता है।
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>
                  <strong>चरण 1 (Study Phase):</strong> इस चरण में केवल स्मरण पृष्ठ दिखाई देगा। निर्धारित समय के भीतर सभी आकृतियों को याद रखें।
                </li>
                <li>
                  <strong>चरण 2 (Question Phase):</strong> समय समाप्त होते ही स्मरण पृष्ठ हट जाएगा और प्रश्न पत्र सामने आएगा जिसमें सही विकल्प चुनना होगा।
                </li>
              </ul>
              <p>
                <strong>2. T-Score Qualification (टी-स्कोर अर्हक मानक):</strong> RDSO मानकों के अनुसार अभ्यर्थी को प्रत्येक बैटरी में कम से कम <strong>42.0 टी-स्कोर</strong> प्राप्त करना अनिवार्य है।
              </p>
              <p>
                <strong>3. Anti-Selection (रेडियो बटन चयन):</strong> विकल्प पर क्लिक करने पर केवल गोल रेडियो बटन ही चयनित होगा।
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 text-right">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-2 rounded-xl bg-[#003366] text-white text-xs font-bold cursor-pointer"
              >
                Close (समझ लिया)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          8. OFFICIAL RDSO RESULT MODAL
         ======================================================== */}
      {phaseState === "RESULT_MODAL" && submissionResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border-2 border-[#003366] rounded-2xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 text-center animate-in fade-in zoom-in-95">
            {/* Crest & Title */}
            <div className="flex items-center justify-center gap-3">
              <PiEducationCrest className="w-12 h-12" />
              <IndianRailwaysEmblem className="w-12 h-12" />
              <div className="text-left">
                <h3 className="font-black text-slate-900 text-base leading-tight">
                  रेलवे भर्ती बोर्ड &bull; RAILWAY RECRUITMENT BOARD
                </h3>
                <p className="text-xs text-[#003366] font-bold">
                  RDSO Psycho Aptitude CBT Assessment Scorecard
                </p>
              </div>
            </div>

            {/* Qualification Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between text-xs font-bold ${
                submissionResult.isQualified
                  ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                  : "bg-rose-50 border-rose-300 text-rose-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {submissionResult.isQualified ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-600" />
                )}
                <div className="text-left">
                  <div className="text-sm font-extrabold uppercase">
                    {submissionResult.isQualified
                      ? "QUALIFIED (अर्हक) - RDSO Standards Met"
                      : "NOT QUALIFIED - Below 42.0 T-Score Cutoff"}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 mt-0.5">
                    Required Minimum T-Score: {submissionResult.passingScore}
                  </div>
                </div>
              </div>

              <span
                className={`text-sm font-black px-3 py-1 rounded-full ${
                  submissionResult.isQualified
                    ? "bg-emerald-600 text-white"
                    : "bg-rose-600 text-white"
                }`}
              >
                {submissionResult.isQualified ? "PASS" : "FAIL"}
              </span>
            </div>

            {/* Scorecard Table */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <div className="text-xs text-slate-500 font-semibold">Total Questions</div>
                <div className="text-xl font-black text-slate-800 mt-1">
                  {submissionResult.totalQuestions}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <div className="text-xs text-slate-500 font-semibold">Attempted</div>
                <div className="text-xl font-black text-slate-800 mt-1">
                  {submissionResult.attemptedCount}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <div className="text-xs text-slate-500 font-semibold">Raw Score</div>
                <div className="text-xl font-black text-blue-700 mt-1">
                  {submissionResult.rawScore} / {submissionResult.totalMarks}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                <div className="text-xs text-blue-700 font-bold uppercase">Final T-Score</div>
                <div className="text-2xl font-black text-blue-900 mt-1">
                  {submissionResult.tScore}
                </div>
              </div>
            </div>

            {/* Candidate Identity Verification Details */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-left space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate Name:</span>
                <span className="font-bold text-slate-800">{candidateName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roll Number:</span>
                <span className="font-bold text-blue-700">{rollNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Test Attempt ID:</span>
                <span className="text-slate-600">{submissionResult.attemptId}</span>
              </div>
            </div>

            {/* Return / Review Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Return to Dashboard
              </Link>
              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-[#003366] hover:bg-[#0284c7] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Back to Student Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
