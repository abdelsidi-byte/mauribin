import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#16a34a", 50: "#f0fdf4", 100: "#dcfce7", 800: "#166534", 900: "#14532d" },
        secondary: "#1e3a5f",
        accent: "#dc2626",
        gold: "#fbbf24",
      },
      fontFamily: {
        arabic: ["Noto Sans Arabic", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
