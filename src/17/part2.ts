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

const fromIdToPos = (id: string) =>
  id.split(",").map(Number) as [number, number, number, number]

const fromPosToId = (x: number, y: number, z: number, w: number) =>
  [x, y, z, w].join(",")

const getNeighbours = (id: string) => {
  const position = fromIdToPos(id)
  return deltas.map((delta) =>
    fromPosToId(
      delta[0] + position[0],
      delta[1] + position[1],
      delta[2] + position[2],
      delta[3] + position[3],
    ),
  )
}

const nextGrid = (grid: Set<string>) => {
  const result = new Set<string>()
  const candidates = new Map<string, number>()

  ;[...grid].forEach((id) => {
    getNeighbours(id).forEach((neigh) => {
      candidates.set(neigh, (candidates.get(neigh) ?? 0) + 1)
    })
  })
  ;[...candidates.entries()].forEach(([id, nActive]) => {
    if (nActive === 3 || (nActive === 2 && grid.has(id))) result.add(id)
  })
  return result
}

export const solution2 = (lines: string[]) => {
  let grid = new Set<string>()

  lines.forEach((line, y) => {
    line
      .split("")
      .map((d) => d === "#")
      .forEach((isActive, x) => {
        if (isActive) grid.add(fromPosToId(x, y, 0, 0))
      })
  })

  for (let i = 0; i < 6; i++) grid = nextGrid(grid)
  return grid.size
}
