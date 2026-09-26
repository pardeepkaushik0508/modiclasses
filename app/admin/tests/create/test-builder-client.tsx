"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileQuestion,
  Upload,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Layers,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { createRdsoTest, QuestionInput } from "../actions";
import { BatteryType } from "@prisma/client";

interface CourseOption {
  id: string;
  title: string;
  slug: string;
}

interface TestBuilderClientProps {
  courses: CourseOption[];
}

const BATTERY_OPTIONS: { label: string; value: BatteryType; isMemory?: boolean }[] = [
  { label: "Memory Test (Figure to Figure)", value: "MEMORY_FIGURE", isMemory: true },
  { label: "Memory Test (Building to Location)", value: "MEMORY_BUILDING", isMemory: true },
  { label: "Clock Direction Test", value: "CLOCK" },
  { label: "Brick Depth Perception Test", value: "BRICK" },
  { label: "Row & Column Test", value: "ROW_COLUMN" },
  { label: "Same Figure Test", value: "SAME_FIGURE" },
  { label: "Hexagonal / Octagonal Test", value: "OCTAGONAL" },
  { label: "Similarity Test", value: "SIMILARITY" },
  { label: "Yes / No Concentration Test", value: "YES_NO" },
];

export default function TestBuilderClient({ courses }: TestBuilderClientProps) {
  const router = useRouter();

  // Basic Information
  const [title, setTitle] = useState("Memory Test - Figure to Figure Set 1");
  const [slug, setSlug] = useState("");
  const [batteryType, setBatteryType] = useState<BatteryType>("MEMORY_FIGURE");
  const [courseId, setCourseId] = useState<string>("none");
  const [passingCutoff, setPassingCutoff] = useState("42.0");
  const [isPublished, setIsPublished] = useState(true);

  // Phase 1 (Study Phase) State
  const [hasStudyPhase, setHasStudyPhase] = useState(true);
  const [studyDuration, setStudyDuration] = useState("240"); // 4 minutes
  const [studyImageUrl, setStudyImageUrl] = useState("");
  const [studyInstructions, setStudyInstructions] = useState(
    "Study the positions of all figures carefully. The chart will disappear when time expires."
  );

  // Phase 2 (Question Phase) State
  const [questionDuration, setQuestionDuration] = useState("240"); // 4 minutes
  const [questionInstructions, setQuestionInstructions] = useState(
    "Select the option (A, B, C, D, E) corresponding to the correct position of each figure."
  );

  // Itemized Questions List
  const [questions, setQuestions] = useState<QuestionInput[]>([
    {
      questionNo: 1,
      questionImageUrl: "",
      options: [
        { id: "A", label: "Option A" },
        { id: "B", label: "Option B" },
        { id: "C", label: "Option C" },
        { id: "D", label: "Option D" },
        { id: "E", label: "Option E" },
      ],
      correctOption: "A",
      marks: 1.0,
    },
    {
      questionNo: 2,
      questionImageUrl: "",
      options: [
        { id: "A", label: "Option A" },
        { id: "B", label: "Option B" },
        { id: "C", label: "Option C" },
        { id: "D", label: "Option D" },
        { id: "E", label: "Option E" },
      ],
      correctOption: "B",
      marks: 1.0,
    },
  ]);

  // Loading & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingStudyImg, setIsUploadingStudyImg] = useState(false);
  const [uploadingQIdx, setUploadingQIdx] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdTestSlug, setCreatedTestSlug] = useState<string | null>(null);

  // Auto-switch study phase based on battery selection
  const handleBatteryChange = (val: BatteryType) => {
    setBatteryType(val);
    const isMem = val === "MEMORY_FIGURE" || val === "MEMORY_BUILDING";
    setHasStudyPhase(isMem);
    if (!title || title.includes("Memory Test")) {
      if (val === "MEMORY_FIGURE") setTitle("Memory Test - Figure to Figure Set 1");
      else if (val === "MEMORY_BUILDING") setTitle("Memory Test - Building to Location Set 1");
      else if (val === "CLOCK") setTitle("Clock Direction Test - Set 1");
      else if (val === "BRICK") setTitle("Brick Depth Perception Test - Set 1");
      else if (val === "ROW_COLUMN") setTitle("Row and Column Test - Set 1");
      else if (val === "OCTAGONAL") setTitle("Octagonal Perceptual Speed Test - Set 1");
      else setTitle(`${val.replace(/_/g, " ")} Test - Set 1`);
    }
  };

  // Study Image File Uploader
  const handleStudyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingStudyImg(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Upload failed");

      setStudyImageUrl(data.url);
    } catch (err: any) {
      alert(err.message || "Failed to upload study chart image.");
    } finally {
      setIsUploadingStudyImg(false);
    }
  };

  // Question Image File Uploader
  const handleQuestionImageUpload = async (
    qIndex: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingQIdx(qIndex);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Upload failed");

      setQuestions((prev) =>
        prev.map((q, i) => (i === qIndex ? { ...q, questionImageUrl: data.url } : q))
      );
    } catch (err: any) {
      alert(err.message || "Failed to upload question image.");
    } finally {
      setUploadingQIdx(null);
    }
  };

  // Add Question Row
  const handleAddQuestion = () => {
    const nextNo = questions.length + 1;
    setQuestions([
      ...questions,
      {
        questionNo: nextNo,
        questionImageUrl: "",
        options: [
          { id: "A", label: "Option A" },
          { id: "B", label: "Option B" },
          { id: "C", label: "Option C" },
          { id: "D", label: "Option D" },
          { id: "E", label: "Option E" },
        ],
        correctOption: "A",
        marks: 1.0,
      },
    ]);
  };

  // Batch Add Questions (e.g. up to 12)
  const handleBatchAddQuestions = (count: number) => {
    const currentLen = questions.length;
    const newItems: QuestionInput[] = [];
    for (let i = 1; i <= count; i++) {
      newItems.push({
        questionNo: currentLen + i,
        questionImageUrl: "",
        options: [
          { id: "A", label: "Option A" },
          { id: "B", label: "Option B" },
          { id: "C", label: "Option C" },
          { id: "D", label: "Option D" },
          { id: "E", label: "Option E" },
        ],
        correctOption: "A",
        marks: 1.0,
      });
    }
    setQuestions([...questions, ...newItems]);
  };

  // Remove Question Row
  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert("At least one question is required.");
      return;
    }
    const filtered = questions.filter((_, i) => i !== idx);
    setQuestions(filtered.map((q, i) => ({ ...q, questionNo: i + 1 })));
  };

  // Update Question Field
  const updateQuestion = (index: number, field: keyof QuestionInput, val: any) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, [field]: val } : q))
    );
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (!title.trim()) throw new Error("Test Title is required.");
      if (hasStudyPhase && !studyImageUrl.trim()) {
        const confirmNoImg = confirm(
          "No Study Image was uploaded for Phase 1. Do you want to proceed anyway?"
        );
        if (!confirmNoImg) {
          setIsSubmitting(false);
          return;
        }
      }

      const res = await createRdsoTest({
        title,
        slug: slug.trim() || undefined,
        batteryType,
        courseId: courseId === "none" ? null : courseId,
        passingScore: parseFloat(passingCutoff) || 42.0,
        isPublished,
        hasStudyPhase,
        studyDurationSeconds: parseInt(studyDuration) || 240,
        studyImageUrl,
        studyInstructions,
        questionDurationSeconds: parseInt(questionDuration) || 240,
        questionInstructions,
        questions,
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to create test.");
      }

      setCreatedTestSlug(res.test?.slug || "created");
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Confirmation Screen (Light Theme)
  if (createdTestSlug) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-xl mx-auto space-y-6 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-900">RDSO Test Created Successfully!</h2>
          <p className="text-xs text-slate-500 mt-2">
            The test has been committed transactionally to PostgreSQL with its configured sections
            and {questions.length} question records.
          </p>
        </div>

        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-left text-xs space-y-2 font-mono">
          <div className="flex justify-between">
            <span className="text-slate-500">Title:</span>
            <span className="text-slate-900 font-bold">{title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Battery:</span>
            <span className="text-blue-600 font-bold">{batteryType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Slug:</span>
            <span className="text-emerald-600 font-bold">{createdTestSlug}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Questions:</span>
            <span className="text-slate-800 font-bold">{questions.length} items</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setCreatedTestSlug(null);
              setTitle("Memory Test - Figure to Figure Set 2");
              setStudyImageUrl("");
            }}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
          >
            Create Another Test
          </button>
          <button
            onClick={() => router.push("/admin")}
            className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <span>Return to Admin Console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              RDSO Psycho Test Builder
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
              Railway CBT Engine
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build dual-phase RDSO psycho battery tests (Study Memory Map + Question Recall) with
            exact timing cutoff calculations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isSubmitting ? "Saving to Database..." : "Save & Publish Test"}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ========================================================
          SECTION 1: TEST METADATA & CONFIGURATION (LIGHT THEME)
         ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileQuestion className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            1. Test Details & Battery Configuration
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Test Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Test Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Memory Test - Figure to Figure Set 1"
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Battery Type Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              RDSO Battery Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={batteryType}
              onChange={(e) => handleBatteryChange(e.target.value as BatteryType)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {BATTERY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} ({opt.value})
                </option>
              ))}
            </select>
          </div>

          {/* Linked Course Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Course Link (Leave for Free Trial)
            </label>
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="none">✨ Free Trial Test (Public / Unlinked)</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  📚 {course.title}
                </option>
              ))}
            </select>
          </div>

          {/* Passing Cutoff */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Passing Cutoff Score (T-Score)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                value={passingCutoff}
                onChange={(e) => setPassingCutoff(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
              <span className="absolute right-3 top-2.5 text-[11px] text-slate-400 font-semibold">
                RDSO Standard = 42.0
              </span>
            </div>
          </div>
        </div>

        {/* Immediate publish check */}
        <div className="flex items-center gap-3 pt-2">
          <input
            type="checkbox"
            id="isPublishedTest"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="isPublishedTest" className="text-xs font-semibold text-slate-700 cursor-pointer">
            Make test active and available immediately upon creation
          </label>
        </div>
      </div>

      {/* ========================================================
          SECTION 2: DUAL-PHASE CONFIGURATION (LIGHT THEME)
         ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Dual-Phase Timing & Single-Page Memory Chart
            </h2>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={hasStudyPhase}
              onChange={(e) => setHasStudyPhase(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded"
            />
            <span>Enable Phase 1 (Study Phase)</span>
          </label>
        </div>

        {hasStudyPhase ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-sky-800">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                RDSO Single-Page Study Image Rule:
              </span>
              <p className="text-sky-700">
                In RDSO Railway Psycho CBT, Memory tests present a single consolidated chart with
                numbered locations for study. Upload the high-resolution single-page chart below.
              </p>
            </div>

            {/* Phase 1 Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phase 1 Study Duration (Seconds)
                </label>
                <input
                  type="number"
                  value={studyDuration}
                  onChange={(e) => setStudyDuration(e.target.value)}
                  placeholder="240"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  e.g., 240 seconds = 4 minutes
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phase 2 Question Duration (Seconds)
                </label>
                <input
                  type="number"
                  value={questionDuration}
                  onChange={(e) => setQuestionDuration(e.target.value)}
                  placeholder="240"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Total Duration: {(parseInt(studyDuration) || 0) + (parseInt(questionDuration) || 0)}s
                </span>
              </div>
            </div>

            {/* Single Page Image Upload / URL input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Single Study Image (Upload or Image URL) <span className="text-rose-500">*</span>
              </label>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={studyImageUrl}
                  onChange={(e) => setStudyImageUrl(e.target.value)}
                  placeholder="e.g. /tests/memory/set-1-study-chart.png or paste image URL"
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />

                <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingStudyImg ? "Uploading..." : "Upload Single Page Image"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleStudyImageUpload}
                    className="hidden"
                    disabled={isUploadingStudyImg}
                  />
                </label>
              </div>

              {/* Study Image Preview */}
              {studyImageUrl && (
                <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl max-w-sm">
                  <span className="text-[10px] font-bold text-slate-600 block mb-1">
                    Study Chart Preview:
                  </span>
                  <div className="h-40 rounded-lg overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                    <img
                      src={studyImageUrl}
                      alt="Study Chart Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Study Instructions */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Study Phase Instructions
              </label>
              <textarea
                rows={2}
                value={studyInstructions}
                onChange={(e) => setStudyInstructions(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Test Duration (Seconds)
            </label>
            <input
              type="number"
              value={questionDuration}
              onChange={(e) => setQuestionDuration(e.target.value)}
              placeholder="300"
              className="w-full max-w-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        )}
      </div>

      {/* ========================================================
          SECTION 3: QUESTION BULK / ITEMIZED UPLOADER (LIGHT THEME)
         ======================================================== */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                3. Itemized Question Uploader
              </h2>
              <p className="text-[11px] text-slate-500">
                Configure question image targets, options (A to E), and correct answer keys.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleBatchAddQuestions(5)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold text-slate-700 transition-colors"
            >
              + Add 5 Questions
            </button>
            <button
              type="button"
              onClick={() => handleBatchAddQuestions(12)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-semibold text-blue-700 transition-colors"
            >
              + Add 12 Questions (Set)
            </button>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 border border-blue-200 text-blue-800 flex items-center justify-center text-[10px]">
                    {q.questionNo}
                  </span>
                  <span>Question #{q.questionNo}</span>
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500">Marks:</span>
                    <input
                      type="number"
                      step="0.5"
                      value={q.marks || 1.0}
                      onChange={(e) =>
                        updateQuestion(qIndex, "marks", parseFloat(e.target.value) || 1.0)
                      }
                      className="w-14 bg-white border border-slate-300 rounded px-2 py-0.5 text-xs text-slate-900 text-center focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(qIndex)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove Question"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Question Image Input / Uploader */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">
                    Question Target Image (URL / Upload)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={q.questionImageUrl || ""}
                      onChange={(e) =>
                        updateQuestion(qIndex, "questionImageUrl", e.target.value)
                      }
                      placeholder="e.g. /tests/memory/q-1.png or image URL"
                      className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <label className="cursor-pointer px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center gap-1 transition-colors shrink-0">
                      <Upload className="w-3 h-3" />
                      <span>{uploadingQIdx === qIndex ? "..." : "Upload"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleQuestionImageUpload(qIndex, e)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Correct Answer Dropdown */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-600">
                    Correct Option Key <span className="text-emerald-600">*</span>
                  </label>
                  <select
                    value={q.correctOption}
                    onChange={(e) =>
                      updateQuestion(qIndex, "correctOption", e.target.value)
                    }
                    className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-1.5 text-xs font-bold text-emerald-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {["A", "B", "C", "D", "E"].map((opt) => (
                      <option key={opt} value={opt}>
                        Option {opt} (Correct)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Options Preview / Labels */}
              <div className="grid grid-cols-5 gap-2 pt-1">
                {["A", "B", "C", "D", "E"].map((letter) => (
                  <div
                    key={letter}
                    className={`p-2 rounded-lg text-center border text-xs font-semibold ${
                      q.correctOption === letter
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold"
                        : "bg-white border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>Option {letter}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Add Question Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAddQuestion}
            className="w-full py-2.5 rounded-xl border border-dashed border-slate-300 hover:border-blue-500 hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Next Question (#{questions.length + 1})</span>
          </button>
        </div>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          <span>{isSubmitting ? "Saving to Database..." : "Save & Publish Test"}</span>
        </button>
      </div>
    </form>
  );
}
