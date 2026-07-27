/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Material Design 3 - Dark Theme inspired
        surface: {
          DEFAULT: "#18181b", // Zinc 900
          variant: "#27272a", // Zinc 800
        },
        primary: {
          DEFAULT: "#22d3ee", // Cyan 400
          on: "#0f172a", // Slate 900
        },
        outline: "#52525b", // Zinc 600
        text: {
          primary: "#f4f4f5", // Zinc 100
          secondary: "#a1a1aa", // Zinc 400
        },
      },
    },
  },
  plugins: [],
};
