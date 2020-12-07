import add from "utils/add"
import { linesMapper } from "utils/linesMapper"

const getRelations = (line: string): [string, [number, string][]] => {
  const [main, otherRaw] = line.slice(0, -1).split(" bags contain ")
  if (otherRaw.startsWith("no other bags")) return [main, []]
  const inner = otherRaw.split(", ").map((text) => {
    const bagRaw = text.split(" ")
    const n = Number(bagRaw[0])
    const col = bagRaw.slice(1).slice(0, -1).join(" ")
    return [n, col] as [number, string]
  })
  return [main, inner] as [string, [number, string][]]
}

const solution1 = linesMapper(getRelations, (bagRelations) => {
  const map = new Map<string, Set<string>>()

  bagRelations.forEach(([main, inners]) => {
    inners.forEach(([, inner]) => {
      if (!map.has(inner)) map.set(inner, new Set<string>())
      map.get(inner)!.add(main)
    })
  })

  const getParentColors = (current: string): Set<string> =>
    [...(map.get(current) ?? [])]
      .map((col) => getParentColors(col).add(col))
      .reduce(
        (acc, current) => new Set([...acc, ...current]),
        new Set<string>(),
      )

  return getParentColors("shiny gold").size
})

const solution2 = linesMapper(getRelations, (bagRelations) => {
  const map = new Map<string, [number, string][]>(bagRelations)
  const getInnerBags = (color: string): number =>
    map
      .get(color)!
      .map(([innerN, innerCol]) => (getInnerBags(innerCol) + 1) * innerN)
      .reduce(add, 0)

  return getInnerBags("shiny gold")
})

export default [solution1, solution2]
