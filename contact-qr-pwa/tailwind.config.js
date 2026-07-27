/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Material Design 3 - Light Theme
        surface: {
          DEFAULT: "#FFFBFE", // Surface
          variant: "#E7E0EC", // Surface Variant
        },
        primary: {
          DEFAULT: "#6750A4", // Primary Purple
          on: "#FFFFFF",      // On Primary (White)
        },
        outline: "#79747E",   // Outline
        text: {
          primary: "#1C1B1F",  // On Surface
          secondary: "#49454F",// On Surface Variant
        },
        background: "#FFFBFE", // Background
      },
    },
  },
  plugins: [],
};
