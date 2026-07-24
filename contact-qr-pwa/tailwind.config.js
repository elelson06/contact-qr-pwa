/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Alto contraste para maximizar legibilidad del QR y la UI en general
        brand: {
          bg: "#0f172a",
          accent: "#22d3ee",
        },
      },
    },
  },
  plugins: [],
};
