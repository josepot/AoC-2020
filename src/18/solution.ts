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

const solve = (group: Group | number): number =>
  typeof group === "number"
    ? group
    : group.values
        .map(solve)
        .reduce((acc, current, idx) =>
          group.operations[idx - 1] === Operation.Addition
            ? acc + current
            : acc * current,
        )

const parseLine = (part: number) => (line: string): Group => {
  const stack = new Stack<Group>()
  let currentGroup: Group = {
    values: [],
    operations: [],
  }
  stack.push(currentGroup)

  const part2Nesting =
    part === 2
      ? () => {
          if (
            currentGroup.operations[currentGroup.operations.length - 1] ===
            Operation.Addition
          ) {
            currentGroup.values.push({
              operations: currentGroup.operations.splice(-1),
              values: currentGroup.values.splice(-2),
            })
          }
        }
      : Function.prototype

  line.split("").forEach((value) => {
    switch (value) {
      case " ":
        return
      case "(": {
        const nextGroup = {
          values: [],
          operations: [],
        }
        currentGroup.values.push(nextGroup)
        stack.push(currentGroup)
        return (currentGroup = nextGroup)
      }
      case ")": {
        currentGroup = stack.pop()!
        return part2Nesting()
      }
      case "+":
        return currentGroup.operations.push(Operation.Addition)
      case "*":
        return currentGroup.operations.push(Operation.Multiplication)
      default: {
        currentGroup.values.push(Number(value))
        part2Nesting()
      }
    }
  })
  return currentGroup
}

const solution = (part: number) => (lines: string[]) =>
  lines.map(parseLine(part)).map(solve).reduce(add)

export default [1, 2].map(solution)
