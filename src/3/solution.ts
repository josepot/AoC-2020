import add from "utils/add"
import { linesMapper } from "utils/linesMapper"
import { multiply } from "utils/multiply"

const lineMapper = (line: string) => line.split("").map((x) => x === "#")

const solution1 = linesMapper(lineMapper, (grid) => {
  return grid.slice(1).filter((current, idx) => current[((idx + 1) * 3) % 31])
    .length
})

const solution2 = linesMapper(lineMapper, (grid) => {
  const deltas = [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ]

  return deltas
    .map(
      ([xDelta, yDelta]) =>
        grid.slice(yDelta).filter((current, idx) => {
          if (idx % yDelta === 1) return false
          const i = idx / yDelta
          return current[((i + 1) * xDelta) % 31]
        }).length,
    )
    .reduce(multiply)
})
export default [solution1, solution2]
// export default [solution1]
