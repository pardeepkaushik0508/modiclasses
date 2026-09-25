import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Five Education | RDSO Railway Psycho CBT Test Engine & LMS",
  description:
    "Next-generation RDSO Railway Psycho CBT Test Engine and Learning Management System for Indian Railways RRB ALP, Station Master (SM), and Aptitude Batteries.",
  keywords: [
    "RDSO",
    "Railway Psycho Test",
    "RRB ALP",
    "Station Master",
    "CBT Test Engine",
    "Five Education",
    "Memory Test",
    "T-Score",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-[#f8fafc] text-slate-900 antialiased flex flex-col`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
