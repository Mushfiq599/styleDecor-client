/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        primary: "#0D9488",
        secondary: "#F97316",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#0D9488",
          "secondary": "#F97316",
          "accent": "#0D9488",
          "neutral": "#0F172A",
          "base-100": "#F8FAFC",
          "base-200": "#F1F5F9",
          "base-300": "#E2E8F0",
          "base-content": "#0F172A",
        },
        dark: {
          "primary": "#0D9488",
          "secondary": "#F97316",
          "accent": "#F97316",
          "neutral": "#F8FAFC",
          "base-100": "#0F172A",
          "base-200": "#1E293B",
          "base-300": "#334155",
          "base-content": "#F8FAFC",
        },
      },
    ],
  },
};