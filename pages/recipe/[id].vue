<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useFavoritesStore } from '~/store/favorites'

const route = useRoute()
const favStore = useFavoritesStore()
const id = route.params.id as string

// Fetch recipe details from TheMealDB
const { data, pending, error } = await useAsyncData(`recipe-${id}`, async () => {
  const res = await $fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
  return res.meals ? res.meals[0] : null
})

const recipe = computed(() => data.value)
const isFav = computed(() => recipe.value && favStore.isFavorite(recipe.value.idMeal))

function toggleFavorite() {
  if (recipe.value) favStore.toggleFavorite(recipe.value)
}

// Build ingredients list dynamically
const ingredients = computed(() => {
  if (!recipe.value) return []
  const list = []
  for (let i = 1; i <= 20; i++) {
    const ing = recipe.value[`strIngredient${i}`]
    const measure = recipe.value[`strMeasure${i}`]
    if (ing && ing.trim()) list.push(`${measure || ''} ${ing}`.trim())
  }
  return list
})

const missingIngredients = computed(() => ingredients.value.length === 0)
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow mt-6">
    <div v-if="pending" class="text-gray-500 text-lg">Loading recipe details...</div>
    <div v-else-if="error || !recipe" class="text-red-500 text-lg">Failed to load recipe 😢</div>

    <div v-else>
      <NuxtLink to="/" class="text-indigo-500 hover:underline mb-4 inline-block">← Back to Recipes</NuxtLink>

      <div class="flex flex-col md:flex-row gap-6 items-start">
        <img :src="recipe.strMealThumb" :alt="recipe.strMeal" class="w-full md:w-1/2 rounded-lg shadow" />
        <div class="flex-1">
          <div class="flex items-center justify-between mb-2">
            <h1 class="text-3xl font-bold text-indigo-600">{{ recipe.strMeal }}</h1>
            <button
              @click="toggleFavorite"
              class="p-2 rounded-full border hover:bg-indigo-50 transition"
              :class="{ 'text-red-500': isFav, 'text-gray-400': !isFav }"
            >
              <span v-if="isFav">❤️</span>
              <span v-else>🤍</span>
            </button>
          </div>
          <p class="text-gray-600">Category: {{ recipe.strCategory }}</p>
          <p class="text-gray-600">Area: {{ recipe.strArea }}</p>
        </div>
      </div>

      <!-- Ingredients -->
      <div class="mt-6">
        <h2 class="text-2xl font-semibold mb-2">🧂 Ingredients</h2>
        <ul v-if="!missingIngredients" class="list-disc pl-6 space-y-1">
          <li v-for="(item, index) in ingredients" :key="index">{{ item }}</li>
        </ul>
        <p v-else class="text-red-500">⚠️ Ingredient data missing for this recipe.</p>
      </div>

      <!-- Instructions -->
      <div class="mt-6">
        <h2 class="text-2xl font-semibold mb-2">📜 Instructions</h2>
        <p class="text-gray-700 leading-relaxed whitespace-pre-line">
          {{ recipe.strInstructions || 'No instructions available.' }}
        </p>
      </div>

      <!-- YouTube Video -->
      <div v-if="recipe.strYoutube" class="mt-6">
        <h2 class="text-2xl font-semibold mb-2">🎥 Tutorial Video</h2>
        <iframe
          class="w-full aspect-video rounded-lg"
          :src="`https://www.youtube.com/embed/${recipe.strYoutube.split('v=')[1]}`"
          allowfullscreen
        ></iframe>
      </div>
    </div>
  </div>
</template>
