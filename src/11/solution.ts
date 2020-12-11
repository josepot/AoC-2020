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

  let nextData = grid.map((x) => x).data

  let changed = false

  do {
    nextData = grid.map((x) => x).data
    changed = false
    for (let x = 0; x < grid.N_COLS; x++) {
      for (let y = 0; y < grid.N_ROWS; y++) {
        const cell = grid.getCell(x, y)
        if (cell === Position.Floor) continue
        if (cell === Position.Empty) {
          if (
            grid.getAllNeighbours(x, y).filter((x) => x === Position.Occupied)
              .length === 0
          ) {
            changed = true
            nextData[y][x] = Position.Occupied
          }
        } else {
          if (
            grid.getAllNeighbours(x, y).filter((x) => x === Position.Occupied)
              .length > 3
          ) {
            changed = true
            nextData[y][x] = Position.Empty
          }
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

  let nextData = grid.map((x) => x).data

  let changed = false

  do {
    nextData = grid.map((x) => x).data
    changed = false

    const getOccupiedSit = (
      x: number,
      y: number,
      xDelta: number,
      yDelta: number,
    ): [number, number] | undefined => {
      for (let i = 1; true; i++) {
        const currentX = x + xDelta * i
        const currentY = y + yDelta * i
        const cell = grid.getCell(currentX, currentY)
        if (cell === undefined || cell === Position.Empty) return undefined
        if (cell === Position.Occupied) return [currentX, currentY]
      }
    }

    const getOccupiedSits = (fromX: number, fromY: number) => {
      return deltas
        .map(([xDelta, yDelta]) => getOccupiedSit(fromX, fromY, xDelta, yDelta))
        .filter(Boolean).length
    }

    for (let x = 0; x < grid.N_COLS; x++) {
      for (let y = 0; y < grid.N_ROWS; y++) {
        const cell = grid.getCell(x, y)
        if (cell === Position.Floor) continue
        if (cell === Position.Empty) {
          if (getOccupiedSits(x, y) === 0) {
            changed = true
            nextData[y][x] = Position.Occupied
          }
        } else {
          if (getOccupiedSits(x, y) > 4) {
            changed = true
            nextData[y][x] = Position.Empty
          }
        }
      }
    }
    grid = getGrid(nextData)
  } while (changed)

  return grid.data.flat().filter((x) => x === Position.Occupied).length
}

/*
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

  const { N_COLS, N_ROWS } = grid

  const getEmptySit = (
    x: number,
    y: number,
    xDelta: number,
    yDelta: number,
  ): [number, number] | undefined => {
    for (let i = 1; true; i++) {
      const currentX = x + xDelta * i
      const currentY = y + yDelta * i
      const cell = grid.getCell(currentX, currentY)
      if (cell === undefined || cell === Position.Occupied) return undefined
      if (cell === Position.Empty) return [currentX, currentY]
    }
  }

  for (let x = 0; x < grid.N_COLS; x++) {
    for (let y = 0; y < grid.N_ROWS; y++) {
      if (grid.getCell(x, y) === Position.Occupied) {
        deltas
          .map(([xDelta, yDelta]) => getEmptySit(x, y, xDelta, yDelta))
          .forEach(emptyPosition => {
            if (!emptyPosition) return

          })
      }
    }
  }

  let nextData = grid.map((x) => x).data

  let changed = false

  do {
    nextData = grid.map((x) => x).data
    changed = false
    for (let x = 0; x < grid.N_COLS; x++) {
      for (let y = 0; y < grid.N_ROWS; y++) {
        const cell = grid.getCell(x, y)
        if (cell === Position.Floor) continue
        if (cell === Position.Empty) {
          if (
            grid.getAllNeighbours(x, y).filter((x) => x === Position.Occupied)
              .length === 0
          ) {
            changed = true
            nextData[y][x] = Position.Occupied
          }
        } else {
          if (
            grid.getAllNeighbours(x, y).filter((x) => x === Position.Occupied)
              .length > 3
          ) {
            changed = true
            nextData[y][x] = Position.Empty
          }
        }
      }
    }
    grid = getGrid(nextData)
  } while (changed)

  return grid.data.flat().filter((x) => x === Position.Occupied).length
}
*/

export default [solution1, solution2]
