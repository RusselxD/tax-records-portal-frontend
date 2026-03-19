/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        // Design system colors
        primary: {
          DEFAULT: "#031731",
          dark: "#020f20",
        },
        accent: {
          DEFAULT: "#d0a865",
          hover: "#b8904d",
          light: "#fdf5e6",
        },
        sidebar: {
          bg: "#031731",
        },
        status: {
          approved: "#16A34A", // Green
          pending: "#D97706", // Amber
          rejected: "#DC2626", // Red
          inactive: "#9CA3AF", // Gray
        },
        content: {
          bg: "#FFFFFF",
        },
      },
    },
  },
  plugins: [],
};
