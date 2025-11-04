/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // enables 'dark:' mode manually
  safelist: [
    // ✅ Keep grid and responsive layouts
    'grid',
    'sm:grid-cols-2',
    'md:grid-cols-3',
    'lg:grid-cols-4',
    'gap-6',
    'px-2',
    'md:px-6',
  ],
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
    './store/**/*.{js,ts}',       // ✅ Include stores
    './plugins/**/*.{js,ts}',     // ✅ Include plugins
    './composables/**/*.{js,ts}', // ✅ Include composables
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
