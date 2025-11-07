/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'law-primary': '#0b3d91',
        'law-secondary': '#7b1e3a',
        'law-accent': '#d4af37',
        'law-bg-1': '#0c2d56',
        'law-bg-2': '#4b2338',
      }
    },
  },
  plugins: [],
}