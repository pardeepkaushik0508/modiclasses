"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<{
    name: string;
    email: string;
    rollNo: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Client-side validations
    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Please enter your Full Name (minimum 2 characters).");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (phone.trim()) {
      const numericDigits = phone.replace(/\D/g, "");
      if (numericDigits.length < 10) {
        setErrorMessage("Please enter a valid 10-digit mobile number.");
        return;
      }
    }

    if (!password || password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      // Success
      setRegisteredUser({
        name: data.user.name,
        email: data.user.email,
        rollNo: data.user.rollNo,
      });
      setIsLoading(false);
    } catch (err: unknown) {
      console.error("Registration error:", err);
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-[#f1f5f9] to-slate-200 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Five Education Themed Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden backdrop-blur-sm">
          {/* Header Ribbon */}
          <div className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0f172a] p-6 text-white text-center relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 mb-3 shadow-inner">
              <ShieldCheck className="w-6 h-6 text-sky-200" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Create RDSO Candidate Account</h2>
            <p className="text-xs text-sky-100/90 mt-1">
              Indian Railways Psycho CBT Testing Engine & LMS
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/20 border border-sky-300/30 text-[11px] font-semibold text-sky-100">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>Auto 6-Digit RDSO Roll Number Generation</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {/* If registered successfully, show congratulations and roll number card */}
            {registeredUser ? (
              <div className="space-y-5 text-center py-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Registration Successful!</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                    Welcome to Five Education, <span className="font-semibold text-slate-800">{registeredUser.name}</span>!
                    Your official RDSO CBT roll number has been generated.
                  </p>
                </div>

                <div className="bg-sky-50 border-2 border-dashed border-[#0284c7] rounded-xl p-4 max-w-xs mx-auto">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Official Candidate Roll Number
                  </div>
                  <div className="text-3xl font-mono font-extrabold text-[#0284c7] tracking-wider mt-1">
                    {registeredUser.rollNo}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1">
                    Use your Email or Phone to log in
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => router.push("/login")}
                    className="w-full py-3 px-4 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Error Banner */}
                {errorMessage && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1 font-medium">{errorMessage}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="name"
                      className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        disabled={isLoading}
                        required
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all disabled:opacity-50"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="email"
                        className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="candidate@gmail.com"
                          disabled={isLoading}
                          required
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="phone"
                        className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
                      >
                        Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          disabled={isLoading}
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Password & Confirm Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Password */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="password"
                        className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Min. 6 chars"
                          disabled={isLoading}
                          required
                          className="w-full px-3.5 py-2.5 pr-9 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="confirmPassword"
                        className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter password"
                          disabled={isLoading}
                          required
                          className="w-full px-3.5 py-2.5 pr-9 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all disabled:opacity-50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Roll Number Info Callout */}
                  <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900 flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-[#0284c7] shrink-0 mt-0.5" />
                    <span>
                      An official <strong>6-digit CBT Roll Number</strong> (e.g. 420101) will be automatically generated and linked to your candidate profile upon registration.
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full mt-2 py-3 px-4 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Registering Candidate...</span>
                      </>
                    ) : (
                      <>
                        <span>Complete Registration</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Switch to Login */}
                <div className="text-center pt-2 border-t border-slate-200">
                  <p className="text-xs text-slate-600">
                    Already registered for Five Education CBT?{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-[#0284c7] hover:text-[#0369a1] hover:underline"
                    >
                      Sign In Here
                    </Link>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-xs text-slate-500 space-y-1">
        <p>&copy; {new Date().getFullYear()} Five Education &bull; RDSO Railway Psycho CBT Engine</p>
        <p>Aptitude Batteries for Indian Railways RRB Assistant Loco Pilot & Station Master</p>
      </footer>
    </div>
  );
}
