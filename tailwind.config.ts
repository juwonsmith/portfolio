import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#05060c",
          800: "#0a0c16",
          700: "#11131f",
          600: "#1a1d2e",
        },
        accent: {
          DEFAULT: "#7aa2ff",
          glow: "#a9c0ff",
          deep: "#4f6bff",
        },
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out both",
        marquee: "marquee 24s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
