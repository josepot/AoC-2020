const maskNumber = (x: number, mask: string) => {
  const xStrReversed = x.toString(2).split("").reverse()
  let res: string[] = new Array(mask.length)
  mask
    .split("")
    .reverse()
    .forEach((c, idx) => {
      if (c === "X") {
        res[idx] = xStrReversed[idx] ?? "0"
      } else {
        res[idx] = c
      }
    })
  return parseInt(res.reverse().join(""), 2)
  // return BigInt("0b" + res.reverse().join(""))
}

const solution1 = (lines: string[]) => {
  // return maskNumber(11, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X")
  const mem = new Map<number, number>()
  let mask: string
  lines.forEach((line) => {
    const [part1, part2] = line.split(" = ")
    if (part1 === "mask") {
      mask = part2
    } else {
      const idx = Number(part1.slice(4).slice(0, -1))
      const orig = Number(part2)
      mem.set(idx, maskNumber(orig, mask))
    }
  })
  return Number([...mem.values()].reduce((a, b) => a + b))
}

const getAddresses = (original: number, mask: string) => {
  const xStrReversed = original.toString(2).split("").reverse()
  let masked: string[] = new Array(mask.length)
  const idxs: number[] = []
  mask
    .split("")
    .reverse()
    .forEach((c, idx) => {
      if (c === "0") {
        masked[idx] = xStrReversed[idx] ?? "0"
      } else if (c === "1") {
        masked[idx] = "1"
      } else {
        idxs.push(idx)
        masked[idx] = "X"
      }
    })

  const nCombinations = Math.pow(2, idxs.length)
  // const permutations: number[] = []
  const permutations: bigint[] = []
  for (let i = 0; i < nCombinations; i++) {
    const bin = i.toString(2).split("").reverse()
    const permutation = masked.slice(0)
    // console.log("b:", permutation.slice(0).reverse().join(""))
    for (let z = 0; z < idxs.length; z++) {
      permutation[idxs[z]] = bin[z] ?? "0"
    }
    // console.log(idxs, bin)
    // console.log("a:", permutation.slice(0).reverse().join(""))
    // permutations.push(parseInt(permutation.reverse().join(""), 2))
    permutations.push(BigInt("0b" + permutation.reverse().join("")))
  }
  // console.log(permutations)
  return permutations
}

const solution2 = (lines: string[]) => {
  const mem = new Map<bigint, number>()
  let mask: string
  lines.forEach((line) => {
    const [part1, part2] = line.split(" = ")
    if (part1 === "mask") {
      mask = part2
    } else {
      const idx = Number(part1.slice(4).slice(0, -1))
      const orig = Number(part2)
      getAddresses(idx, mask).forEach((address) => {
        mem.set(address, orig)
      })
    }
  })
  return Number([...mem.values()].reduce((a, b) => a + b))
}

export default [solution1, solution2]
