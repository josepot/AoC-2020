const deltas: [number, number, number][] = []

for (let z = -1; z < 2; z++) {
  for (let x = -1; x < 2; x++) {
    for (let y = -1; y < 2; y++) {
      if (x !== 0 || y !== 0 || z !== 0) deltas.push([x, y, z])
    }
  }
}

const fromIdToPos = (id: string) => {
  return id.split(",").map(Number) as [number, number, number]
}

const fromPosToId = (x: number, y: number, z: number) => {
  return [x, y, z].join(",")
}

interface Grid {
  positions: Map<string, boolean>
  dimensions: [[number, number], [number, number], [number, number]]
}

const getNeighbours = (id: string, grid: Grid) => {
  const position = fromIdToPos(id)
  return deltas
    .map(
      (delta) =>
        grid.positions.get(
          fromPosToId(
            delta[0] + position[0],
            delta[1] + position[1],
            delta[2] + position[2],
          ),
        ) ?? false,
    )
    .filter(Boolean).length
}

const nextGrid = (grid: Grid) => {
  const result: Grid = {
    dimensions: grid.dimensions.map(([min, max]) => [min - 1, max + 1]) as [
      [number, number],
      [number, number],
      [number, number],
    ],
    positions: new Map<string, boolean>(),
  }
  const { dimensions } = result

  for (let x = dimensions[0][0]; x < dimensions[0][1]; x++) {
    for (let y = dimensions[1][0]; y < dimensions[1][1]; y++) {
      for (let z = dimensions[2][0]; z < dimensions[2][1]; z++) {
        const id = fromPosToId(x, y, z)
        const nNeighActive = getNeighbours(id, grid)
        if (grid.positions.get(id)) {
          result.positions.set(id, nNeighActive === 2 || nNeighActive === 3)
        } else {
          result.positions.set(id, nNeighActive === 3)
        }
      }
    }
  }
  return result
}

export const solution1 = (lines: string[]) => {
  let grid: Grid = {
    dimensions: [
      [0, lines.length],
      [0, lines.length],
      [0, 1],
    ],
    positions: new Map<string, boolean>(),
  }

  lines.forEach((line, y) => {
    line
      .split("")
      .map((d) => d === "#")
      .forEach((isActive, x) => {
        grid.positions.set([x, y, 0].join(","), isActive)
      })
  })

  for (let i = 0; i < 6; i++) grid = nextGrid(grid)
  return [...grid.positions.values()].filter(Boolean).length
}
