import add from "utils/add"
import { linesMapper } from "utils/linesMapper"

const mapper = (str: string) => str.split("")

const solution1 = linesMapper(mapper, (lines) => {
  const set = new Set<string>()
  let count = 0

  lines.forEach((line) => {
    if (line.length === 0) {
      count += set.size
      set.clear()
    }
    line.forEach((c) => set.add(c))
  })
  count += set.size

  return count
})

const solution2 = linesMapper(mapper, (lines) => {
  const set = new Map<string, number>()
  let nParticipants = 0
  let count = 0

  lines.forEach((line) => {
    if (line.length === 0) {
      count += [...set.values()].filter((x) => x === nParticipants).length
      set.clear()
      nParticipants = 0
      return
    }
    nParticipants++
    line.forEach((c) => {
      if (set.has(c)) {
        set.set(c, set.get(c)! + 1)
      } else {
        set.set(c, 1)
      }
    })
  })
  count += [...set.values()].filter((x) => x === nParticipants).length

  return count
})

export default [solution1, solution2]
