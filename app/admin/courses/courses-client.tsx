"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Check,
  X,
  BookOpen,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { createCourse, updateCourse, deleteCourse, togglePublishCourse } from "./actions";

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  discountedPrice: number | null;
  validityDays: number;
  isPublished: boolean;
  thumbnail: string | null;
  features: string[];
  createdAt: Date | string;
  _count?: {
    tests?: number;
    studyMaterials?: number;
    orders?: number;
  };
}

interface CoursesClientProps {
  initialCourses: CourseItem[];
}

export default function CoursesClient({ initialCourses }: CoursesClientProps) {
  const [courses, setCourses] = useState<CourseItem[]>(initialCourses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("999");
  const [discountedPrice, setDiscountedPrice] = useState("499");
  const [validityDays, setValidityDays] = useState("365");
  const [thumbnail, setThumbnail] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "RDSO Simulated Practice Tests",
    "Expert Video Classes",
    "Instant T-Score Assessment",
  ]);
  const [featureInput, setFeatureInput] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  // Action states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setTitle("");
    setSlug("");
    setDescription("");
    setPrice("999");
    setDiscountedPrice("499");
    setValidityDays("365");
    setThumbnail("");
    setFeatures(["RDSO Simulated Practice Tests", "Expert Video Classes", "Instant T-Score Assessment"]);
    setFeatureInput("");
    setIsPublished(true);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (c: CourseItem) => {
    setEditingCourse(c);
    setTitle(c.title);
    setSlug(c.slug);
    setDescription(c.description || "");
    setPrice(c.price.toString());
    setDiscountedPrice(c.discountedPrice?.toString() || "");
    setValidityDays(c.validityDays.toString());
    setThumbnail(c.thumbnail || "");
    setFeatures(c.features && c.features.length > 0 ? c.features : []);
    setFeatureInput("");
    setIsPublished(c.isPublished);
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const handleAddFeature = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!featureInput.trim()) return;
    if (!features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
    }
    setFeatureInput("");
  };

  const handleRemoveFeature = (idxToRemove: number) => {
    setFeatures(features.filter((_, i) => i !== idxToRemove));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to upload file");
      }

      setThumbnail(data.url);
      showToast("Thumbnail image uploaded successfully!");
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (!title.trim()) {
        throw new Error("Course title is required.");
      }

      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice < 0) {
        throw new Error("Please enter a valid price.");
      }

      const numDiscount = discountedPrice ? parseFloat(discountedPrice) : null;
      const numValidity = parseInt(validityDays) || 365;

      if (editingCourse) {
        // Update existing
        const res = await updateCourse(editingCourse.id, {
          title,
          slug,
          description,
          price: numPrice,
          discountedPrice: numDiscount,
          validityDays: numValidity,
          features,
          thumbnail,
          isPublished,
        });

        if (!res.success) throw new Error(res.error);

        setCourses((prev) =>
          prev.map((c) => (c.id === editingCourse.id ? { ...c, ...res.course } : c))
        );
        showToast(`Course "${title}" updated successfully!`);
      } else {
        // Create new
        const res = await createCourse({
          title,
          slug,
          description,
          price: numPrice,
          discountedPrice: numDiscount,
          validityDays: numValidity,
          features,
          thumbnail,
          isPublished,
        });

        if (!res.success) throw new Error(res.error);

        setCourses((prev) => [res.course as CourseItem, ...prev]);
        showToast(`Course "${title}" published and live!`);
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    const res = await togglePublishCourse(id);
    if (res.success) {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isPublished: res.isPublished! } : c))
      );
      showToast(
        res.isPublished
          ? "Course published! Now visible to students."
          : "Course moved to Draft (hidden from students)."
      );
    } else {
      alert(res.error || "Failed to toggle status");
    }
  };

  const handleDelete = async (id: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete course "${courseTitle}"? This will also remove any linked order records.`)) {
      return;
    }

    const res = await deleteCourse(id);
    if (res.success) {
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showToast(`Course "${courseTitle}" deleted.`);
    } else {
      alert(res.error || "Failed to delete course.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header & New Course Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Manage Courses
            </h1>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {courses.length} Total
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, price, configure syllabus features, and control course visibility across the platform.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm transition-all cursor-pointer hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {/* Courses List Table (Clean Light Theme) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-xs">
              <tr>
                <th className="py-3.5 px-4">Course Info</th>
                <th className="py-3.5 px-4">Pricing (INR)</th>
                <th className="py-3.5 px-4">Validity</th>
                <th className="py-3.5 px-4">Features</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                    <p className="font-semibold text-sm text-slate-700">No courses found in database.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Click &ldquo;Create New Course&rdquo; above to publish your first course.
                    </p>
                  </td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                          {c.thumbnail && (c.thumbnail.startsWith("http") || c.thumbnail.startsWith("/")) ? (
                            <img
                              src={c.thumbnail}
                              alt={c.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <BookOpen className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm line-clamp-1">
                            {c.title}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                            slug: {c.slug}
                          </div>
                          {c.description && (
                            <div className="text-[11px] text-slate-500 line-clamp-1 max-w-xs mt-0.5">
                              {c.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-baseline gap-1.5 font-bold">
                        <span className="text-emerald-600 text-sm font-extrabold">
                          ₹{c.discountedPrice ?? c.price}
                        </span>
                        {c.discountedPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ₹{c.price}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                        <span>{c.validityDays} Days</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {c.features && c.features.length > 0 ? (
                          c.features.slice(0, 2).map((f, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium"
                            >
                              {f}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">None</span>
                        )}
                        {c.features && c.features.length > 2 && (
                          <span className="text-[10px] text-blue-600 font-bold self-center">
                            +{c.features.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(c.id, c.isPublished)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          c.isPublished
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-slate-800"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {c.isPublished ? (
                          <>
                            <Eye className="w-3 h-3" />
                            <span>Published</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600 transition-colors cursor-pointer"
                          title="Edit Course"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.title)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors cursor-pointer"
                          title="Delete Course"
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

      {/* ========================================================
          CREATE / EDIT COURSE MODAL (CLEAN LIGHT THEME)
         ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  {editingCourse ? "Edit Course Details" : "Create New LMS Course"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingCourse && !slug) {
                        setSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/\s+/g, "-")
                            .replace(/[^\w\-]+/g, "")
                        );
                      }
                    }}
                    placeholder="e.g. Course No. 4: CRASH COURSE + TEST SERIES"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. course-4-crash-course"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of course content, RDSO batteries covered, target exam (RRB ALP / Station Master)..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Pricing & Validity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Original Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Discounted Price (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value)}
                      placeholder="Optional"
                      className="w-full bg-white border border-slate-300 rounded-xl pl-7 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Thumbnail URL or File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Thumbnail Image (URL or Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={thumbnail}
                    onChange={(e) => setThumbnail(e.target.value)}
                    placeholder="Enter image URL (e.g. locomotive, laptop, /uploads/...) or upload below"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />

                  <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploading ? "Uploading..." : "Upload File"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {/* Preset shortcuts */}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] text-slate-400 font-semibold">Presets:</span>
                  {["locomotive", "laptop", "speed-test"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setThumbnail(preset)}
                      className={`text-[10px] px-2.5 py-0.5 rounded border transition-colors ${
                        thumbnail === preset
                          ? "bg-blue-600 text-white border-blue-600 font-bold"
                          : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              {/* Features Checklist / Tags */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Features Checklist (Shown on Homepage Card)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="Type feature (e.g., 50+ RDSO Test Sets) and press Enter"
                    className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddFeature()}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Published Switch */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="isPublishedCheck"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isPublishedCheck" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Publish Immediately (Instantly visible in User Home/Dashboard page)
                </label>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 bg-slate-50/50 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingCourse
                    ? "Save Changes"
                    : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
