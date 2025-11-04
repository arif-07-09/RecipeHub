<template>
  <div
    class="relative rounded-xl overflow-hidden shadow hover:shadow-lg 
           transition-transform bg-white dark:bg-gray-800 
           hover:scale-[1.02] cursor-pointer"
  >
    <!-- Wrap only main card in NuxtLink -->
    <NuxtLink :to="`/recipe/${recipe.idMeal}`" class="block">
      <!-- Image -->
      <img
        :src="recipe.strMealThumb"
        :alt="recipe.strMeal"
        class="w-full h-48 object-cover"
      />

      <!-- Content -->
      <div class="p-3">
        <h2
          class="font-semibold text-lg truncate text-gray-800 dark:text-gray-100"
        >
          {{ recipe.strMeal }}
        </h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {{ recipe.strCategory || 'Recipe' }}
        </p>
      </div>
    </NuxtLink>

    <!-- Favorite Button -->
    <button
      @click.stop="toggleFavorite()"
      class="absolute top-2 right-2 bg-white/90 dark:bg-gray-700/90 
                 p-2 rounded-full shadow hover:scale-110 transition"
      :class="{ 'text-red-500': isFav, 'text-gray-400 dark:text-gray-300': !isFav }"
      aria-label="Add to favorites"
    >
      <span v-if="isFav">❤️</span>
      <span v-else>🤍</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import { useFavoritesStore } from '~/store/favorites'

const { recipe } = defineProps<{ recipe: Recipe }>()
const favStore = useFavoritesStore()

// ✅ Reactive favorite check
const isFav = computed(() => favStore.isFavorite(recipe.idMeal))

// ✅ Toggle favorite (without redirect)
function toggleFavorite() {
  favStore.toggleFavorite(recipe)
}
</script>

<style scoped>
button {
  transition: transform 0.15s ease-in-out;
}
button:hover {
  transform: scale(1.1);
}
</style>
