import add from "utils/add"
import Queue from "utils/Queue"

const getScore = (input: Queue<number>): number => {
  const values: number[] = []
  while (input.peek() !== undefined) {
    values.push(input.pop()!)
  }
  return values
    .reverse()
    .map((val, idx) => val * (idx + 1))
    .reduce(add)
}

const solution1 = (lines: string[]) => {
  const splitIdx = lines.indexOf("")
  const player1 = new Queue(...lines.slice(1, splitIdx).map(Number))
  const player2 = new Queue(...lines.slice(splitIdx + 2).map(Number))

  do {
    if (player1.peek()! >= player2.peek()!) {
      player1.push(player1.pop()!)
      player1.push(player2.pop()!)
    } else {
      player2.push(player2.pop()!)
      player2.push(player1.pop()!)
    }
  } while (player1.peek() !== undefined && player2.peek() !== undefined)

  const winner = player1.peek() === undefined ? player2 : player1
  return getScore(winner)
}

const getId = (deck: Queue<number>) => {
  const result: number[] = []
  for (let i = 0; i < deck.size(); i++) {
    result.push(deck.peek()!)
    deck.push(deck.pop()!)
  }
  return result.join(",")
}

const copy = (queue: Queue<number>, len: number): Queue<number> => {
  const result = new Queue<number>()
  for (let i = 0; i < len; i++) {
    result.push(queue.peek()!)
    queue.push(queue.pop()!)
  }
  for (let i = 0; i < queue.size() - len; i++) queue.push(queue.pop()!)
  return result
}

const game = (
  player1: Queue<number>,
  player2: Queue<number>,
): Queue<number> => {
  const prevDecks1 = new Set<string>()
  const prevDecks2 = new Set<string>()

  do {
    const player1Id = getId(player1)
    const player2Id = getId(player2)

    if (prevDecks1.has(player1Id) || prevDecks2.has(player2Id)) return player1
    if (player1.size() === 0) return player2
    if (player2.size() === 0) return player1

    prevDecks1.add(player1Id)
    prevDecks2.add(player2Id)

    const player1Card = player1.pop()!
    const player2Card = player2.pop()!

    if (player1.size() >= player1Card && player2.size() >= player2Card) {
      const player1Copy = copy(player1, player1Card)
      const player2Copy = copy(player2, player2Card)

      if (game(player1Copy, player2Copy) === player1Copy) {
        player1.push(player1Card)
        player1.push(player2Card)
      } else {
        player2.push(player2Card)
        player2.push(player1Card)
      }
    } else {
      if (player1Card > player2Card) {
        player1.push(player1Card)
        player1.push(player2Card)
      } else {
        player2.push(player2Card)
        player2.push(player1Card)
      }
    }
  } while (true)
}

const solution2 = (lines: string[]) => {
  const splitIdx = lines.indexOf("")
  const player1 = new Queue(...lines.slice(1, splitIdx).map(Number))
  const player2 = new Queue(...lines.slice(splitIdx + 2).map(Number))
  const winnner = game(player1, player2)
  return getScore(winnner)
}

export default [solution1, solution2].filter(Boolean)
