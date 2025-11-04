<template>
  <nav
    class="bg-white dark:bg-gray-900 shadow-sm fixed w-full top-0 z-50 transition-colors duration-300"
  >
    <div class="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
      <NuxtLink
        to="/"
        class="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"
      >
        RecipeHub 🍳
      </NuxtLink>
      <div class="flex items-center gap-4">
        <!-- 🌗 Dark / Light Theme Toggle -->
        <button
          @click="toggleTheme"
          class="text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 transition"
        >
          <!-- ☀️ Light Icon -->
          <svg
            v-if="!isDark"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 3v1m0 16v1m8.66-8.66h1M3.34 12H2m15.36 6.36l.7.7M6.34 6.34l-.7-.7m12.02 0l.7-.7M6.34 17.66l-.7.7M12 8a4 4 0 100 8 4 4 0 000-8z"
            />
          </svg>

          <!-- 🌙 Dark Icon -->
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        </button>

        <!-- 📱 Mobile Menu Toggle -->
        <button
          @click="toggleMenu"
          class="md:hidden text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 focus:outline-none"
        >
          <svg
            v-if="!isMenuOpen"
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 💻 Desktop Menu -->
      <div class="hidden md:flex gap-6 text-gray-800 dark:text-gray-200">
        <NuxtLink to="/" class="hover:text-indigo-600 dark:hover:text-indigo-400">
          Home
        </NuxtLink>
        <NuxtLink
          to="/favorites"
          class="hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          Favorites
        </NuxtLink>
        <NuxtLink
          to="/about"
          class="hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          About
        </NuxtLink>
      </div>
    </div>

    <!-- 📱 Mobile Menu -->
    <div
      v-if="isMenuOpen"
      class="md:hidden border-t bg-white dark:bg-gray-800 shadow-inner flex flex-col items-center py-3 space-y-2 animate-slideDown text-gray-700 dark:text-gray-200"
    >
      <NuxtLink
        to="/"
        class="hover:text-indigo-600 dark:hover:text-indigo-400"
        @click="closeMenu"
      >
        Home
      </NuxtLink>
      <NuxtLink
        to="/favorites"
        class="hover:text-indigo-600 dark:hover:text-indigo-400"
        @click="closeMenu"
      >
        Favorites
      </NuxtLink>
      <NuxtLink
        to="/about"
        class="hover:text-indigo-600 dark:hover:text-indigo-400"
        @click="closeMenu"
      >
        About
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// 📱 Mobile menu state
const isMenuOpen = ref(false)

// 🌓 Use Nuxt Color Mode for automatic theme management
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (val: boolean) => (colorMode.preference = val ? 'dark' : 'light'),
})

// 🌗 Toggle dark/light theme
function toggleTheme() {
  isDark.value = !isDark.value
}

// 📱 Menu toggle
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
function closeMenu() {
  isMenuOpen.value = false
}

// ✅ Auto-close menu on route change
const router = useRouter()
router.afterEach(() => {
  isMenuOpen.value = false
})
</script>

<style scoped>
@keyframes slideDown {
  0% {
    opacity: 0;
    transform: translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slideDown {
  animation: slideDown 0.2s ease-out;
}
</style>
