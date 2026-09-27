/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6D4C41",
          light: "#8D6E63",
          dark: "#4E342E",
        },
        secondary: "#D7CCC8",
        accent: "#BCAAA4",
        background: "#FAF9F7",
        ink: "#2C2C2C",
        success: "#4CAF50",
        warning: "#FF9800",
        danger: "#E53935",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 20px rgba(44, 33, 28, 0.08)",
        cardHover: "0 10px 30px rgba(44, 33, 28, 0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
