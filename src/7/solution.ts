import add from "utils/add"
import { linesMapper } from "utils/linesMapper"

const getRelations = (line: string) => {
  const [main, otherRaw] = line.slice(0, -1).split(" bags contain ")
  if (otherRaw.startsWith("no other bags"))
    return [main, [] as [number, string][]] as const
  const inner = otherRaw.split(", ").map((text) => {
    const bagRaw = text.split(" ")
    const n = Number(bagRaw[0])
    const col = bagRaw.slice(1).slice(0, -1).join(" ")
    return [n, col] as const
  })
  return [main, inner] as const
}

const solution1 = linesMapper(getRelations, (bagRelations) => {
  const map = new Map<string, Set<string>>()

  bagRelations.forEach(([main, inners]) => {
    inners.forEach(([, inner]) => {
      if (!map.has(inner)) map.set(inner, new Set<string>())
      map.get(inner)!.add(main)
    })
  })

  const results = new Set<string>()
  const toProcess: string[] = ["shiny gold"]

  while (toProcess.length > 0) {
    const next = toProcess.pop()!
    if (map.has(next)) {
      map.get(next)!.forEach((x) => {
        results.add(x)
      })
      toProcess.push(...[...map.get(next)!])
    }
  }
  return results.size
})

const solution2 = linesMapper(getRelations, (bagRelations) => {
  const map = new Map<string, Map<string, number>>()

  bagRelations.forEach(([main, inners]) => {
    inners.forEach(([size, inner]) => {
      if (!map.has(main)) map.set(main, new Map<string, number>())
      map.get(main)!.set(inner, size)
    })
  })

  const getInnerBags = (color: string): number => {
    if (!map.has(color)) return 0
    return [...map.get(color)!]
      .map(([innerCol, innerN]) => (getInnerBags(innerCol) + 1) * innerN)
      .reduce(add)
  }

  return getInnerBags("shiny gold")
})

export default [solution1, solution2]
