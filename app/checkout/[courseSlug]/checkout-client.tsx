"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Tag,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  QrCode,
  CreditCard,
  Building2,
  Smartphone,
  ChevronRight,
  User,
  Mail,
  Phone,
  IndianRupee,
  X,
  Clock,
  Award,
  Zap,
} from "lucide-react";
import {
  validateCouponAction,
  createOrderAction,
  verifyPaymentAction,
  CouponValidationResult,
} from "./actions";

export interface CheckoutCourseData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  discountedPrice: number | null;
  validityDays: number;
  features: string[];
  thumbnail: string | null;
}

export interface PublicCouponSuggestion {
  id: string;
  code: string;
  discountType: "PERCENTAGE" | "FLAT";
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number | null;
}

export interface CandidateSessionData {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  rollNo: string | null;
}

interface CheckoutClientProps {
  course: CheckoutCourseData;
  availableCoupons: PublicCouponSuggestion[];
  candidate: CandidateSessionData | null;
  isAlreadyEnrolled: boolean;
}

export default function CheckoutClient({
  course,
  availableCoupons,
  candidate,
  isAlreadyEnrolled,
}: CheckoutClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Pricing State
  const basePrice = course.discountedPrice ?? course.price;
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult["coupon"] | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(basePrice);
  const [couponMessage, setCouponMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Gateway Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeGatewayOrderId, setActiveGatewayOrderId] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [selectedPayMethod, setSelectedPayMethod] = useState<"UPI" | "CARD" | "NETBANKING">("UPI");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccessData, setPaymentSuccessData] = useState<{ courseSlug: string; orderId: string } | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // 1. APPLY COUPON HANDLER
  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponCodeInput).trim().toUpperCase();
    if (!code) {
      setCouponMessage({ text: "Please enter a valid coupon code.", type: "error" });
      return;
    }

    setCouponMessage(null);
    setCheckoutError(null);

    startTransition(async () => {
      const res = await validateCouponAction({
        courseSlug: course.slug,
        couponCode: code,
      });

      if (res.success && res.coupon) {
        setAppliedCoupon(res.coupon);
        setDiscountAmount(res.discountAmount);
        setFinalAmount(res.finalAmount);
        setCouponCodeInput(res.coupon.code);
        setCouponMessage({
          text: `Coupon "${res.coupon.code}" applied! You saved ₹${res.discountAmount}.`,
          type: "success",
        });
      } else {
        setCouponMessage({
          text: res.error || "Failed to apply coupon.",
          type: "error",
        });
      }
    });
  };

  // 2. REMOVE COUPON
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setFinalAmount(basePrice);
    setCouponCodeInput("");
    setCouponMessage(null);
  };

  // 3. PROCEED TO PAYMENT
  const handleProceedToPayment = async () => {
    if (!candidate) {
      router.push(`/login?callbackUrl=/checkout/${course.slug}`);
      return;
    }

    setCheckoutError(null);

    startTransition(async () => {
      const res = await createOrderAction({
        courseSlug: course.slug,
        couponCode: appliedCoupon?.code || null,
      });

      if (res.requireLogin) {
        router.push(`/login?callbackUrl=/checkout/${course.slug}`);
        return;
      }

      if (res.alreadyEnrolled) {
        alert("You are already enrolled in this course!");
        router.push("/study-material");
        return;
      }

      if (res.success && res.orderId) {
        setActiveOrderId(res.orderId);
        setActiveGatewayOrderId(res.gatewayOrderId || null);

        // Production Razorpay vs Simulator Mode
        if (!res.isMock && res.keyId && (window as any).Razorpay) {
          // Standard Razorpay checkout options
          const options = {
            key: res.keyId,
            amount: Math.round((res.amount || finalAmount) * 100),
            currency: res.currency || "INR",
            name: "PI EDUCATION LMS",
            description: course.title,
            order_id: res.gatewayOrderId,
            prefill: {
              name: candidate.name || "",
              email: candidate.email || "",
              contact: candidate.phone || "",
            },
            theme: { color: "#003366" },
            handler: async function (response: any) {
              const verifyRes = await verifyPaymentAction({
                orderId: res.orderId!,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });

              if (verifyRes.success) {
                setPaymentSuccessData({
                  courseSlug: verifyRes.courseSlug || course.slug,
                  orderId: verifyRes.orderId || res.orderId!,
                });
              } else {
                setCheckoutError(verifyRes.error || "Payment verification failed.");
              }
            },
            modal: {
              ondismiss: function () {
                setCheckoutError("Payment was dismissed. Your coupon remains intact.");
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } else {
          // Open Secure Simulator Modal
          setIsPaymentModalOpen(true);
        }
      } else {
        setCheckoutError(res.error || "Failed to initialize order.");
      }
    });
  };

  // 4. SIMULATOR MODAL CONFIRMATION
  const handleSimulatePayment = async (success: boolean) => {
    if (!activeOrderId) return;
    setPaymentProcessing(true);

    try {
      const res = await verifyPaymentAction({
        orderId: activeOrderId,
        paymentId: success ? `sim_pay_${Date.now()}` : undefined,
        simulatedSuccess: success,
      });

      if (success && res.success) {
        setPaymentSuccessData({
          courseSlug: res.courseSlug || course.slug,
          orderId: res.orderId || activeOrderId,
        });
        setIsPaymentModalOpen(false);
      } else {
        setIsPaymentModalOpen(false);
        setCheckoutError(res.error || "Simulated payment failed. Coupon preserved.");
      }
    } catch (err: any) {
      setCheckoutError(err.message || "An error occurred during verification.");
      setIsPaymentModalOpen(false);
    } finally {
      setPaymentProcessing(false);
    }
  };

  // 5. SUCCESS SCREEN
  if (paymentSuccessData) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 max-w-lg w-full text-center space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border-2 border-emerald-200 animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Payment & Enrollment Successful
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Welcome to the Course!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Your access to <strong>{course.title}</strong> is now live. All RDSO CBT test batteries, concept notes, and video masterclasses have been unlocked.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2 font-mono">
            <div className="flex justify-between text-slate-600">
              <span>Order Reference:</span>
              <span className="font-bold text-slate-900">{paymentSuccessData.orderId}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Amount Paid:</span>
              <span className="font-bold text-emerald-700">₹{finalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Access Validity:</span>
              <span className="font-bold text-slate-900">{course.validityDays} Days</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <Link
              href="/study-material"
              className="flex-1 py-3 px-4 rounded-xl bg-[#003366] hover:bg-[#002244] text-white font-bold text-xs shadow-md transition-colors"
            >
              Access Study Material
            </Link>
            <Link
              href="/video"
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
            >
              Watch Video Classes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#003366] hover:text-[#0284c7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Courses</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit SSL Encrypted Checkout</span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Course Enrollment
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Review your course syllabus, apply promotional coupon discounts, and complete payment.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-sky-50 text-[#003366] border border-sky-200 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0">
          <Zap className="w-4 h-4 text-[#0284c7]" />
          <span>Instant Engine Activation</span>
        </div>
      </div>

      {checkoutError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-semibold">{checkoutError}</span>
          </div>
          <button
            onClick={() => setCheckoutError(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ========================================================
          TWO-COLUMN CHECKOUT GRID
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Course Details & Candidate Info (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Course Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#003366] text-white uppercase tracking-wider">
                  Target: 42.0+ T-Score Batch
                </span>
                <h2 className="text-xl font-black text-slate-900 leading-snug">
                  {course.title}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {course.description ||
                    "Full RDSO Psycho CBT Preparation Package including all 9 battery types, masterclasses, and PYQ tests."}
                </p>
              </div>
            </div>

            {/* Validity & Access Features */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Access Period</span>
                <div className="font-black text-slate-900 text-sm">
                  {course.validityDays} Days Validity
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Delivery</span>
                <div className="font-black text-emerald-700 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Instant Online Access</span>
                </div>
              </div>
            </div>

            {/* Checklist of Included Items */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                What's Included in this Course:
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                {course.features.map((feat, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited RDSO Psycho CBT Mock Practice with Real Timers</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Comprehensive PDF Formula Sheets & Memory Scanning Tricks</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Candidate Profile Details Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#003366]" />
                <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                  Enrolled Candidate Profile
                </h3>
              </div>
              {candidate ? (
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Verified Candidate
                </span>
              ) : (
                <Link
                  href={`/login?callbackUrl=/checkout/${course.slug}`}
                  className="text-xs font-bold text-[#003366] hover:underline"
                >
                  Log In to Continue →
                </Link>
              )}
            </div>

            {candidate ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Candidate Name</span>
                  <div className="font-bold text-slate-900">{candidate.name || "Aspirant Candidate"}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Registered Email</span>
                  <div className="font-bold text-slate-900 truncate">{candidate.email}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Mobile Number</span>
                  <div className="font-bold text-slate-900">{candidate.phone || "Not Provided"}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">RDSO CBT Roll No.</span>
                  <div className="font-mono font-bold text-[#0284c7]">{candidate.rollNo || "Auto-Assigned"}</div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <p className="font-bold">You are currently in guest mode.</p>
                <p>
                  Please log in or register before completing payment so your course access and 6-digit CBT Roll Number can be linked to your account.
                </p>
                <Link
                  href={`/login?callbackUrl=/checkout/${course.slug}`}
                  className="inline-block mt-1 px-4 py-1.5 rounded-lg bg-[#003366] text-white font-bold text-xs hover:bg-[#002244] transition-colors"
                >
                  Log In Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Pricing & Coupon Engine (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Order Summary & Coupon Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md space-y-5">
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider pb-3 border-b border-slate-100">
              Payment & Order Summary
            </h3>

            {/* Pricing Line Items */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Course Original Price (MRP)</span>
                <span className="line-through text-slate-400 font-semibold">₹{course.price}</span>
              </div>

              {course.discountedPrice && (
                <div className="flex justify-between text-slate-600">
                  <span>Special Platform Offer</span>
                  <span className="text-emerald-600 font-semibold">
                    -₹{course.price - course.discountedPrice}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-slate-800 pt-1 border-t border-slate-100">
                <span>Course Base Price</span>
                <span>₹{basePrice}</span>
              </div>

              {/* Applied Coupon Line Item */}
              {appliedCoupon && discountAmount > 0 && (
                <div className="flex justify-between font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon ({appliedCoupon.code})</span>
                  </div>
                  <span>-₹{discountAmount}</span>
                </div>
              )}

              {/* Total Payable */}
              <div className="flex items-baseline justify-between pt-3 border-t-2 border-slate-200">
                <span className="text-sm font-black text-slate-900">Total Payable Amount</span>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#003366]">
                    ₹{finalAmount}
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    Inclusive of all GST & Taxes
                  </span>
                </div>
              </div>
            </div>

            {/* ====================================================
                COUPON INPUT BOX & LIVE PROMO CAROUSEL
               ==================================================== */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-[#003366]" />
                <span>Have a Promo Coupon?</span>
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-300">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-mono font-bold text-xs text-emerald-900 uppercase">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[11px] text-emerald-700 font-semibold">
                        {appliedCoupon.discountType === "PERCENTAGE"
                          ? `${appliedCoupon.discountValue}% discount applied`
                          : `₹${appliedCoupon.discountValue} flat discount applied`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer px-2 py-1 rounded hover:bg-rose-50"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (e.g. RRB2026)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-xs font-mono font-bold uppercase rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#003366]"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={isPending || !couponCodeInput.trim()}
                    className="px-4 py-2 rounded-lg bg-[#003366] hover:bg-[#002244] text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    {isPending ? "Validating..." : "Apply"}
                  </button>
                </div>
              )}

              {couponMessage && (
                <div
                  className={`text-[11px] p-2.5 rounded-lg flex items-center gap-2 ${couponMessage.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-rose-50 text-rose-800 border border-rose-200"
                    }`}
                >
                  {couponMessage.type === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )}
                  <span>{couponMessage.text}</span>
                </div>
              )}

              {/* Clickable Live Coupon Suggestions */}
              {availableCoupons.length > 0 && !appliedCoupon && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                    Available Offers for you:
                  </span>
                  <div className="space-y-1.5">
                    {availableCoupons.slice(0, 3).map((c) => (
                      <div
                        key={c.id}
                        className="p-2.5 rounded-xl border border-dashed border-slate-300 hover:border-[#003366] bg-slate-50/80 flex items-center justify-between gap-2 transition-colors group"
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-xs text-[#003366]">
                            {c.code}
                          </span>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {c.discountType === "PERCENTAGE"
                              ? `${c.discountValue}% OFF (Min ₹${c.minOrderAmount})`
                              : `₹${c.discountValue} FLAT OFF (Min ₹${c.minOrderAmount})`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleApplyCoupon(c.code)}
                          className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[#003366] font-bold text-[11px] hover:bg-[#003366] hover:text-white transition-colors cursor-pointer shadow-2xs"
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Proceed to Pay Action Button */}
            <div className="pt-2">
              <button
                onClick={handleProceedToPayment}
                disabled={isPending}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] disabled:opacity-50"
              >
                <Lock className="w-4 h-4 text-slate-950" />
                <span>
                  {candidate
                    ? `Pay Securely ₹${finalAmount}`
                    : "Log In & Complete Enrollment"}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>

            {/* Trust Badges Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-[10px] text-slate-400 font-semibold">
              <span>• UPI & Cards Supported</span>
              <span>• 100% Secure Payment</span>
              <span>• RBI Regulated</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PAYMENT GATEWAY ENGINE MODAL (MOCK SIMULATOR MODE)
         ======================================================== */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Gateway Header */}
            <div className="bg-[#0b192e] text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                  FE
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">PI EDUCATION Payment Gateway</h3>
                  <p className="text-[10px] text-slate-400 font-mono">Order Ref: {activeGatewayOrderId}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Payable Amount Highlight */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs shrink-0">
              <span className="font-bold text-slate-600">Total Payable:</span>
              <span className="text-xl font-black text-[#003366]">₹{finalAmount}</span>
            </div>

            {/* Mode Simulator Alert */}
            <div className="p-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] flex items-center gap-2 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Secure Payment Simulator Mode:</strong> Ready to verify course enrollment, atomic coupon redemption, and study materials unlocking.
              </span>
            </div>

            {/* Method Selection Tabs & Content */}
            <div className="p-5 space-y-4 text-xs overflow-y-auto flex-1">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPayMethod("UPI")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${selectedPayMethod === "UPI"
                      ? "border-[#003366] bg-sky-50 text-[#003366] font-bold shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                >
                  <QrCode className="w-5 h-5" />
                  <span className="text-[11px]">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayMethod("CARD")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${selectedPayMethod === "CARD"
                      ? "border-[#003366] bg-sky-50 text-[#003366] font-bold shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span className="text-[11px]">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPayMethod("NETBANKING")}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${selectedPayMethod === "NETBANKING"
                      ? "border-[#003366] bg-sky-50 text-[#003366] font-bold shadow-xs"
                      : "border-slate-200 hover:bg-slate-50 text-slate-600"
                    }`}
                >
                  <Building2 className="w-5 h-5" />
                  <span className="text-[11px]">NetBanking</span>
                </button>
              </div>

              {/* Simulated Method Body */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
                {selectedPayMethod === "UPI" && (
                  <div className="space-y-2">
                    <div className="w-32 h-32 bg-white rounded-xl border border-slate-300 mx-auto p-2 flex items-center justify-center shadow-xs">
                      <QrCode className="w-28 h-28 text-slate-900" />
                    </div>
                    <p className="text-[11px] text-slate-600 font-semibold">
                      Scan QR with Google Pay, PhonePe, Paytm, or any UPI App
                    </p>
                  </div>
                )}

                {selectedPayMethod === "CARD" && (
                  <div className="space-y-2 py-3">
                    <CreditCard className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">All Major Cards Accepted</p>
                    <p className="text-[11px] text-slate-500">
                      Visa, MasterCard, RuPay, and Maestro supported.
                    </p>
                  </div>
                )}

                {selectedPayMethod === "NETBANKING" && (
                  <div className="space-y-2 py-3">
                    <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">Direct Netbanking Portals</p>
                    <p className="text-[11px] text-slate-500">
                      SBI, HDFC, ICICI, Axis, PNB, and 50+ Indian Banks.
                    </p>
                  </div>
                )}
              </div>

              {/* Simulation Action Controls */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={() => handleSimulatePayment(true)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {paymentProcessing ? "Verifying Transaction..." : "Simulate Successful Payment (Unlock Course)"}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={paymentProcessing}
                  onClick={() => handleSimulatePayment(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>Simulate Payment Failure / Abort (Preserve Coupon)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
