/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0c8a5a',
        'primary-dark': '#0a6d48',
        'primary-light': '#e8f5f0',
        accent: '#f97316',
        'bg-color': '#F8FFF8',
        'border-color': '#40E0D0',
        'heading-color': '#038C2A',
        'btn-color': '#038C2A',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
      },
      screens: {
        'xs': '320px',
      },
    },
  },
  plugins: [],
}
