import forms from '@tailwindcss/forms'
import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/admin/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "1rem" },
    extend: {
      borderRadius: { xl: "0.75rem", "2xl": "1rem" },
      boxShadow: { soft: "0 1px 3px rgba(0,0,0,.08)" },
      colors: {
        brand: { DEFAULT: "#111111", 50: "#f5f5f5", 100: "#e5e5e5" },
      },
      fontFamily: {
        sans: ['Inter','ui-sans-serif','system-ui','Segoe UI','Roboto','Arial','sans-serif'],
      },
    },
  },
  plugins: [forms, typography],
}
