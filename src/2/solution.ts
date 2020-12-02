import { tupleCombinations } from "utils/tupleCombinations"

const solution1 = (lines: string[]) => {
  return lines
    .map((line) => {
      const [rules, pass] = line.split(": ")
      const [rawNums, char] = rules.split(" ")
      const [min, max] = rawNums.split("-").map(Number)
      return { pass, char, min, max }
    })
    .filter((line) => {
      const nChars = line.pass
        .split("")
        .reduce((a, b) => (b === line.char ? a + 1 : a), 0)
      return nChars >= line.min && nChars <= line.max
    }).length
}

const solution2 = (lines: string[]) => {
  return lines
    .map((line) => {
      const [rules, pass] = line.split(": ")
      const [rawNums, char] = rules.split(" ")
      const [min, max] = rawNums.split("-").map(Number)
      return { pass, char, min, max }
    })
    .filter((line) => {
      return (
        line.pass
          .split("")
          .filter(
            (c, idx) =>
              line.char === c && (idx + 1 === line.min || idx + 1 === line.max),
          ).length === 1
      )
    }).length
}

export default [solution1, solution2]
