import { linesMapper } from "utils/linesMapper"
import { multiply } from "utils/multiply"

const getPosition = (range: number, sequence: boolean[]): number => {
  let bottom = 0
  let top = range

  for (let i = 0; i < sequence.length; i++) {
    const isTop = sequence[i]
    const delta = (top - bottom) / 2
    if (isTop) {
      bottom += delta
    } else {
      top -= delta
    }
    if (top - bottom === 1) {
      return bottom
    }
  }
  return Infinity
}

const solution1 = (lines: string[]) => {
  return lines
    .map((line) => {
      const row = getPosition(
        128,
        line
          .slice(0, 7)
          .split("")
          .map((x) => x === "B"),
      )
      const col = getPosition(
        8,
        line
          .slice(7)
          .split("")
          .map((x) => x === "R"),
      )
      return row * 8 + col
    })
    .reduce((a, b) => Math.max(a, b))
}

const solution2 = (lines: string[]) => {
  const allSits = lines.map((line) => {
    const row = getPosition(
      128,
      line
        .slice(0, 7)
        .split("")
        .map((x) => x === "B"),
    )
    const col = getPosition(
      8,
      line
        .slice(7)
        .split("")
        .map((x) => x === "R"),
    )
    return row * 8 + col
  })

  const min = Math.min(...allSits)
  const max = Math.max(...allSits)
  const sitsSet = new Set(allSits)
  for (let i = min; i < max; i++) {
    if (sitsSet.has(i - 1) && sitsSet.has(i + 1) && !sitsSet.has(i)) {
      return i
    }
  }
}

export default [solution1, solution2]
