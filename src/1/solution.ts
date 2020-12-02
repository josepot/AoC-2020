import { linesMapper } from "utils/linesMapper"
import { tupleCombinations } from "utils/tupleCombinations"
import { multiply } from "utils/multiply"

const solution1 = linesMapper(Number, (lines) =>
  tupleCombinations(lines, (a, b) => a + b === 2020)!.reduce(multiply),
)

const solution2 = linesMapper(Number, (lines) =>
  tupleCombinations(lines, (a, b, c) => a + b + c === 2020)!.reduce(multiply),
)

export default [solution1, solution2]
