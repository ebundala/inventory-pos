/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}", 
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./types/**/*.{ts,jsx,tsx,js}",
    "./components/**/*.{ts,jsx,tsx,js}",
    "./lib/**/*.{ts,jsx,tsx,js}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

