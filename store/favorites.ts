import { defineStore } from 'pinia'

interface Recipe {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory?: string
}

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as Recipe[],
  }),

  actions: {
    addFavorite(recipe: Recipe) {
      const exists = this.favorites.find(r => r.idMeal === recipe.idMeal)
      if (!exists) this.favorites.push(recipe)
    },
    removeFavorite(id: string) {
      this.favorites = this.favorites.filter(r => r.idMeal !== id)
    },
    toggleFavorite(recipe: Recipe) {
      const exists = this.favorites.find(r => r.idMeal === recipe.idMeal)
      if (exists) {
        this.removeFavorite(recipe.idMeal)
      } else {
        this.addFavorite(recipe)
      }
    },
    isFavorite(id: string) {
      return this.favorites.some(r => r.idMeal === id)
    },
  },
})
