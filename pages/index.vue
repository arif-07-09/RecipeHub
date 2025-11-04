<script setup lang="ts">
import type { Recipe } from '~/types/recipe'
import RecipeCard from '~/components/RecipeCard.vue'

// 🧭 Router setup
const route = useRoute()
const router = useRouter()

// 🔹 State
const search = ref<string>((route.query.q as string) || '')
const category = ref<string>((route.query.category as string) || '')
const sort = ref<string>((route.query.sort as string) || 'asc')
const currentPage = ref<number>(Number(route.query.page) || 1)
const perPage = 20

// 🔹 Build API Query
const buildQuery = () => {
  const params = new URLSearchParams({
    q: search.value || '',
    category: category.value || '',
    sort: sort.value,
    page: String(currentPage.value),
    limit: String(perPage),
  })
  return params.toString()
}

// 🔹 Fetch Recipes
const fetchRecipes = async () => {
  const query = buildQuery()
  return await $fetch(`/api/recipes?${query}`)
}

// ⚙️ useAsyncData (Reactive SSR Fetch)
const { data, pending, error, refresh } = await useAsyncData('recipes', fetchRecipes, {
  watch: [currentPage, category, sort],
})

// 🔹 Computed
const recipes = computed(() => (data.value?.results as Recipe[]) || [])
const totalPages = computed(() => data.value?.totalPages || 1)
const total = computed(() => data.value?.total || recipes.value.length)

// 🧠 Debounced Search (400ms)
let debounceTimer: NodeJS.Timeout | null = null
watch(search, (newVal, oldVal) => {
  if (newVal === oldVal) return
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(async () => {
    currentPage.value = 1
    router.replace({
      query: {
        ...route.query,
        q: newVal || undefined,
        category: category.value || undefined,
        sort: sort.value,
        page: 1,
      },
    })
    await refresh()
  }, 400)
})

// 🔁 Watch filters/page/sort to update URL
watch([currentPage, category, sort], () => {
  router.replace({
    query: {
      q: search.value || undefined,
      category: category.value || undefined,
      sort: sort.value,
      page: String(currentPage.value),
    },
  })
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// 🧭 Pagination Controls
function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page
}

// 🪪 SEO Title
useHead({
  title: computed(() =>
    search.value
      ? `RecipeHub 🍳 | ${search.value} Recipes`
      : `RecipeHub 🍳 | Discover Recipes`
  ),
})
</script>

<template>
  <!-- ✅ Added pt-24 to push below sticky NavBar -->
  <div class="pb-20 pt-24 px-4 md:px-8">
    <!-- 🌟 Title -->
    <h1 class="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 text-center">
      🍳 Discover Recipes
    </h1>

    <!-- 🔍 Search + Filter + Sort Bar -->
    <form
      class="flex flex-col md:flex-row items-center justify-center gap-3 mb-6 max-w-5xl mx-auto 
             bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl 
             shadow-sm p-3 transition-colors"
      @submit.prevent="refresh()"
    >
      <!-- Search Input -->
      <input
        v-model="search"
        type="text"
        placeholder="Search recipes (e.g. chicken, pasta, dessert)..."
        class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 
               w-full md:w-1/2 focus:ring-2 focus:ring-indigo-400 
               bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
      />

      <!-- Filters Row -->
      <div class="flex flex-col sm:flex-row gap-3 w-full md:w-1/2">
        <select
          v-model="category"
          class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full 
                 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">All Categories</option>
          <option value="Chicken">Chicken</option>
          <option value="Seafood">Seafood</option>
          <option value="Dessert">Dessert</option>
          <option value="Pasta">Pasta</option>
          <option value="Vegetarian">Vegetarian</option>
          <option value="Lamb">Lamb</option>
          <option value="Side">Side</option>
          <option value="Breakfast">Breakfast</option>
          <option value="Miscellaneous">Miscellaneous</option>
          <option value="Ice Cream">Ice Cream</option>
        </select>

        <select
          v-model="sort"
          class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 w-full 
                 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                 focus:ring-2 focus:ring-indigo-400"
        >
          <option value="asc">Sort: A → Z</option>
          <option value="desc">Sort: Z → A</option>
        </select>
      </div>

      <!-- Search Button -->
      <button
        type="submit"
        class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg 
               dark:bg-indigo-600 dark:hover:bg-indigo-700 transition w-full md:w-auto"
      >
        Search
      </button>
    </form>

    <!-- 🌀 Loading -->
    <div v-if="pending" class="flex flex-col justify-center items-center h-64 space-y-3">
      <div class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <span class="text-indigo-600 dark:text-indigo-300 text-sm font-semibold animate-pulse mt-3">
        Loading recipes...
      </span>
    </div>

    <!-- ❌ Error -->
    <div v-else-if="error" class="text-red-500 dark:text-red-400 text-lg text-center">
      Failed to load recipes 😢
    </div>

    <!-- ✅ Recipe Grid -->
    <div
      v-else
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <RecipeCard v-for="r in recipes" :key="r.idMeal" :recipe="r" />
    </div>

    <!-- 📄 Pagination -->
    <div
      v-if="!pending && totalPages > 1"
      class="flex justify-center items-center gap-2 flex-wrap mt-8"
    >
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-3 py-2 border rounded-lg bg-white hover:bg-gray-100 
               dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 
               text-gray-800 dark:text-gray-200 disabled:opacity-50 transition"
      >
        ← Prev
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="goToPage(page)"
        :class="[ 'px-3 py-2 border rounded-lg transition',
          currentPage === page
            ? 'bg-indigo-500 text-white border-indigo-500 dark:bg-indigo-600'
            : 'bg-white hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 border rounded-lg bg-white hover:bg-gray-100 
               dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 
               text-gray-800 dark:text-gray-200 disabled:opacity-50 transition"
      >
        Next →
      </button>
    </div>

    <!-- ℹ️ Info -->
    <p v-if="!pending && total > 0" class="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">
      Showing page {{ currentPage }} of {{ totalPages }} ({{ total }} recipes)
    </p>

    <!-- 🪄 No Results -->
    <div
      v-if="!pending && !error && recipes.length === 0"
      class="text-gray-500 dark:text-gray-400 text-center mt-10 text-lg"
    >
      No recipes found. Try another search 🔍
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
