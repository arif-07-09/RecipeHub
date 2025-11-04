<script setup lang="ts">
import { useFavoritesStore } from '~/store/favorites'
import RecipeCard from '~/components/RecipeCard.vue'

// 🧭 Router setup for pagination
const favStore = useFavoritesStore()
const route = useRoute()
const router = useRouter()

const perPage = 20
const currentPage = ref(Number(route.query.page) || 1)
const loading = ref(false)

// 🔹 Total pages based on favorite count
const totalPages = computed(() => Math.ceil(favStore.favorites.length / perPage))

// 🔹 Paginated favorites
const paginatedFavorites = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return favStore.favorites.slice(start, start + perPage)
})

// 🔹 Watch query param (sync URL)
watch(
  () => route.query.page,
  (newVal) => {
    const page = Number(newVal) || 1
    if (page !== currentPage.value) currentPage.value = page
  }
)

// 🔹 Change page + smooth scroll
async function changePage(page: number) {
  if (page < 1 || page > totalPages.value) return
  loading.value = true
  currentPage.value = page
  router.replace({ query: { ...route.query, page } })
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await new Promise((resolve) => setTimeout(resolve, 300))
  loading.value = false
}
</script>

<template>
  <!-- ✅ Added pt-24 to stay below sticky NavBar -->
  <div class="pb-20 pt-24 px-4 md:px-8">
    <!-- 🌟 Title -->
    <h1 class="text-3xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 text-center">
      ❤️ Your Favorite Recipes
    </h1>

    <!-- ⚠️ Empty state -->
    <div
      v-if="favStore.favorites.length === 0 && !loading"
      class="text-gray-500 dark:text-gray-400 text-center text-lg mt-10"
    >
      No favorites yet. Go add some from the home page!
    </div>

    <!-- 🌀 Loading animation -->
    <div
      v-else-if="loading"
      class="flex flex-col justify-center items-center h-64 space-y-3"
    >
      <div
        class="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
      ></div>
      <span
        class="text-indigo-600 dark:text-indigo-300 text-sm font-semibold animate-pulse mt-3"
      >
        Loading favorites...
      </span>
    </div>

    <!-- ✅ Paginated favorites grid -->
    <div
      v-else
      class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    >
      <RecipeCard
        v-for="r in paginatedFavorites"
        :key="r.idMeal"
        :recipe="r"
      />
    </div>

    <!-- 📄 Pagination controls -->
    <div
      v-if="favStore.favorites.length > perPage && !loading"
      class="flex justify-center items-center gap-2 flex-wrap mt-8"
    >
      <button
        @click="changePage(currentPage - 1)"
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
        @click="changePage(page)"
        :class="[ 
          'px-3 py-2 border rounded-lg transition',
          currentPage === page
            ? 'bg-indigo-500 text-white border-indigo-500 dark:bg-indigo-600'
            : 'bg-white hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-2 border rounded-lg bg-white hover:bg-gray-100 
               dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 
               text-gray-800 dark:text-gray-200 disabled:opacity-50 transition"
      >
        Next →
      </button>
    </div>

    <!-- 📘 Page info -->
    <p
      v-if="favStore.favorites.length > 0 && !loading"
      class="text-sm text-gray-500 dark:text-gray-400 text-center mt-3"
    >
      Showing page {{ currentPage }} of {{ totalPages }}
      ({{ favStore.favorites.length }} total)
    </p>
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
