import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#040812",
          50: "#f4f6fb",
          100: "#e7eaf3",
          200: "#cbd2e3",
          300: "#9ea9c5",
          400: "#6b7aa3",
          500: "#4b5b85",
          600: "#36446a",
          700: "#283354",
          800: "#171f3a",
          900: "#0a1124",
          950: "#040812",
        },
        mint: {
          DEFAULT: "#00E5A0",
          50: "#e6fff7",
          100: "#b3ffe5",
          200: "#80ffd2",
          300: "#4dffc0",
          400: "#1affae",
          500: "#00E5A0",
          600: "#00b380",
          700: "#008060",
          800: "#004d3a",
          900: "#001a14",
        },
        surface: {
          DEFAULT: "#0a1024",
          raised: "#101934",
          overlay: "#1a2348",
        },
        line: "rgba(255,255,255,0.08)",
      },
      fontFamily: {
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem,6vw,5.5rem)", { lineHeight: "1", letterSpacing: "-0.04em" }],
        "display-lg": ["clamp(2.25rem,4.5vw,4rem)", { lineHeight: "1.05", letterSpacing: "-0.035em" }],
        "display-md": ["clamp(1.75rem,3vw,2.75rem)", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "mint-gradient":
          "linear-gradient(135deg, #00E5A0 0%, #4dffc0 50%, #80ffd2 100%)",
        "hero-gradient":
          "radial-gradient(ellipse at top, rgba(0,229,160,0.18), transparent 60%), radial-gradient(ellipse at bottom right, rgba(0,229,160,0.08), transparent 50%)",
      },
      backgroundSize: { grid: "48px 48px" },
      boxShadow: {
        glow: "0 0 60px -10px rgba(0,229,160,0.45)",
        "glow-sm": "0 0 30px -5px rgba(0,229,160,0.35)",
        glass: "0 8px 32px 0 rgba(0,0,0,0.4)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        shimmer: "shimmer 2.5s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
