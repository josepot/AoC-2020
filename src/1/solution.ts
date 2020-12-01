import { tupleCombinations } from "utils/tupleCombinations"

const solution1 = (lines: string[]) =>
  tupleCombinations(lines.map(Number), (a, b) => a + b === 2020)!.reduce(
    (a, b) => a * b,
  )

const solution2 = (lines: string[]) =>
  tupleCombinations(lines.map(Number), (a, b, c) => a + b + c === 2020)!.reduce(
    (a, b) => a * b,
  )

export default [solution1, solution2]
