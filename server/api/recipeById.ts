export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const id = query.id
    const apiKey = process.env.SPOONACULAR_KEY
  
    const url = `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
    const data = await $fetch(url)
    return data
  })
  