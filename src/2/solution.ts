import { linesMapper } from "utils/linesMapper"

const lineMapper = (line: string) => {
  const [rules, pass] = line.split(": ")
  const [rawNums, char] = rules.split(" ")
  const [min, max] = rawNums.split("-").map(Number)
  return { pass, char, min, max }
}

const solution1 = linesMapper(
  lineMapper,
  (lines) =>
    lines.filter((line) => {
      const nChars = line.pass.split("").filter((c) => c === line.char).length
      return nChars >= line.min && nChars <= line.max
    }).length,
)

const solution2 = linesMapper(
  lineMapper,
  (lines) =>
    lines.filter(
      (line) =>
        [line.min, line.max].filter((pos) => line.pass[pos - 1] === line.char)
          .length === 1,
    ).length,
)

export default [solution1, solution2]
