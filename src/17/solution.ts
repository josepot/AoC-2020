const deltas: [number, number, number, number][] = []

for (let w = -1; w < 2; w++) {
  for (let z = -1; z < 2; z++) {
    for (let x = -1; x < 2; x++) {
      for (let y = -1; y < 2; y++) {
        if (x !== 0 || y !== 0 || z !== 0 || w !== 0) deltas.push([x, y, z, w])
      }
    }
  }
}

const fromIdToPos = (id: string) => {
  return id.split(",").map(Number) as [number, number, number, number]
}

const fromPosToId = (x: number, y: number, z: number, w: number) => {
  return [x, y, z, w].join(",")
}

interface Grid {
  positions: Map<string, boolean>
  dimensions: [
    [number, number],
    [number, number],
    [number, number],
    [number, number],
  ]
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
            delta[3] + position[3],
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
      [number, number],
    ],
    positions: new Map<string, boolean>(),
  }
  const { dimensions } = result

  for (let x = dimensions[0][0]; x < dimensions[0][1]; x++) {
    for (let y = dimensions[1][0]; y < dimensions[1][1]; y++) {
      for (let z = dimensions[2][0]; z < dimensions[2][1]; z++) {
        for (let w = dimensions[3][0]; w < dimensions[3][1]; w++) {
          const id = fromPosToId(x, y, z, w)
          const nNeighActive = getNeighbours(id, grid)
          if (grid.positions.get(id)) {
            result.positions.set(id, nNeighActive === 2 || nNeighActive === 3)
          } else {
            result.positions.set(id, nNeighActive === 3)
          }
        }
      }
    }
  }
  return result
}

const solution1 = (lines: string[]) => {
  let grid: Grid = {
    dimensions: [
      [0, 8],
      [0, 8],
      [0, 1],
      [0, 1],
    ],
    positions: new Map<string, boolean>(),
  }

  lines.forEach((line, y) => {
    line
      .split("")
      .map((d) => d === "#")
      .forEach((isActive, x) => {
        grid.positions.set([x, y, 0, 0].join(","), isActive)
      })
  })

  for (let i = 0; i < 6; i++) {
    /*
    for (let z = grid.dimensions[2][0]; z < grid.dimensions[2][1]; z++) {
      console.log("")
      console.log("z", z)
      for (let y = grid.dimensions[1][0]; y < grid.dimensions[1][1]; y++) {
        let line = ""
        for (let x = grid.dimensions[0][0]; x < grid.dimensions[0][1]; x++) {
          line += grid.positions.get([x, y, z].join(",")) ? "#" : "."
        }
        console.log(line)
      }
    }
    */
    grid = nextGrid(grid)
  }

  return [...grid.positions.values()].filter(Boolean).length
}

const solution2 = null

export default [solution1, solution2].filter(Boolean)
