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

  const tiles: Tile[] = rawTiles.map((raw) => {
    const [idLine, ...other] = raw
    const data = readGrid(other, (x) => x === "#").data
    const id = Number(idLine.split(" ")[1].slice(0, -1))
    return { data, id, rotatedData: data.map((line) => line.map((x) => x)) }
  })

  const cache = new Map<number, Tile[]>()

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
    if (cache.has(original.id)) return cache.get(original.id)!

    const result: Tile[] = []
    let latest = original
    for (let i = 0; i < 4; i++) {
      result.push((latest = rotate(latest)))
    }
    latest = flipV(original)
    for (let i = 0; i < 4; i++) {
      result.push((latest = rotate(latest)))
    }

    cache.set(original.id, result)

    return result
  }

  const findGrid = (
    availableTiles: Tile[],
    found: Record<string, Tile>,
    toExpand: [number, number],
    expandRight: boolean,
  ): Record<string, Tile> | undefined => {
    console.log(toExpand, availableTiles.length)
    if (availableTiles.length === 0) {
      return found
      /*
      const maxIdxs = Object.keys(found)
        .map((key) => key.split(",").map(Number) as [number, number])
        .reduce(
          (acc, current) => {
            if (current[0] > acc[0]) {
              acc[0] = current[0]
            }
            if (current[1] > acc[1]) {
              acc[1] = current[1]
            }
            return acc
          },
          [0, 0] as [number, number],
        )
      console.log(maxIdxs)
      console.log(
        found["0,0"].id *
          found[[0, maxIdxs[1]].join(",")].id *
          found[[maxIdxs[0], 0].join(",")].id *
          availableTiles[0].id,
      )
      */
    }

    if (toExpand[0] === -1) {
      return availableTiles
        .map((current) => {
          const nextAvailable = availableTiles.filter(
            (x) => x.id !== current.id,
          )
          const permutations = getTilePermutations(current)
          return permutations.map((permutation) => ({
            permutation,
            nextAvailable,
          }))
        })
        .flat()
        .map(({ permutation, nextAvailable }) =>
          findGrid(nextAvailable, { "0,0": permutation }, [0, 0], true),
        )
        .find((x) => x)
    }

    const currentTile = found[toExpand.join(",")]

    if (expandRight) {
      const rightId = parseInt(
        currentTile.data
          .map((x) => x[9])
          .map((x) => (x ? "1" : "0"))
          .join(""),
        2,
      )
      let nextRight: Tile | undefined = undefined
      availableTiles.find((candidate) => {
        const candidates = getTilePermutations(candidate)
        const foundIdx = candidates
          .map(
            (x) =>
              parseInt(
                x.data
                  .map((x) => x[0])
                  .map((x) => (x ? "1" : "0"))
                  .join(""),
              ),
            2,
          )
          .indexOf(rightId)
        if (foundIdx !== -1) {
          nextRight = candidates[foundIdx]
          return true
        }
      })

      const nextAvailableTiles = nextRight
        ? availableTiles.filter((x) => x.id !== nextRight!.id)
        : availableTiles
      const nextFound = nextRight
        ? { ...found, [[toExpand[0], toExpand[1] + 1].join(",")]: nextRight }
        : found

      if (nextFound !== found) return undefined
      return findGrid(nextAvailableTiles, nextFound, [toExpand[0], 0], false)
    } else {
      const bottomId = parseInt(
        currentTile.data[9].map((x) => (x ? "1" : "0")).join(""),
        2,
      )
      let nextBottom: Tile | undefined = undefined
      availableTiles.find((candidate) => {
        const candidates = getTilePermutations(candidate)
        const foundIdx = candidates
          .map(
            (x) => parseInt(x.data[0].map((x) => (x ? "1" : "0")).join("")),
            2,
          )
          .indexOf(bottomId)
        if (foundIdx !== -1) {
          nextBottom = candidates[foundIdx]
          return true
        }
      })

      let nextAvailableTiles = nextBottom
        ? availableTiles.filter((x) => x.id !== nextBottom?.id)
        : availableTiles
      let nextFound = nextBottom
        ? { ...found, [[toExpand[0] + 1, toExpand[1]].join(",")]: nextBottom }
        : found

      if (!nextBottom) return undefined
      return findGrid(nextAvailableTiles, nextFound, toExpand, true)
    }
  }

  // return findGrid(tiles, {}, [-1, -1], false)
  getTilePermutations(tiles[0]).forEach((permutatiion) => {
    console.log(
      permutatiion.data
        .map((line) => line.map((x) => (x ? "#" : ".")).join(""))
        .join("\n"),
    )
    console.log()
  })
}

const solution2 = null

export default [solution1, solution2].filter(Boolean)
