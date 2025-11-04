import { useFavoritesStore } from '~/store/favorites'

export default defineNuxtPlugin(() => {
  const favStore = useFavoritesStore()

  // Load favorites from localStorage
  const saved = localStorage.getItem('favorites')
  if (saved) favStore.favorites = JSON.parse(saved)

  // Watch and save on change
  watch(
    () => favStore.favorites,
    (val) => localStorage.setItem('favorites', JSON.stringify(val)),
    { deep: true }
  )
})
