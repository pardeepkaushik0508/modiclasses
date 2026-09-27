"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Upload,
  Trash2,
  ExternalLink,
  Check,
  AlertCircle,
  FileCheck,
  Video,
  Clock,
  Pencil,
  X,
} from "lucide-react";
import { createStudyMaterial, updateStudyMaterial, deleteStudyMaterial } from "./actions";

interface MaterialItem {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  duration?: string | null;
  isFree: boolean;
  createdAt: Date | string;
  course: {
    id: string;
    title: string;
  };
}

interface CourseOption {
  id: string;
  title: string;
}

interface MaterialsClientProps {
  initialMaterials: MaterialItem[];
  courses: CourseOption[];
}

function formatVideoDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds <= 0) return "";
  const totalSec = Math.round(seconds);
  const hours = Math.floor(totalSec / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const remainingSec = totalSec % 60;
  if (hours > 0) {
    return `${hours} hr ${mins} Mins`;
  }
  if (mins > 0) {
    return remainingSec >= 30 ? `${mins + 1} Mins` : `${mins} Mins`;
  }
  return `${remainingSec} Secs`;
}

function probeVideoDuration(source: File | string): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      const srcUrl = typeof source === "string" ? source : URL.createObjectURL(source);
      video.src = srcUrl;
      video.onloadedmetadata = () => {
        if (typeof source !== "string") {
          URL.revokeObjectURL(srcUrl);
        }
        resolve(formatVideoDuration(video.duration));
      };
      video.onerror = () => {
        if (typeof source !== "string") {
          URL.revokeObjectURL(srcUrl);
        }
        resolve("");
      };
    } catch {
      resolve("");
    }
  });
}

