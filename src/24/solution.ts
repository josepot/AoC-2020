interface Direction {
  up: number
  right: number
}

const parseLine = (input: string): Direction[] => {
  const result: Direction[] = []
  let line = input.slice(0)
  while (line.length > 0) {
    if (line.startsWith("e")) {
      result.push({ up: 0, right: 1 })
      line = line.slice(1)
    } else if (line.startsWith("se")) {
      result.push({ up: 1, right: 0 })
      line = line.slice(2)
    } else if (line.startsWith("sw")) {
      result.push({ up: 1, right: -1 })
      line = line.slice(2)
    } else if (line.startsWith("w")) {
      result.push({ up: 0, right: -1 })
      line = line.slice(1)
    } else if (line.startsWith("nw")) {
      result.push({ up: -1, right: 0 })
      line = line.slice(2)
    } else if (line.startsWith("ne")) {
      result.push({ up: -1, right: 1 })
      line = line.slice(2)
    }
  }
  return result
}

const move = (
  start: { x: number; y: number },
  steps: Direction[],
): { x: number; y: number } => {
  const result = { ...start }
  steps.forEach(({ up, right }) => {
    result.y += up
    result.x += right
  })
  return result
}

const solution1 = (lines: string[]) => {
  const blackTiles = new Set<string>()
  let currentPosition = { x: 0, y: 0 }
  lines.map(parseLine).forEach((directions) => {
    currentPosition = move(currentPosition, directions)
    const posId = [currentPosition.x, currentPosition.y].join(",")
    if (blackTiles.has(posId)) {
      blackTiles.delete(posId)
    } else {
      blackTiles.add(posId)
    }
    currentPosition = { x: 0, y: 0 }
  })
  return blackTiles.size
}

const solution2 = (lines: string[]) => {
  let blackTiles = new Set<string>()
  let currentPosition = { x: 0, y: 0 }
  lines.map(parseLine).forEach((directions) => {
    currentPosition = move(currentPosition, directions)
    const posId = [currentPosition.x, currentPosition.y].join(",")
    if (blackTiles.has(posId)) {
      blackTiles.delete(posId)
    } else {
      blackTiles.add(posId)
    }
    currentPosition = { x: 0, y: 0 }
  })

  const diffs: [number, number][] = [
    [0, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, 0],
    [-1, 1],
  ]

  for (let i = 0; i < 100; i++) {
    const neighbours = new Map<string, number>()
    ;[...blackTiles]
      .map((id) => id.split(",").map(Number) as [number, number])
      .forEach((blackOne) => {
        diffs
          .map(([y, x]) => [blackOne[0] + x, blackOne[1] + y].join(","))
          .forEach((neighId) => {
            neighbours.set(neighId, (neighbours.get(neighId) ?? 0) + 1)
          })
      })
    const nextBlackTiles = new Set<string>()
    neighbours.forEach((nBlack, id) => {
      if (nBlack === 2 && !blackTiles.has(id)) {
        nextBlackTiles.add(id)
      }
    })
    blackTiles.forEach((id) => {
      const n = neighbours.get(id) ?? 0
      if (n === 1 || n === 2) nextBlackTiles.add(id)
    })
    blackTiles = nextBlackTiles
  }

  return blackTiles.size
}

export default [solution1, solution2].filter(Boolean)
