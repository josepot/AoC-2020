import { linesMapper } from "utils/linesMapper"

const isValid = (candidates: number[], input: number): boolean => {
  for (let first = 0; first < candidates.length; first++) {
    for (let second = first + 1; second < candidates.length; second++) {
      if (candidates[first] + candidates[second] === input) return true
    }
  }
  return false
}

const solution1 = linesMapper(Number, (input: number[]) => {
  const N_BUFFER = 25
  const lastNumbers: number[] = []

  for (let i = 0; i < N_BUFFER; i++) lastNumbers.push(input[i])

  for (let i = N_BUFFER; i < input.length; i++) {
    const current = input[i]
    if (!isValid(lastNumbers, current)) return input[i]
    lastNumbers.splice(0, 1)
    lastNumbers.push(current)
  }
})

const solution2 = (lines: string[]) => {
  const invalid = solution1(lines)
  const input = lines.map(Number)

  let acc: number
  for (let firstIdx = 0; firstIdx < input.length; firstIdx++) {
    acc = input[firstIdx]
    for (let lastIdx = firstIdx + 1; acc < invalid; lastIdx++) {
      acc += input[lastIdx]
      if (acc === invalid) {
        const winners = input.slice(firstIdx, lastIdx)
        return Math.min(...winners) + Math.max(...winners)
      }
    }
  }
}

export default [solution1, solution2]
