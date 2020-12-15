const solution = (target: number) => (line: string) => {
  const input = line.split(",").map(Number)
  const cache = new Map<number, number>()
  let turn = 1

  input.slice(0, -1).forEach((n) => {
    cache.set(n, turn++)
  })

  let next = input[input.length - 1]
  do {
    let nextNext = cache.has(next) ? turn - cache.get(next)! : 0
    cache.set(next, turn)
    next = nextNext
  } while (++turn < target)
  return next
}

export default [2020, 30000000].map(solution)
