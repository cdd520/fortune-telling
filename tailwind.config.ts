import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        wood: {
          DEFAULT: "#22c55e",
          light: "#4ade80",
          dark: "#16a34a",
        },
        fire: {
          DEFAULT: "#ef4444",
          light: "#f87171",
          dark: "#dc2626",
        },
        earth: {
          DEFAULT: "#eab308",
          light: "#facc15",
          dark: "#ca8a04",
        },
        metal: {
          DEFAULT: "#f8fafc",
          light: "#ffffff",
          dark: "#e2e8f0",
        },
        water: {
          DEFAULT: "#1e293b",
          light: "#334155",
          dark: "#0f172a",
        },
        lucky: {
          DEFAULT: "#fbbf24",
          light: "#fcd34d",
          dark: "#f59e0b",
        },
        unlucky: {
          DEFAULT: "#dc2626",
          light: "#ef4444",
          dark: "#b91c1c",
        },
        neutral: {
          DEFAULT: "#6b7280",
          light: "#9ca3af",
          dark: "#4b5563",
        },
        traditional: {
          bg: "#1a1a2e",
          card: "#16213e",
          border: "#0f3460",
          gold: "#ffd700",
          red: "#c41e3a",
          accent: "#e94560",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        traditional: ["var(--font-traditional)", "KaiTi", "STKaiti", "serif"],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "taiji-rotate": "taiji-rotate 3s ease-in-out",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(251, 191, 36, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(251, 191, 36, 0.6)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "taiji-rotate": {
          "0%": { transform: "rotate(0deg) scale(0.5)", opacity: "0" },
          "50%": { transform: "rotate(180deg) scale(1.2)", opacity: "1" },
          "100%": { transform: "rotate(360deg) scale(1)", opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "cloud-pattern": "url('/images/cloud-pattern.svg')",
        "taiji-gradient": "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
