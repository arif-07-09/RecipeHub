<template>
  <!-- ✅ App Root with full theme + font setup -->
  <div
    class="min-h-screen bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-gray-100 font-inter transition-colors duration-300"
  >
    <!-- ✅ Layout Wrapper (uses layouts/default.vue) -->
    <NuxtLayout>
      <!-- ✅ Renders the active page -->
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// No need to import anything — Nuxt auto-imports NuxtPage & NuxtLayout
</script>

<style>
/* Smooth background and color transitions */
html,
body {
  transition: background-color 0.3s, color 0.3s;
}
</style>
