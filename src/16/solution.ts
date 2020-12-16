import add from "utils/add"
import { multiply } from "utils/multiply"

const getInvalidNumbers = (
  conditions: [number, number][],
  possible: number[],
): number[] => {
  return possible.filter((candidate) => {
    return (
      conditions.filter(([min, max]) => candidate < min || candidate > max)
        .length === conditions.length
    )
  })
}

const solution1 = (lines: string[]) => {
  let stage = 0

  const conditions: [number, number][] = []
  const possible: number[] = []
  lines.forEach((line) => {
    if (line.length === 0) {
      return stage++
    }
    if (line.startsWith("your") || line.startsWith("nearby")) return
    if (stage === 0) {
      const [, str] = line.split(": ")
      str.split(" or ").forEach((pair) => {
        conditions.push(pair.split("-").map(Number) as [number, number])
      })
    }
    if (stage === 2) {
      possible.push(...line.split(",").map(Number))
    }
  })
  const invalid = getInvalidNumbers(conditions, possible)
  return invalid.reduce(add)
}

const getValidFields = (
  conditions: [string, [[number, number], [number, number]]][],
  cadidate: number[],
): string[][] => {
  return cadidate.map((candidate) => {
    return conditions
      .filter(
        ([, [[min1, max1], [min2, max2]]]) =>
          (candidate >= min1 && candidate <= max1) ||
          (candidate >= min2 && candidate <= max2),
      )
      .map(([name]) => name)
  })
}

const solution2 = (lines: string[]) => {
  let stage = 0

  const conditions: Map<
    string,
    [[number, number], [number, number]]
  > = new Map()
  let mine: number[] = []
  const others: number[][] = []
  const correctOnes: string[][][] = []

  lines.forEach((line) => {
    if (line.length === 0) {
      return stage++
    }
    if (line.startsWith("your") || line.startsWith("nearby")) return

    if (stage === 0) {
      const [condition, str] = line.split(": ")
      conditions.set(
        condition,
        str
          .split(" or ")
          .map((pair) => pair.split("-").map(Number) as [number, number]) as [
          [number, number],
          [number, number],
        ],
      )
    }

    if (stage === 1) {
      mine = line.split(",").map(Number)
    }

    const conditionsArr = [...conditions.entries()]
    if (stage === 2) {
      const candidate = line.split(",").map(Number)
      const valid = getValidFields(conditionsArr, candidate)
      if (valid.length === valid.filter((x) => x.length > 0).length) {
        correctOnes.push(valid)
      }
    }
  })
  const conditionsArr = [...conditions.entries()]
  const valid = getValidFields(conditionsArr, mine)
  if (valid.length === valid.filter((x) => x.length > 0).length) {
    correctOnes.push(valid)
  }

  const keysWithIdxs: Map<string, Set<number>> = new Map(
    [...conditions.keys()].map((key) => {
      const passIdxs = correctOnes.map((passenger) =>
        passenger
          .map((passOptions, idx) => [idx, passOptions.includes(key)] as const)
          .filter(([, isThere]) => isThere)
          .map(([idx]) => idx),
      )
      return [
        key,
        new Set(
          Array(20)
            .fill(null)
            .map((_, idx) => idx)
            .filter(
              (idx) =>
                passIdxs.filter((idxs) => idxs.includes(idx)).length ===
                passIdxs.length,
            ),
        ),
      ] as const
    }),
  )

  const fixedKeys = new Set<string>()
  const fixKeys = (foundKey: string) => {
    fixedKeys.add(foundKey)
    const idxToRemove = [...keysWithIdxs.get(foundKey)!][0]
    const found: string[] = []
    ;[...keysWithIdxs.entries()].forEach(([key, values]) => {
      if (key === foundKey) return
      values.delete(idxToRemove)
      if (values.size === 1 && !fixedKeys.has(key)) found.push(key)
    })
    found.forEach(fixKeys)
  }

  fixKeys("route")

  return [...keysWithIdxs.entries()]
    .filter(([key]) => key.startsWith("departure"))
    .map(([, idx]) => mine[[...idx][0]])
    .reduce(multiply)
}

export default [solution1, solution2].filter(Boolean)
