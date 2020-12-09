import { linesMapper } from "utils/linesMapper"

const isValid = (candidates: number[], input: number): boolean => {
  for (let i = 0; i < 25; i++) {
    for (let ii = i + 1; ii < 25; ii++) {
      if (candidates[i] + candidates[ii] === input) return true
    }
  }
  return false
}

const solution1 = linesMapper(Number, (lines: number[]) => {
  const lastNumbers: number[] = []
  for (let i = 0; i < 25; i++) lastNumbers.push(lines[i])

  for (let i = 25; i < lines.length; i++) {
    if (!isValid(lastNumbers, lines[i])) {
      return lines[i]
    }
    lastNumbers.splice(0, 1)
    lastNumbers.push(lines[i])
  }
})

const solution2 = linesMapper(Number, (input: number[]) => {
  const invalid = 50047984

  let acc = 0
  for (let i = 0; i < input.length; i++) {
    acc = input[i]
    for (let z = i + 1; acc < invalid; z++) {
      acc += input[z]
      if (acc === invalid) {
        let winners: number[] = []
        for (let zz = i; zz < z + 1; zz++) winners.push(input[zz])
        const min = Math.min(...winners)
        const max = Math.max(...winners)
        return min + max
      }
    }
  }
})

export default [solution1, solution2]
