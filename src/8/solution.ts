import { linesMapper } from "utils/linesMapper"

const mapLine = (line: string) => {
  const [instruction, delta] = line.split(" ")
  return [instruction, Number(delta)] as [string, number]
}

const solution1 = linesMapper(mapLine, (instructions: [string, number][]) => {
  let acc = 0
  let idx = 0
  const runInstructions = new Set<number>()

  do {
    if (runInstructions.has(idx)) {
      return acc
    }
    runInstructions.add(idx)
    const [instruction, delta] = instructions[idx]
    switch (instruction) {
      case "acc": {
        acc += delta
        idx++
        break
      }
      case "jmp": {
        idx += delta
        break
      }
      case "nop": {
        idx++
      }
      default: {
      }
    }
  } while (true)
})

const program = (instructions: [string, number][]) => {
  let acc = 0
  let idx = 0
  const runInstructions = new Set<number>()

  do {
    if (runInstructions.has(idx)) {
      return [acc, false]
    } else if (idx >= instructions.length) {
      return [acc, idx === instructions.length]
    }
    runInstructions.add(idx)
    const [instruction, delta] = instructions[idx]
    switch (instruction) {
      case "acc": {
        acc += delta
        idx++
        break
      }
      case "jmp": {
        idx += delta
        break
      }
      case "nop": {
        idx++
      }
      default: {
      }
    }
  } while (true)
}

const solution2 = linesMapper(mapLine, (instructions: [string, number][]) => {
  for (let i = 0; i < instructions.length; i++) {
    if (instructions[i][0] !== "acc") {
      const newInstructions = [...instructions]
      let [instruction, delta] = instructions[i]
      instruction = instruction === "jmp" ? "nop" : "jmp"
      newInstructions[i] = [instruction, delta]
      const [acc, isOk] = program(newInstructions)
      if (isOk) return acc
    }
  }
})

export default [solution1, solution2]
