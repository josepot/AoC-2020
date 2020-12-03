import { linesMapper } from "utils/linesMapper"
import { multiply } from "utils/multiply"

const lineMapper = (line: string) => line.split("").map((x) => x === "#")

const countTrees = (grid: boolean[][], xDelta: number, yDelta: number) => {
  let counter = 0
  const nRows = grid.length
  const nCols = grid[0].length
  for (let y = yDelta, x = xDelta; y < nRows; y += yDelta, x += xDelta) {
    if (grid[y][x % nCols]) counter++
  }
  return counter
}

const solution1 = linesMapper(lineMapper, (grid) => countTrees(grid, 3, 1))

const solution2 = linesMapper(lineMapper, (grid) =>
  [
    [1, 1],
    [3, 1],
    [5, 1],
    [7, 1],
    [1, 2],
  ]
    .map(([xDelta, yDelta]) => countTrees(grid, xDelta, yDelta))
    .reduce(multiply),
)
export default [solution1, solution2]
