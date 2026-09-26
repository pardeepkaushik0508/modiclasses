"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Send,
  MessageCircle,
  ShieldCheck,
  ExternalLink,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  Settings,
  ArrowUpRight,
} from "lucide-react";
import { GroupSettings } from "@/lib/settings";
import { updateGroupSettingsAction } from "./actions";

interface SettingsClientProps {
  initialSettings: GroupSettings;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [formData, setFormData] = useState<GroupSettings>(initialSettings);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (!formData.telegramLink.trim() || !formData.whatsappLink.trim()) {
        throw new Error("Telegram and WhatsApp community links are required.");
      }

      const res = await updateGroupSettingsAction(formData);
      if (!res.success) throw new Error(res.error || "Failed to update settings");

      showToast("Community group links updated successfully!");
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 text-white font-semibold text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-50 text-[#003366] border border-sky-200 text-xs font-bold">
            <Settings className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Site Administration</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Community & Mentorship Settings
          </h1>
          <p className="text-xs text-slate-500 max-w-xl">
            Configure dynamic Telegram, WhatsApp, and VIP mentorship community links displayed to students on <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-700">/groups</code>.
          </p>
        </div>

        <Link
          href="/groups"
          target="_blank"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors shrink-0"
        >
          <span>Preview Live /groups</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Telegram Community */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center font-bold">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Telegram Community Channel</h3>
                <p className="text-[11px] text-slate-500">Public group for daily memory quizzes and RRB updates</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-[#0088cc] border border-sky-200">
              Active Channel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                Telegram Link URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={formData.telegramLink}
                onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
                placeholder="https://t.me/five_education_rdso"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0088cc]/30 focus:border-[#0088cc] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Group Display Title</label>
              <input
                type="text"
                value={formData.telegramName}
                onChange={(e) => setFormData({ ...formData, telegramName: e.target.value })}
                placeholder="RRB ALP & Technician Psycho CBT 2026 Batch"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0088cc]/30 focus:border-[#0088cc] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Brief Description</label>
              <input
                type="text"
                value={formData.telegramDescription}
                onChange={(e) => setFormData({ ...formData, telegramDescription: e.target.value })}
                placeholder="Daily memory charts, doubt clearing, peer discussion & official RRB psycho updates"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0088cc]/30 focus:border-[#0088cc] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 2: WhatsApp Community */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center font-bold">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">WhatsApp Community Group</h3>
                <p className="text-[11px] text-slate-500">Fast peer discussion for Station Master & ALP batches</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Group
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                WhatsApp Invite URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={formData.whatsappLink}
                onChange={(e) => setFormData({ ...formData, whatsappLink: e.target.value })}
                placeholder="https://chat.whatsapp.com/invite/FiveEducationRDSO"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 focus:border-[#25D366] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Group Display Title</label>
              <input
                type="text"
                value={formData.whatsappName}
                onChange={(e) => setFormData({ ...formData, whatsappName: e.target.value })}
                placeholder="Station Master (SM) Psycho Cutoff Target 42.0+ Club"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 focus:border-[#25D366] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Brief Description</label>
              <input
                type="text"
                value={formData.whatsappDescription}
                onChange={(e) => setFormData({ ...formData, whatsappDescription: e.target.value })}
                placeholder="High-focus group for Station Master aspirants targeting 42+ T-Score in every battery"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#25D366]/30 focus:border-[#25D366] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Card 3: Exclusive Mentorship Desk */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold border border-rose-200">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">VIP Close Group Mentorship Desk</h3>
                <p className="text-[11px] text-slate-500">1-on-1 Ex-RDSO faculty guidance and personalized score reviews</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
              VIP Desk
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-xs font-bold text-slate-700">
                Mentorship Desk URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                value={formData.mentorshipLink}
                onChange={(e) => setFormData({ ...formData, mentorshipLink: e.target.value })}
                placeholder="https://t.me/+FiveEducationExclusiveMentors"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Group Display Title</label>
              <input
                type="text"
                value={formData.mentorshipName}
                onChange={(e) => setFormData({ ...formData, mentorshipName: e.target.value })}
                placeholder="Five Education Close Group (Exclusive Mentorship)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Brief Description</label>
              <input
                type="text"
                value={formData.mentorshipDescription}
                onChange={(e) => setFormData({ ...formData, mentorshipDescription: e.target.value })}
                placeholder="Direct 1-on-1 faculty assistance with Ex-RDSO mentors and strategy rooms"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin"
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? "Saving Changes..." : "Save Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
