import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // RDSO Official CBT Test Engine Theme Palette
        rdso: {
          primary: "#0284c7",       // Sky-600 RDSO Standard Blue
          dark: "#0369a1",          // Sky-700 RDSO Active/Hover Blue
          light: "#e0f2fe",         // Sky-100 Light Blue tint
          subtle: "#f0f9ff",        // Sky-50 Background highlight
          header: "#e2e8f0",        // Slate-200 Header Gray
          headerDark: "#334155",    // Slate-700 Sub-header
          canvas: "#f8fafc",        // Slate-50 CBT neutral background
          border: "#cbd5e1",        // Slate-300 Standard Grid Border
          // RDSO CBT Status Palette
          answered: "#16a34a",      // Green: Answered
          unanswered: "#dc2626",    // Red: Visited but not answered
          notVisited: "#94a3b8",    // Slate: Not visited
          markedReview: "#9333ea",  // Purple: Marked for Review
          markedAnswered: "#7c3aed",// Violet: Answered & Marked for Review
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      aspectRatio: {
        "rdso-figure": "1 / 1",
        "rdso-brick": "3 / 2",
        "rdso-cbt": "4 / 3",
        "rdso-screen": "16 / 9",
      },
    },
  },
  plugins: [],
};

export default config;
