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
        // Theme-driven (resolved via CSS vars in globals.css)
        war: "rgb(var(--c-war) / <alpha-value>)",
        flame: "rgb(var(--c-flame) / <alpha-value>)",
        gold: "rgb(var(--c-gold) / <alpha-value>)",
        cyan: "rgb(var(--c-cyan) / <alpha-value>)",
        plasma: "rgb(var(--c-plasma) / <alpha-value>)",
        warDark: "#b8261f",
        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
        muted: "#9ca3af",
        accent: "rgb(var(--c-war) / <alpha-value>)",
        accent2: "rgb(var(--c-flame) / <alpha-value>)",
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
