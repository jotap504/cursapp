/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        "primary": "#d97706", // Amber 600
        "secondary": "#fef3c7", // Amber 100
        "background-light": "#fefce8",
        "background-dark": "#1a120b", // Dark Earth
        "accent-teal": "#14b8a6",
        "accent-orange": "#f59e0b",
        "accent-magenta": "#d946ef",
        "sage": {
          50: '#f4f7f4',
          900: '#614d3a',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Montserrat', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
  safelist: [
    'scheme-1',
    'scheme-2',
    'scheme-3',
    'scheme-4',
    'scheme-5',
  ]
}
