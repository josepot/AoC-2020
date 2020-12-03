import { linesMapper } from "utils/linesMapper"
import { multiply } from "utils/multiply"

const lineMapper = (line: string) => line.split("").map((x) => x === "#")

const solution1 = linesMapper(
  lineMapper,
  (grid) =>
    grid.slice(1).filter((row, idx) => row[((idx + 1) * 3) % row.length])
      .length,
)

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
        grid.slice(yDelta).filter((row, idx) => {
          if (idx % yDelta === 1) return false
          return row[((idx / yDelta + 1) * xDelta) % row.length]
        }).length,
    )
    .reduce(multiply)
})
export default [solution1, solution2]
