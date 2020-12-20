import { multiply } from "utils/multiply"
import { readGrid } from "utils/readGrid"

interface Tile {
  id: number
  data: boolean[][]
}

const solution1 = (lines: string[]) => {
  const rawTiles: string[][] = []
  let current: string[] = []
  lines.forEach((line) => {
    if (line.length === 0) {
      rawTiles.push(current)
      current = []
    } else {
      current.push(line)
    }
  })

  const rotate = (input: Tile): Tile => {
    const data: boolean[][] = []
    let nextData: boolean[] = []

    for (let x = 0; x < 10; x++) {
      for (let y = 9; y >= 0; y--) {
        nextData.push(input.data[y][x])
      }
      data.push(nextData)
      nextData = []
    }
    return { ...input, data }
  }

  const flipV = (input: Tile): Tile => {
    const data: boolean[][] = []
    let nextData: boolean[] = []

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        nextData.push(input.data[y][x])
      }
      data.push(nextData)
      nextData = []
    }
    return { ...input, data: data.reverse() }
  }

  const getTilePermutations = (original: Tile): Tile[] => {
    const result: Tile[] = []
    let latest = original
    for (let i = 0; i < 4; i++) {
      result.push((latest = rotate(latest)))
    }
    latest = flipV(original)
    for (let i = 0; i < 4; i++) {
      result.push((latest = rotate(latest)))
    }
    return result
  }

  const tiles: Map<number, Tile[]> = new Map(
    rawTiles
      .map((raw) => {
        const [idLine, ...other] = raw
        return {
          data: readGrid(other, (x) => x === "#").data,
          id: Number(idLine.split(" ")[1].slice(0, -1)),
        }
      })
      .map((tile) => [tile.id, getTilePermutations(tile)] as const),
  )

  const topIds = new Map<number, Set<number>>()
  const bottomIds = new Map<number, Set<number>>()
  const rightIds = new Map<number, Set<number>>()
  const leftIds = new Map<number, Set<number>>()

  const rowToId = (row: boolean[]) =>
    parseInt(row.map((x) => (x ? "1" : "0")).join(""), 2)

  tiles.forEach((permutations, key) => {
    permutations.forEach(({ data }) => {
      const topId = rowToId(data[0])
      if (!topIds.has(topId)) topIds.set(topId, new Set([key]))
      else topIds.get(topId)!.add(key)

      const bottomId = rowToId(data[9])
      if (!bottomIds.has(bottomId)) bottomIds.set(bottomId, new Set([key]))
      else bottomIds.get(bottomId)!.add(key)

      const leftId = rowToId(data.map((x) => x[0]))
      if (!leftIds.has(leftId)) leftIds.set(leftId, new Set([key]))
      else leftIds.get(leftId)!.add(key)

      const rightId = rowToId(data.map((x) => x[9]))
      if (!rightIds.has(rightId)) rightIds.set(rightId, new Set([key]))
      else rightIds.get(rightId)!.add(key)
    })
  })

  return [...tiles.entries()]
    .filter(([key, permutations]) => {
      const isCorner = permutations
        .map(({ data }) => {
          const topCandidates = bottomIds.get(rowToId(data[0]))
          const bottomCandidates = topIds.get(rowToId(data[9]))
          const leftCandidates = rightIds.get(rowToId(data.map((x) => x[0])))
          const rightCandidates = leftIds.get(rowToId(data.map((x) => x[9])))

          const nTop = topCandidates
            ? topCandidates.size - (topCandidates.has(key) ? 1 : 0)
            : 0

          const nBottom = bottomCandidates
            ? bottomCandidates.size - (bottomCandidates.has(key) ? 1 : 0)
            : 0

          const nRight = rightCandidates
            ? rightCandidates.size - (rightCandidates.has(key) ? 1 : 0)
            : 0

          const nLeft = leftCandidates
            ? leftCandidates.size - (leftCandidates.has(key) ? 1 : 0)
            : 0

          return nTop + nBottom + nRight + nLeft
        })
        .reduce((acc, current) => acc && current === 2, true)
      return isCorner
    })
    .map(([key]) => key)
    .reduce(multiply)
}

const solution2 = null

export default [solution1, solution2].filter(Boolean)
