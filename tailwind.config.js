/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#0B0F1F",
          soft: "#111737",
          card: "#151B37"
        },
        accent: {
          DEFAULT: "#6D5DF6",
          soft: "#8B7CFA",
          pink: "#F0578C"
        }
      },
      fontFamily: {
        display: ["'Clash Display'", "Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 40px rgba(109,93,246,0.35)"
      }
    },
  },
  plugins: [],
}
