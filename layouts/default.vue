<template>
    <!-- ✅ Root wrapper listens to global dark mode -->
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <NavBar />
  
      <!-- All pages slot inside here -->
      <main class="container mx-auto px-4 py-6">
        <slot />
      </main>
    </div>
  </template>
  
  <script setup lang="ts">
  import NavBar from '~/components/NavBar.vue'
  </script>
  