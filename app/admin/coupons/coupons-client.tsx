"use client";

import { useState, useTransition } from "react";
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  Calendar,
  Percent,
  IndianRupee,
  Layers,
  Search,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  TrendingUp,
  X,
  Clock,
} from "lucide-react";
import {
  CouponFormData,
  createCouponAction,
  toggleCouponStatusAction,
  deleteCouponAction,
} from "./actions";

export interface SerializedCoupon {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
  validUntil: string | null;
  usageLimit: number | null;
  isPublished: boolean;
  createdAt: string;
  _count: {
    usages: number;
    orders: number;
  };
}

interface CouponsClientProps {
  coupons: SerializedCoupon[];
}

export default function CouponsClient({ coupons: initialCoupons }: CouponsClientProps) {
  const [coupons, setCoupons] = useState<SerializedCoupon[]>(initialCoupons);
  const [isPending, startTransition] = useTransition();

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<CouponFormData>({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderAmount: 0,
    maxDiscountAmount: 500,
    validUntil: "",
    usageLimit: 100,
    isPublished: true,
  });

  // Copy handler
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Submit new coupon
  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    startTransition(async () => {
      const res = await createCouponAction({
        ...formData,
        code: formData.code.trim().toUpperCase(),
        discountValue: Number(formData.discountValue),
        minOrderAmount: Number(formData.minOrderAmount) || 0,
        maxDiscountAmount: formData.maxDiscountAmount ? Number(formData.maxDiscountAmount) : null,
        usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
        validUntil: formData.validUntil ? formData.validUntil : null,
      });

      if (res.success && res.coupon) {
        const created: SerializedCoupon = {
          ...res.coupon,
          validUntil: res.coupon.validUntil ? res.coupon.validUntil.toISOString() : null,
          createdAt: res.coupon.createdAt.toISOString(),
          _count: { usages: 0, orders: 0 },
        };
        setCoupons((prev) => [created, ...prev]);
        setIsCreateModalOpen(false);
        setFormData({
          code: "",
          discountType: "PERCENTAGE",
          discountValue: 20,
          minOrderAmount: 0,
          maxDiscountAmount: 500,
          validUntil: "",
          usageLimit: 100,
          isPublished: true,
        });
      } else {
        setFormError(res.error || "Failed to create coupon.");
      }
    });
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    const current = coupons.find((c) => c.id === id);
    if (!current) return;

    // Optimistic update
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPublished: !c.isPublished } : c))
    );

    startTransition(async () => {
      const res = await toggleCouponStatusAction(id);
      if (!res.success) {
        // Revert on error
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isPublished: current.isPublished } : c))
        );
        alert(res.error || "Failed to update status.");
      }
    });
  };

  // Delete coupon
  const handleDelete = (id: string, code: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon "${code}"?`)) {
      return;
    }

    setCoupons((prev) => prev.filter((c) => c.id !== id));

    startTransition(async () => {
      const res = await deleteCouponAction(id);
      if (!res.success) {
        alert(res.error || "Failed to delete coupon.");
        // Refresh page to restore state
        window.location.reload();
      }
    });
  };

  // Filtered coupons
  const filteredCoupons = coupons.filter((item) => {
    const matchesSearch =
      !searchQuery.trim() ||
      item.code.toLowerCase().includes(searchQuery.trim().toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && item.isPublished) ||
      (statusFilter === "INACTIVE" && !item.isPublished);

    return matchesSearch && matchesStatus;
  });

  // Metrics
  const totalCoupons = coupons.length;
  const activeCouponsCount = coupons.filter((c) => c.isPublished).length;
  const totalRedemptions = coupons.reduce((sum, c) => sum + (c._count.usages || 0), 0);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* ========================================================
          1. HEADER & TOP ACTIONS BAR
         ======================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-[#0b192e] to-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Tag className="w-3.5 h-3.5" />
            <span>Monetization & Conversion Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Coupons & Promotional Discounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Create and enforce promo codes with percentage or flat price cuts, expiration dates,
            per-user single-redemption rules, and server-side cryptographic tamper resistance.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* ========================================================
          2. PLATFORM METRIC CARDS
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-sky-50 text-[#003366] flex items-center justify-center shrink-0 border border-sky-100">
            <Tag className="w-6 h-6 text-[#0284c7]" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalCoupons}</div>
            <div className="text-xs font-bold text-slate-700">Total Configured Codes</div>
            <div className="text-[11px] text-slate-400">Database Registered</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-700">{activeCouponsCount}</div>
            <div className="text-xs font-bold text-slate-700">Live Active Coupons</div>
            <div className="text-[11px] text-emerald-600 font-semibold">Eligible for Checkout</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-700">{totalRedemptions}</div>
            <div className="text-xs font-bold text-slate-700">Candidate Redemptions</div>
            <div className="text-[11px] text-amber-700 font-semibold">Verified Orders</div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. SEARCH & FILTER CONTROLS
         ======================================================== */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search coupon code (e.g. RRB2026)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#003366] focus:border-transparent uppercase"
          />
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setStatusFilter(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                statusFilter === mode
                  ? "bg-[#003366] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          4. COUPONS TABLE
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredCoupons.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Tag className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No coupons found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              No promo codes match your current filter. Click "Create New Coupon" to set up a new discount.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-extrabold tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount Value</th>
                  <th className="py-3.5 px-4">Eligibility / Min Order</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4">Redemptions</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCoupons.map((item) => {
                  const isExpired = item.validUntil && new Date(item.validUntil) < new Date();
                  const isLimitReached = item.usageLimit && item._count.usages >= item.usageLimit;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Code */}
                      <td className="py-4 px-4 font-mono font-bold text-slate-900">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-300 text-[#003366]">
                          <span>{item.code}</span>
                          <button
                            onClick={() => handleCopyCode(item.code)}
                            title="Copy code"
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {copiedCode === item.code && (
                          <span className="block text-[10px] text-emerald-600 font-sans font-bold mt-0.5">
                            Copied to clipboard!
                          </span>
                        )}
                      </td>

                      {/* Value */}
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-extrabold text-xs bg-amber-50 text-amber-900 border border-amber-200">
                          {item.discountType === "PERCENTAGE" ? (
                            <>
                              <Percent className="w-3 h-3" />
                              <span>{item.discountValue}% OFF</span>
                            </>
                          ) : (
                            <>
                              <IndianRupee className="w-3 h-3" />
                              <span>₹{item.discountValue} FLAT OFF</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Criteria */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="text-slate-700 font-semibold">
                          Min: {item.minOrderAmount > 0 ? `₹${item.minOrderAmount}` : "None"}
                        </div>
                        {item.maxDiscountAmount && (
                          <div className="text-[11px] text-slate-500">
                            Cap: Max ₹{item.maxDiscountAmount} off
                          </div>
                        )}
                      </td>

                      {/* Expiry */}
                      <td className="py-4 px-4">
                        {item.validUntil ? (
                          <div className="space-y-0.5">
                            <span
                              className={`font-semibold ${
                                isExpired ? "text-rose-600 line-through" : "text-slate-700"
                              }`}
                            >
                              {new Date(item.validUntil).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            {isExpired && (
                              <span className="block text-[10px] font-bold text-rose-600 uppercase">
                                Expired
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 font-medium">Never expires</span>
                        )}
                      </td>

                      {/* Redemptions */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">
                          {item._count.usages} used
                          {item.usageLimit ? (
                            <span className="text-slate-400 font-normal"> / {item.usageLimit} max</span>
                          ) : (
                            <span className="text-slate-400 font-normal"> (Unlimited)</span>
                          )}
                        </div>
                        {isLimitReached && (
                          <span className="text-[10px] font-bold text-amber-700 uppercase">
                            Max Cap Reached
                          </span>
                        )}
                      </td>

                      {/* Active Status */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(item.id)}
                          disabled={isPending}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                            item.isPublished
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          {item.isPublished ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-slate-400" />
                              <span>Inactive</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => handleDelete(item.id, item.code)}
                          disabled={isPending}
                          title="Delete Coupon"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================
          5. CREATE COUPON MODAL
         ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#0b192e] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Create New Coupon</h3>
                  <p className="text-[11px] text-slate-400">Configure discount value and guard rules</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Code */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800 block">
                  Coupon Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RRB2026, FIRST50"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""),
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#003366] uppercase"
                />
                <p className="text-[10px] text-slate-500">Auto-capitalized alphanumeric code.</p>
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountType: e.target.value as "PERCENTAGE" | "FLAT",
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  >
                    <option value="PERCENTAGE">Percentage (% Off)</option>
                    <option value="FLAT">Flat Rate (₹ Off)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">
                    {formData.discountType === "PERCENTAGE" ? "Percentage (%)" : "Flat Amount (₹)"}{" "}
                    <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
                    required
                    value={formData.discountValue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        discountValue: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
              </div>

              {/* Min Order & Max Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Min Course Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = No minimum"
                    value={formData.minOrderAmount || 0}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        minOrderAmount: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">
                    Max Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Optional ceiling cap"
                    value={formData.maxDiscountAmount || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxDiscountAmount: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
              </div>

              {/* Expiry Date & Global Limit */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Valid Until (Expiry)</label>
                  <input
                    type="date"
                    value={formData.validUntil || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        validUntil: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-800 block">Total Global Limit</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Unlimited if empty"
                    value={formData.usageLimit || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        usageLimit: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isPublished: e.target.checked }))
                  }
                  className="w-4 h-4 rounded text-[#003366] focus:ring-[#003366] cursor-pointer"
                />
                <label htmlFor="isPublished" className="font-bold text-slate-800 cursor-pointer">
                  Activate coupon immediately for candidates
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[#003366] hover:bg-[#002244] text-white font-bold transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {isPending ? "Creating..." : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
