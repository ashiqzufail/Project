/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6366f1", // Indigo 500
          hover: "#4f46e5",   // Indigo 600
        },
        secondary: {
          DEFAULT: "#ec4899", // Pink 500
          hover: "#db2777",   // Pink 600
        },
        background: "#0f172a", // Slate 900
        surface: "#1e293b",    // Slate 800
        text: {
          DEFAULT: "#f8fafc", // Slate 50
          muted: "#94a3b8",   // Slate 400
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
