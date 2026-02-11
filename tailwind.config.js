/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pink: '#ff66b3', // Your cute pink
        bg: '#fffdf7',   // Light creamy background
        card: '#ffffff', // White card background
        text: '#333333', // Dark text
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Example font, ensure it's available or import one
      },
    },
  },
  plugins: [],
};
