export default defineNuxtConfig({
  // ✅ Load global styles
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    SPOONACULAR_KEY: process.env.SPOONACULAR_KEY, // server-side only
  },
  // ✅ Ensures Nuxt 4 compatibility for current version
  compatibilityDate: '2025-10-30',

  // ✅ Enable Pinia (for global state management)
  modules: ['@pinia/nuxt', '@nuxtjs/color-mode'],
  colorMode: {
    preference: 'system',   // default theme on first load
    fallback: 'light',      // if system is unknown
    classSuffix: '',        // <-- IMPORTANT: produces 'dark' (not 'dark-mode')
    storageKey: 'theme',    // same key you were using
  },
  // ✅ App-wide <head> configuration
  app: {
    head: {
      title: 'RecipeHub 🍳',
      meta: [{ name: 'description', content: 'Discover, search, and favorite recipes easily!' }],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        },
      ],
    },
  },

  // ✅ PostCSS plugins (Tailwind + Autoprefixer)
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // ✅ Optional: Nuxt DevTools (for debugging + Pinia inspector)
  devtools: { enabled: true },
})
