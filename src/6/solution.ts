import add from "utils/add"

const getGroups = (lines: string[]): string[][] => {
  const result: string[][] = []
  let current: string[] = []
  lines.forEach((line) => {
    if (line.length === 0) {
      result.push(current)
      current = []
    } else current.push(line)
  })
  if (current.length > 0) result.push(current)
  return result
}

const solution1 = (lines: string[]) =>
  getGroups(lines)
    .map((group) => group.flat().join("").split(""))
    .map((x) => new Set(x).size)
    .reduce(add)

const solution2 = (lines: string[]) =>
  getGroups(lines)
    .map((group) => {
      const counter: Record<string, number> = {}
      group.forEach((answers) => {
        answers.split("").forEach((answer) => {
          counter[answer] = counter[answer] ?? 0
          counter[answer]++
        })
      })
      return Object.values(counter).filter((count) => count === group.length)
        .length
    })
    .reduce(add)

export default [solution1, solution2]
