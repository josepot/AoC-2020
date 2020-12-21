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
  const allAllergents = new Set<string>()
  const allIngredients = new Set<string>()
  const ingredientCounts = new Map<string, number>()

  input.forEach(([ingredients, allergies]) => {
    ingredients.forEach((ingredient) => {
      allIngredients.add(ingredient)
      if (ingredientCounts.has(ingredient))
        ingredientCounts.set(ingredient, ingredientCounts.get(ingredient)! + 1)
      else ingredientCounts.set(ingredient, 1)
    })
    allergies.forEach((a) => allAllergents.add(a))
  })

  const possible = new Map<string, Set<string>>()
  allAllergents.forEach((a) => possible.set(a, new Set([...allIngredients])))

  input.forEach(([ingredients_, allergies_]) => {
    allergies_.forEach((allergy) => {
      ;[...allIngredients].forEach((ingredient) => {
        if (!ingredients_.includes(ingredient))
          possible.get(allergy)!.delete(ingredient)
      })
    })
  })

  return [...allIngredients]
    .map((ingr) =>
      [...possible.values()].some((poss) => poss.has(ingr))
        ? 0
        : ingredientCounts.get(ingr)!,
    )
    .reduce(add)
}

const solution2 = null

export default [solution1, solution2].filter(Boolean)
