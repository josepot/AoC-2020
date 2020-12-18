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

const solve = (group: Group): number => {
  let result =
    typeof group.values[0] === "number"
      ? (group.values[0] as number)
      : solve(group.values[0] as Group)
  group.operations.forEach((operation, idx) => {
    const b =
      typeof group.values[idx + 1] === "number"
        ? (group.values[idx + 1] as number)
        : solve(group.values[idx + 1] as Group)
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
