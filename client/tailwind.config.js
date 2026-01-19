/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ THIS LINE IS MUST
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: "#121418",
        darkCardBg: "#1e253a",
      },
    },
  },
  plugins: [],
};
