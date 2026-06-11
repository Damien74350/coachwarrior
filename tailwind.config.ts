import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Theme-driven (resolved via CSS vars in globals.css)
        foreground: "rgb(var(--c-fg) / <alpha-value>)",
        overlay: "rgb(var(--c-overlay) / <alpha-value>)",
        surface: "rgb(var(--c-surface) / <alpha-value>)",
        border: "rgb(var(--c-border) / <alpha-value>)",
        muted: "rgb(var(--c-muted) / <alpha-value>)",
        war: "rgb(var(--c-war) / <alpha-value>)",
        flame: "rgb(var(--c-flame) / <alpha-value>)",
        gold: "rgb(var(--c-gold) / <alpha-value>)",
        cyan: "rgb(var(--c-cyan) / <alpha-value>)",
        plasma: "rgb(var(--c-plasma) / <alpha-value>)",
        accent: "rgb(var(--c-war) / <alpha-value>)",
        accent2: "rgb(var(--c-flame) / <alpha-value>)",
        // Fixed semantic colors
        background: "var(--bg-base)",
        warDark: "#b8261f",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        display: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
