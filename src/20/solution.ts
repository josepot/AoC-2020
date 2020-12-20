import graphDistinctSearch from "utils/graphDistinctSearch"
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

  const topIds = new Map<number, Map<number, number[]>>()
  const bottomIds = new Map<number, Map<number, number[]>>()
  const rightIds = new Map<number, Map<number, number[]>>()
  const leftIds = new Map<number, Map<number, number[]>>()

  const rowToId = (row: boolean[]) =>
    parseInt(row.map((x) => (x ? "1" : "0")).join(""), 2)

  const registerId = (
    collection: Map<number, Map<number, number[]>>,
    sideId: number,
    tileId: number,
    permutationIdx: number,
  ): void => {
    if (!collection.has(sideId)) {
      collection.set(sideId, new Map([[tileId, [permutationIdx]]]))
      return
    }
    const innerMap = collection.get(sideId)!
    if (!innerMap.has(tileId)) {
      innerMap.set(tileId, [permutationIdx])
    } else {
      innerMap.get(tileId)!.push(permutationIdx)
    }
  }

  tiles.forEach((permutations, key) => {
    permutations.forEach((permutation, idx) => {
      const { data } = permutation
      const topId = rowToId(data[0])
      registerId(topIds, topId, key, idx)

      const bottomId = rowToId(data[9])
      registerId(bottomIds, bottomId, key, idx)

      const leftId = rowToId(data.map((x) => x[0]))
      registerId(leftIds, leftId, key, idx)

      const rightId = rowToId(data.map((x) => x[9]))
      registerId(rightIds, rightId, key, idx)
    })
  })

  const corners = [...tiles.entries()]
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

  interface Node {
    len: number
    prev: Node | null
    id: number
    idx: number
  }

  let topToBottom = graphDistinctSearch(
    {
      len: 0,
      prev: null,
      id: -1,
      idx: -1,
    } as Node,
    (current) => {
      if (current.id !== corners[0] && corners.includes(current.id)) return true
      if (current.id === -1) {
        return tiles.get(corners[0])!.map((tile, idx) => ({
          id: tile.id,
          prev: null,
          len: 1,
          idx,
        }))
      }
      const result: Node[] = []
      const { data } = tiles.get(current.id)![current.idx]
      const bottomId = rowToId(data[9])
      const candidates = topIds.get(bottomId)
      if (candidates === undefined) return []
      candidates.forEach((idxs, tileId) => {
        if (tileId === current.id) return
        result.push(
          ...idxs.map((idx) => ({
            len: current.len + 1,
            prev: current,
            id: tileId,
            idx,
          })),
        )
      })

      return result
    },
    (a, b) => a.len - b.len,
  )

  const puzzle: Tile[][] = []

  for (let i = 0; i < 12; i++) {
    const root: Node = {
      len: 1,
      id: topToBottom.id,
      idx: topToBottom.idx,
      prev: null,
    }
    let row: Node | null = graphDistinctSearch(
      root,
      (current) => {
        if (current.len === 12) return true
        const result: Node[] = []
        const { data } = tiles.get(current.id)![current.idx]
        const rightId = rowToId(data.map((x) => x[9]))
        const candidates = leftIds.get(rightId)
        if (candidates === undefined) return []
        candidates.forEach((idxs, tileId) => {
          if (tileId === current.id) return
          result.push(
            ...idxs.map((idx) => ({
              len: current.len + 1,
              prev: current,
              id: tileId,
              idx,
            })),
          )
        })

        return result
      },
      (a, b) => a.len - b.len,
    )
    const puzzleRow: Tile[] = []
    do {
      puzzleRow.push(tiles.get(row.id)![row.idx])
      row = row.prev
    } while (row)
    puzzleRow.reverse()
    puzzle.push(puzzleRow)
    topToBottom = topToBottom.prev!
  }
  puzzle.reverse()

  const tempPuzzle = puzzle.map((tilesRow) =>
    tilesRow.map((tile) =>
      tile.data
        .slice(1)
        .slice(0, -1)
        .map((x) => x.slice(1).slice(0, -1)),
    ),
  )

  const finalPuzzle: boolean[][] = Array(96)
    .fill(null)
    .map(() => Array(96).fill(false))

  for (let y = 0; y < 96; y++) {
    for (let x = 0; x < 96; x++) {
      const tileY = Math.floor(y / 8)
      const yy = y % 8
      const tileX = Math.floor(x / 8)
      const xx = x % 8
      finalPuzzle[y][x] = tempPuzzle[tileY][tileX][yy][xx]
    }
  }

  return finalPuzzle

  // return corners.reduce(multiply)
}

const solution2 = null

export default [solution1, solution2].filter(Boolean)
