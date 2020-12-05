import { linesMapper } from "utils/linesMapper"

const parseBinaryStr = (word: string, one: string) =>
  parseInt(
    word
      .split("")
      .map((c) => (c === one ? 1 : 0))
      .join(""),
    2,
  )

const getId = (line: string) => {
  const row = parseBinaryStr(line.slice(0, 7), "B")
  const col = parseBinaryStr(line.slice(7), "R")
  return row * 8 + col
}

const solution1 = linesMapper(getId, (ids) => Math.max(...ids))
const solution2 = linesMapper(getId, (ids) => {
  const min = Math.min(...ids)
  const max = Math.max(...ids)
  const idsSet = new Set(ids)
  for (let i = min; i < max; i++) {
    if (idsSet.has(i - 1) && idsSet.has(i + 1) && !idsSet.has(i)) {
      return i
    }
  }
})

export default [solution1, solution2]
