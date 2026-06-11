import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#13131a",
        surfaceAlt: "#1c1c26",
        border: "#2a2a38",
        // WARfit palette
        war: "#ff3b30",
        warDark: "#b8261f",
        flame: "#ff7a18",
        gold: "#ffc83d",
        plasma: "#7c5cff",
        cyan: "#22d3ee",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        muted: "#9ca3af",
        accent: "#ff3b30",
        accent2: "#ff7a18",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        display: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 59, 48, 0.25)",
        glowFlame: "0 0 30px rgba(255, 122, 24, 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config;
