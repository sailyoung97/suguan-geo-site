import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1f2421",
        moss: "#536b55",
        clay: "#b86f4d",
        rice: "#f6f1e8",
        paper: "#fffaf2",
        line: "#ded4c5"
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans SC",
          "PingFang SC",
          "Microsoft YaHei",
          "sans-serif"
        ],
        serif: [
          "Noto Serif SC",
          "Songti SC",
          "SimSun",
          "serif"
        ]
      },
      boxShadow: {
        soft: "0 24px 70px rgba(42, 46, 38, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
