import add from "utils/add"

const parseLine = (input: string): [string[], string[]] => {
  const splitStr = " (contains "
  const splitIdx = input.indexOf(splitStr)

  const part1 = input.slice(0, splitIdx).split(" ")

  const part2 =
    splitIdx > -1
      ? input
          .slice(0, -1)
          .slice(splitIdx + splitStr.length)
          .split(", ")
      : []
  return [part1, part2]
}

const solution1 = (lines: string[]) => {
  const input = lines.map(parseLine)
  const allIngredients = new Set<string>()
  const countByIngredient = new Map<string, number>()
  const ingredientsByAllergen = new Map<string, Set<string>>()

  input.forEach(([ingredients, alergens]) => {
    ingredients.forEach((ingredient) => {
      allIngredients.add(ingredient)
      countByIngredient.set(
        ingredient,
        (countByIngredient.get(ingredient) ?? 0) + 1,
      )
    })

    alergens.forEach((alergen) => {
      ingredientsByAllergen.set(
        alergen,
        new Set(
          ingredients.filter(
            (ingredient) =>
              ingredientsByAllergen.get(alergen)?.has(ingredient) ?? true,
          ),
        ),
      )
    })
  })

  const poisonedIngredients = new Set(
    [...ingredientsByAllergen.values()]
      .map((ingredients) => [...ingredients])
      .flat(),
  )
  const safeIngredients = new Set(allIngredients)
  poisonedIngredients.forEach((poisonedIngredient) =>
    safeIngredients.delete(poisonedIngredient),
  )

  return [...safeIngredients]
    .map((ingredient) => countByIngredient.get(ingredient)!)
    .reduce(add)
}

const solution2 = (lines: string[]) => {
  const input = lines.map(parseLine)
  const ingredientsByAllergen = new Map<string, Set<string>>()

  input.forEach(([ingredients, alergens]) => {
    alergens.forEach((alergen) => {
      ingredientsByAllergen.set(
        alergen,
        new Set(
          ingredients.filter(
            (ingredient) =>
              ingredientsByAllergen.get(alergen)?.has(ingredient) ?? true,
          ),
        ),
      )
    })
  })

  const ingredientByAllergen = new Map<string, string>()
  do {
    const [allergent, ingredientSet] = [
      ...ingredientsByAllergen.entries(),
    ].find(([, ingredients]) => ingredients.size === 1)!

    const [ingredient] = [...ingredientSet]
    ingredientByAllergen.set(allergent, ingredient)

    ingredientsByAllergen.delete(allergent)
    ingredientsByAllergen.forEach((ingredients) =>
      ingredients.delete(ingredient),
    )
  } while (ingredientsByAllergen.size > 0)

  return [...ingredientByAllergen.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, ingredient]) => ingredient)
    .join()
}

export default [solution1, solution2]
