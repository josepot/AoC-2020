import add from "utils/add"
import Stack from "utils/Stack"

enum Operation {
  Addition,
  Multiplication,
}
interface Group {
  values: Array<number | Group>
  operations: Array<Operation>
}

const solve = (group: Group | number): number => {
  if (typeof group === "number") return group
  let result = solve(group.values[0])
  group.operations.forEach((operation, idx) => {
    const b = solve(group.values[idx + 1])
    result = operation === Operation.Addition ? result + b : result * b
  })
  return result
}

const parseLine = (line: string): Group => {
  let currentGroup: Group = {
    values: [],
    operations: [],
  }
  const stack = new Stack<Group>()
  stack.push(currentGroup)
  for (let i = 0; i < line.length; i++) {
    if (line[i] === " ") continue
    if (line[i] === "(") {
      const nextGroup = {
        values: [],
        operations: [],
      }
      currentGroup.values.push(nextGroup)
      stack.push(currentGroup)
      currentGroup = nextGroup
    } else if (line[i] === ")") {
      currentGroup = stack.pop()!
      if (
        currentGroup.operations[currentGroup.operations.length - 1] ===
        Operation.Addition
      ) {
        currentGroup.operations.splice(-1)
        const [a, b] = currentGroup.values.splice(-2)
        currentGroup.values.push({
          operations: [Operation.Addition],
          values: [a, b],
        })
      }
    } else if (line[i] === "+") {
      currentGroup.operations.push(Operation.Addition)
    } else if (line[i] === "*") {
      currentGroup.operations.push(Operation.Multiplication)
    } else {
      const x = Number(line[i])
      if (
        currentGroup.operations[currentGroup.operations.length - 1] ===
        Operation.Addition
      ) {
        currentGroup.operations.splice(-1)
        const [a] = currentGroup.values.splice(-1)
        currentGroup.values.push({
          operations: [Operation.Addition],
          values: [a, x],
        })
      } else {
        currentGroup.values.push(Number(line[i]))
      }
    }
  }
  return currentGroup
}

const solution1 = (lines: string[]) => {
  // const testInput = "2 * 3 + (4 * 5)"
  // return solve(parseLine(testInput))
  return lines.map(parseLine).map(solve).reduce(add)
}

const solution2 = solution1

export default [solution1, solution2].filter(Boolean)
