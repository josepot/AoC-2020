import { getGrid, readGrid } from "utils/readGrid"

enum Position {
  Floor,
  Empty,
  Occupied,
}

const solution1 = (lines: string[]) => {
  let grid = readGrid(lines, (line: string) =>
    line === "."
      ? Position.Floor
      : line === "L"
      ? Position.Empty
      : Position.Occupied,
  )

  let changed = false
  do {
    const nextData = grid.map((x) => x).data
    changed = false
    for (let x = 0; x < grid.N_COLS; x++) {
      for (let y = 0; y < grid.N_ROWS; y++) {
        const cell = grid.getCell(x, y)
        if (cell === Position.Floor) continue
        const nOccupied = grid
          .getAllNeighbours(x, y)
          .filter((x) => x === Position.Occupied).length
        if (cell === Position.Empty) {
          if (nOccupied === 0) {
            changed = true
            nextData[y][x] = Position.Occupied
          }
        } else if (nOccupied > 3) {
          changed = true
          nextData[y][x] = Position.Empty
        }
      }
    }
    grid = getGrid(nextData)
  } while (changed)

  return grid.data.flat().filter((x) => x === Position.Occupied).length
}

const deltas: [number, number][] = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
]
const solution2 = (lines: string[]) => {
  let grid = readGrid(lines, (line: string) =>
    line === "."
      ? Position.Floor
      : line === "L"
      ? Position.Empty
      : Position.Occupied,
  )

  const isThereAnOccupiedSit = (
    x: number,
    y: number,
    xDelta: number,
    yDelta: number,
  ): boolean => {
    for (let i = 1; true; i++) {
      const cell = grid.getCell(x + xDelta * i, y + yDelta * i)
      if (cell === Position.Floor) continue
      return cell === Position.Occupied
    }
  }

  let changed = false
  do {
    const nextData = grid.map((x) => x).data
    changed = false
    const getOccupiedSits = (fromX: number, fromY: number) => {
      return deltas.filter(([xDelta, yDelta]) =>
        isThereAnOccupiedSit(fromX, fromY, xDelta, yDelta),
      ).length
    }
    for (let x = 0; x < grid.N_COLS; x++) {
      for (let y = 0; y < grid.N_ROWS; y++) {
        const cell = grid.getCell(x, y)
        if (cell === Position.Floor) continue
        const nOccupied = getOccupiedSits(x, y)

        if (cell === Position.Empty) {
          if (nOccupied === 0) {
            changed = true
            nextData[y][x] = Position.Occupied
          }
        } else if (nOccupied > 4) {
          changed = true
          nextData[y][x] = Position.Empty
        }
      }
    }
    grid = getGrid(nextData)
  } while (changed)

  return grid.data.flat().filter((x) => x === Position.Occupied).length
}

export default [solution1, solution2]
