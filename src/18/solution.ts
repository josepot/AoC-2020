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
    } else if (line[i] === "+") {
      currentGroup.operations.push(Operation.Addition)
    } else if (line[i] === "*") {
      currentGroup.operations.push(Operation.Multiplication)
    } else {
      currentGroup.values.push(Number(line[i]))
    }
  }
  return currentGroup
}

const solution1 = (lines: string[]) => {
  return lines.map(parseLine).map(solve).reduce(add)
}

const solution2 = null

export default [solution1, solution2].filter(Boolean)
