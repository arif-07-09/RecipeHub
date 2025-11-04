/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enables 'dark:' mode manually
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7C3AED',
          light: '#A78BFA',
          dark: '#4C1D95',
        },
        accent: {
          DEFAULT: '#06B6D4',
        },
      },
    },
  },
  plugins: [],
}
