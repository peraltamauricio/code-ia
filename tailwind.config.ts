import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0a0714",
        bg2: "#120c22",
        ink: "#f3f0fb",
        "ink-dim": "#b6acd6",
        "ink-faint": "#786e9e",
        violet: "#a855f7",
        "violet-soft": "#c084fc",
        "violet-deep": "#6d28d9",
        amber: "#fbbf24",
        line: "rgba(255,255,255,0.09)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        pill: "999px",
      },
    },
  },
  plugins: [],
};

export default config;
