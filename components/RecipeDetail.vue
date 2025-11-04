<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
defineProps<{ recipe: Recipe }>()
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <img :src="recipe.image" :alt="recipe.title" class="rounded-lg w-full h-60 object-cover mb-4" />
    <h1 class="text-3xl font-bold mb-3 text-indigo-600">{{ recipe.title }}</h1>

    <div v-if="recipe.summary" class="prose max-w-none mb-4" v-html="recipe.summary"></div>
    <div v-if="recipe.instructions" class="prose max-w-none" v-html="recipe.instructions"></div>

    <a
      v-if="recipe.sourceUrl"
      :href="recipe.sourceUrl"
      target="_blank"
      class="text-indigo-500 hover:underline mt-4 inline-block"
    >
      View Full Recipe →
    </a>
  </div>
</template>
