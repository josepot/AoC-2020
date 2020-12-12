import { Direction, getDirectionWheel, turnWheel } from "utils/directions"

interface Position {
  x: number
  y: number
}

const lineMapper = (line: string) => {
  const direction = line.substr(0, 1)
  const amount = Number(line.slice(1))
  return [direction, amount] as const
}
const solution1 = (lines: string[]) => {
  const instructions = lines.map(lineMapper)
  let wheel = getDirectionWheel()
  wheel = turnWheel(wheel, Direction.RIGHT)

  let currentPosition = { x: 0, y: 0 }

  instructions.forEach(([dir, amount]) => {
    switch (dir) {
      case "L": {
        const n = amount / 90
        for (let i = 0; i < n; i++) {
          wheel = wheel.left
        }
        break
      }
      case "R": {
        const n = amount / 90
        for (let i = 0; i < n; i++) {
          wheel = wheel.right
        }
        break
      }
      case "F": {
        if (wheel.value === Direction.RIGHT) {
          currentPosition.x += amount
        } else if (wheel.value === Direction.LEFT) {
          currentPosition.x -= amount
        } else if (wheel.value === Direction.UP) {
          currentPosition.y += amount
        } else if (wheel.value === Direction.DOWN) {
          currentPosition.y -= amount
        }
        break
      }
      case "N": {
        currentPosition.y += amount
        break
      }
      case "S": {
        currentPosition.y -= amount
        break
      }
      case "E": {
        currentPosition.x += amount
        break
      }
      case "W": {
        currentPosition.x -= amount
        break
      }
    }
  })
  return Math.abs(currentPosition.x) + Math.abs(currentPosition.y)
}

const rotate = (
  center: Position,
  target: Position,
  right: boolean,
): Position => {
  const x = target.x - center.x
  const y = target.y - center.y
  let deltaX: number
  let deltaY: number

  if (right) {
    deltaX = y
    deltaY = -x
  } else {
    deltaX = -y
    deltaY = x
  }

  return { x: center.x + deltaX, y: center.y + deltaY }
}

const solution2 = (lines: string[]) => {
  const instructions = lines.map(lineMapper)
  let currentPosition: Position = { x: 0, y: 0 }
  let wayPoint: Position = { x: 10, y: 1 }

  instructions.forEach(([dir, amount]) => {
    switch (dir) {
      case "L":
      case "R": {
        const n = amount / 90
        for (let i = 0; i < n; i++) {
          wayPoint = rotate(currentPosition, wayPoint, dir === "R")
        }
        break
      }
      case "F": {
        const xDelta = wayPoint.x - currentPosition.x
        const yDelta = wayPoint.y - currentPosition.y

        currentPosition.x += xDelta * amount
        currentPosition.y += yDelta * amount

        wayPoint.x += xDelta * amount
        wayPoint.y += yDelta * amount
        break
      }
      case "N": {
        wayPoint.y += amount
        break
      }
      case "S": {
        wayPoint.y -= amount
        break
      }
      case "E": {
        wayPoint.x += amount
        break
      }
      case "W": {
        wayPoint.x -= amount
        break
      }
    }
  })
  return Math.abs(currentPosition.x) + Math.abs(currentPosition.y)
}

export default [solution1, solution2]