export default function MaterialsClient({
  initialMaterials,
  courses,
}: MaterialsClientProps) {
  const [materials, setMaterials] = useState<MaterialItem[]>(initialMaterials);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<MaterialItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("PDF");
  const [videoDuration, setVideoDuration] = useState("");
  const [instructor, setInstructor] = useState("Five Education RDSO Mentor");
  const [isFree, setIsFree] = useState(false);

  // Status
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [emptyMediaModal, setEmptyMediaModal] = useState<{ open: boolean; title: string }>({
    open: false,
    title: "",
  });

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setEditingMaterial(null);
    setTitle("");
    setCourseId(courses[0]?.id || "");
    setFileUrl("");
    setFileType("PDF");
    setVideoDuration("");
    setInstructor("Five Education RDSO Mentor");
    setIsFree(false);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (m: MaterialItem) => {
    setEditingMaterial(m);
    setTitle(m.title);
    setCourseId(m.course.id);
    setFileUrl(m.fileUrl);
    setFileType(m.fileType);
    setVideoDuration(m.duration || "");
    setIsFree(m.isFree);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleOpenMedia = (e: React.MouseEvent, m: MaterialItem) => {
    e.preventDefault();
    if (!m.fileUrl || m.fileUrl.trim() === "" || m.fileUrl === "#") {
      setEmptyMediaModal({
        open: true,
        title: m.title,
      });
      showToast("Media Not Available: Is video ya document ka koi link/file upload nahi kiya gaya hai.");
      return;
    }
    window.open(m.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const isVideoFile = file.type.startsWith("video/") || /\.(mp4|webm|mov|mkv)$/i.test(file.name);
      if (isVideoFile) {
        setFileType("VIDEO");
        probeVideoDuration(file).then((dur) => {
          if (dur && !videoDuration) {
            setVideoDuration(dur);
            showToast(`Exact Video Duration Detected: ${dur}`);
          }
        });
      }

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Upload failed");

      setFileUrl(data.url);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      showToast("File uploaded successfully!");
    } catch (err: any) {
      alert(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlBlur = async () => {
    const trimmedUrl = fileUrl.trim();
    if (!trimmedUrl) return;

    // Detect YouTube URL
    const isYouTube = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/.test(trimmedUrl);
    if (isYouTube) {
      if (fileType !== "VIDEO") {
        setFileType("VIDEO");
      }
      // If title is empty, fetch metadata title from YouTube oEmbed endpoint
      if (!title.trim()) {
        try {
          const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(trimmedUrl)}&format=json`);
          if (oembedRes.ok) {
            const ytData = await oembedRes.json();
            if (ytData.title && !title.trim()) {
              setTitle(ytData.title);
            }
          }
        } catch {
          // ignore network failure for oembed
        }
      }
    } else if (trimmedUrl.endsWith(".mp4") || trimmedUrl.endsWith(".webm") || trimmedUrl.includes("/uploads/")) {
      if (fileType !== "VIDEO") {
        setFileType("VIDEO");
      }
      if (!videoDuration) {
        const detected = await probeVideoDuration(trimmedUrl);
        if (detected) {
          setVideoDuration(detected);
          showToast(`Detected duration: ${detected}`);
        }
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (!title.trim()) throw new Error("Title is required.");
      if (!courseId) throw new Error("Please select a course.");
      if (!fileUrl.trim()) throw new Error("Please upload or enter a file URL.");

      // Prioritize the manual duration entered by the admin in the form
      const cleanDuration = fileType === "VIDEO" ? (videoDuration.trim() || null) : null;

      if (editingMaterial) {
        const res = await updateStudyMaterial(editingMaterial.id, {
          title: title.trim(),
          courseId,
          fileUrl: fileUrl.trim(),
          fileType,
          duration: cleanDuration,
          isFree,
        });

        if (!res.success) throw new Error(res.error);

        const matchedCourse = courses.find((c) => c.id === courseId);
        const updatedMat: MaterialItem = {
          ...(res.material as any),
          course: { id: courseId, title: matchedCourse?.title || editingMaterial.course.title },
        };

        setMaterials((prev) =>
          prev.map((m) => (m.id === editingMaterial.id ? updatedMat : m))
        );
        showToast("Study Material updated successfully!");
      } else {
        const res = await createStudyMaterial({
          title: title.trim(),
          courseId,
          fileUrl: fileUrl.trim(),
          fileType,
          duration: cleanDuration,
          isFree,
        });

        if (!res.success) throw new Error(res.error);

        const matchedCourse = courses.find((c) => c.id === courseId);
        const newMat: MaterialItem = {
          ...(res.material as any),
          course: { id: courseId, title: matchedCourse?.title || "Course" },
        };

        setMaterials([newMat, ...materials]);
        showToast("Study Material uploaded successfully!");
      }

      setIsModalOpen(false);
      setEditingMaterial(null);
      setTitle("");
      setFileUrl("");
      setVideoDuration("");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save material.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, matTitle: string) => {
    if (!confirm(`Delete material "${matTitle}"?`)) return;

    const res = await deleteStudyMaterial(id);
    if (res.success) {
      setMaterials(materials.filter((m) => m.id !== id));
      showToast(`Material "${matTitle}" deleted.`);
    } else {
      alert(res.error || "Failed to delete.");
    }
  };

  return (
    <div className="space-y-6">
      {successToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Uploaded Materials & Notes
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {materials.length} Files
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Upload PDF notes, formula sheets, memory shortcuts, and video reference materials.
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* Table (Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3.5 px-4">Title & Document</th>
                <th className="py-3.5 px-4">Linked Course</th>
                <th className="py-3.5 px-4">Format & Duration</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Access</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {materials.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-700">No study materials uploaded yet.</p>
                  </td>
                </tr>
              ) : (
                materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                          {m.fileType === "VIDEO" ? (
                            <Video className="w-4 h-4" />
                          ) : (
                            <FileCheck className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{m.title}</div>
                          <div className="text-[10px] text-slate-400 font-mono line-clamp-1 max-w-xs mt-0.5">
                            {m.fileUrl || "(No URL Provided)"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-medium">
                      {m.course.title}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">
                          {m.fileType}
                        </span>
                        {m.fileType === "VIDEO" && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-[#003366] border border-sky-200">
                            <Clock className="w-3 h-3 text-[#0284c7]" />
                            <span>{m.duration || "--"}</span>
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center whitespace-nowrap px-2.5 py-1 text-xs font-semibold rounded-full ${
                          m.isFree
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}
                      >
                        {m.isFree ? "Free Public" : "Enrolled Only"}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(m)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-300 text-slate-600 transition-colors cursor-pointer"
                          title="Edit Material & Duration"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenMedia(e, m)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-600 transition-colors cursor-pointer"
                          title="Open File / View Media"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(m.id, m.title)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                          title="Delete Material"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload/Edit Modal (Light Theme, Centered, max-h-[90vh] with scroll) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingMaterial ? "Edit Study Material / Video" : "Upload Study Material"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMaterial(null);
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Document / Material Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. RDSO Memory Test Shortcuts & Formula Book"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Linked Course <span className="text-rose-500">*</span>
                </label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  File Upload / URL <span className="text-rose-500">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    onBlur={handleUrlBlur}
                    placeholder="Enter YouTube URL, video link, or upload file"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.mp4,.webm,.mov,.png,.jpg"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Format</label>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="VIDEO">Video Lecture</option>
                    <option value="IMAGE">Chart / Image</option>
                    <option value="DOC">Document</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isFreeMat"
                    checked={isFree}
                    onChange={(e) => setIsFree(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded"
                  />
                  <label htmlFor="isFreeMat" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    Free / Public Preview
                  </label>
                </div>
              </div>

              {/* Video-specific duration field */}
              {fileType === "VIDEO" && (
                <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-3">
                  <div className="text-[11px] font-bold text-[#003366] flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                      <span>Video Duration Configuration</span>
                    </span>
                    <span className="text-[10px] text-blue-700 font-semibold bg-white/80 px-2 py-0.5 rounded border border-blue-200">
                      Live on Video Cards
                    </span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Exact Duration <span className="text-slate-500 font-normal">(e.g., 3 Mins, 15 Mins, 45 Mins, 1 hr 12 Mins)</span>
                    </label>
                    <input
                      type="text"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      placeholder="e.g. 3 Mins"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Manual duration entered here will be saved to the database and displayed dynamically on student video cards.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingMaterial(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingMaterial ? "Update Material" : "Save Material"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty Media Alert Modal (Centered, max-h-[90vh] with scroll) */}
      {emptyMediaModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
              <AlertCircle className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-extrabold text-slate-900 text-base">Media Not Available</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Is video ya document ka koi link/file upload nahi kiya gaya hai.
              </p>
              {emptyMediaModal.title && (
                <p className="text-[11px] font-semibold text-slate-400 truncate mt-1">
                  Material: {emptyMediaModal.title}
                </p>
              )}
            </div>
            <button
              onClick={() => setEmptyMediaModal({ open: false, title: "" })}
              className="w-full py-2.5 px-4 rounded-xl bg-[#003366] hover:bg-[#0284c7] text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              Theek Hai / Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
