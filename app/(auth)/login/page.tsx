"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  UserCheck,
  KeyRound,
  HelpCircle,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Quick fill helper for testing/evaluating
  const fillCredentials = (type: "admin" | "student") => {
    if (type === "admin") {
      setIdentifier("admin@fiveeducation.com");
      setPassword("AdminPassword123");
    } else {
      setIdentifier("student.demo@fiveeducation.in");
      setPassword("StudentPassword123");
    }
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setErrorMessage("Please enter your registered Email or Phone number.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        identifier: identifier.trim(),
        password,
      });

      if (res?.error) {
        setErrorMessage(
          res.error === "CredentialsSignin"
            ? "Invalid email/phone or password. Please verify and try again."
            : res.error
        );
        setIsLoading(false);
        return;
      }

      if (res?.ok) {
        setSuccessMessage("Authentication successful! Redirecting...");

        // Fetch fresh session to identify candidate role
        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();
        const role = session?.user?.role;

        // Redirect based on role or safe callbackUrl
        setTimeout(() => {
          if (callbackUrl && !callbackUrl.includes("/login") && !callbackUrl.includes("/register")) {
            // If student trying to go to /admin, force /dashboard
            if (callbackUrl.startsWith("/admin") && role !== "ADMIN") {
              router.push("/dashboard");
            } else {
              router.push(callbackUrl);
            }
          } else if (role === "ADMIN") {
            router.push("/admin");
          } else {
            router.push("/dashboard");
          }
          router.refresh();
        }, 600);
      }
    } catch (err: unknown) {
      console.error("Sign-in error:", err);
      setErrorMessage("An unexpected network error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Five Education Themed Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden backdrop-blur-sm">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#0f172a] p-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 mb-3 shadow-inner">
            <ShieldCheck className="w-6 h-6 text-sky-200" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Five Education CBT Portal</h2>
          <p className="text-xs text-sky-100/90 mt-1">
            Indian Railways RDSO Psycho Test Candidate & Admin Login
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-medium text-sky-100">
            <Lock className="w-3 h-3 text-sky-300" />
            <span>256-Bit SSL Encrypted CBT Session</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-5">
          {/* Toast / Alert Feedback */}
          {errorMessage && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm animate-in fade-in slide-in-from-top-1 duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{successMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email or Phone Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="identifier"
                className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
              >
                Email Address or Phone Number
              </label>
              <div className="relative">
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. candidate@domain.com or 9876543210"
                  disabled={isLoading}
                  required
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all disabled:opacity-50"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                You can log in using either your email or 10-digit mobile number.
              </p>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-slate-700 tracking-wide uppercase"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  disabled={isLoading}
                  required
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-slate-300 bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#0284c7] focus:border-transparent transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to CBT Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Autofill helper */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mb-2">
              <KeyRound className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>Quick Test Credentials:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials("admin")}
                className="text-left px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-[11px]"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  Admin Login
                </div>
                <div className="text-slate-500 truncate mt-0.5">admin@fiveeducation.com</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials("student")}
                className="text-left px-2.5 py-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-[11px]"
              >
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  Student Login
                </div>
                <div className="text-slate-500 truncate mt-0.5">student.demo@fiveeducation.in</div>
              </button>
            </div>
          </div>

          {/* Switch to Register */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Don&apos;t have an RDSO candidate account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#0284c7] hover:text-[#0369a1] hover:underline"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-[#f1f5f9] to-slate-200 flex flex-col justify-center items-center px-4 py-12">
      <Suspense fallback={<div className="text-slate-500 text-sm">Loading login portal...</div>}>
        <LoginForm />
      </Suspense>

      <footer className="mt-8 text-center text-xs text-slate-500 space-y-1">
        <p>&copy; {new Date().getFullYear()} Five Education • RDSO Railway Psycho CBT Engine</p>
        <p>RRB ALP, Station Master & Aptitude Battery Preparation</p>
      </footer>
    </div>
  );
}
