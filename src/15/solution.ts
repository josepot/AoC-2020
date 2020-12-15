interface Node {
  prev: Node | null
  turn: number
}
const solution = (target: number) => (line: string) => {
  const cache = new Map<number, Node>()
  let turn = 1
  let last = 0

  line
    .split(",")
    .map(Number)
    .forEach((n) => {
      cache.set((last = n), { turn: turn++, prev: null })
    })

  do {
    const f = cache.get(last)!.prev?.turn ?? 0
    last = f === 0 ? 0 : turn - 1 - f

    if (turn === target) return last
    const nextNode = cache.get(last)
    if (nextNode) {
      nextNode.prev = null
      cache.set(last, { turn, prev: nextNode })
    } else {
      cache.set(last, { turn, prev: null })
    }
    turn++
  } while (true)
}

export default [2020, 30000000].map(solution)
