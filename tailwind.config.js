/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Essential line
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}