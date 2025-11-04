// /server/api/recipes.ts
export default defineEventHandler(async (event) => {
  try {
    // Extract query params
    const query = getQuery(event)
    const search = (query.q as string) || ''
    const category = (query.category as string) || ''
    const sort = (query.sort as string) || 'asc'
    const page = parseInt((query.page as string) || '1')
    const limit = parseInt((query.limit as string) || '20')

    // Helper to paginate
    const paginate = (items: any[], page: number, limit: number) => {
      const start = (page - 1) * limit
      return items.slice(start, start + limit)
    }

    // ✅ Search mode
    if (search.trim()) {
      const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`
      const res = await $fetch<{ meals: any[] | null }>(url)

      if (!res.meals) {
        return { results: [], page, total: 0, totalPages: 0 }
      }

      let meals = res.meals

      // 🔹 Filter by category if selected
      if (category) {
        meals = meals.filter(
          (m) =>
            m.strCategory &&
            m.strCategory.toLowerCase() === category.toLowerCase()
        )
      }

      // 🔹 Sort alphabetically
      meals.sort((a, b) => {
        const nameA = a.strMeal?.toLowerCase() || ''
        const nameB = b.strMeal?.toLowerCase() || ''
        return sort === 'desc'
          ? nameB.localeCompare(nameA)
          : nameA.localeCompare(nameB)
      })

      const total = meals.length
      const totalPages = Math.ceil(total / limit)
      const results = paginate(meals, page, limit)

      return { results, page, total, totalPages }
    }

    // ✅ Default category-based loading
    const categories = [
      'Chicken',
      'Seafood',
      'Dessert',
      'Pasta',
      'Vegetarian',
      'Breakfast',
      'Lamb',
      'Miscellaneous',
      'Side',
    ]

    const allResults = await Promise.allSettled(
      categories.map((cat) =>
        $fetch<{ meals: any[] | null }>(
          `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(cat)}`
        )
      )
    )

    let merged = allResults
      .filter((r) => r.status === 'fulfilled' && r.value.meals)
      .flatMap((r: any) => r.value.meals)

    // 🔹 If category is selected, only load from that category
    if (category) {
      const catRes = await $fetch<{ meals: any[] | null }>(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(category)}`
      )
      merged = catRes.meals || []
    }

    // 🔹 Add Ice Cream recipes
    const iceCreamRes = await $fetch<{ meals: any[] | null }>(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=ice%20cream'
    )
    merged.push(...(iceCreamRes.meals || []))

    // 🔹 Sort alphabetically
    merged.sort((a, b) => {
      const nameA = a.strMeal?.toLowerCase() || ''
      const nameB = b.strMeal?.toLowerCase() || ''
      return sort === 'desc'
        ? nameB.localeCompare(nameA)
        : nameA.localeCompare(nameB)
    })

    // 🔹 Paginate
    const total = merged.length
    const totalPages = Math.ceil(total / limit)
    const results = paginate(merged, page, limit)

    console.log(
      `🍽 Page ${page}/${totalPages} | Total: ${total} | Sort: ${sort} | Category: ${category || 'All'}`
    )

    return { results, page, total, totalPages }
  } catch (error: any) {
    console.error('❌ TheMealDB API Error:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch recipes: ${error.message}`,
    })
  }
})
