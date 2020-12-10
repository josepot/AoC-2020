import {
  DoubleLinkedListNode,
  doubleLinkedList,
  linkedList,
  LinkedListNode,
} from "utils/linkedLists"

const solution1 = (lines: string[]) => {
  const adapters = lines.map(Number)
  const own = Math.max(...adapters) + 3

  adapters.push(own)
  adapters.sort((a, b) => a - b)

  const res = adapters.reduce(
    (acc, current) => {
      if (acc.done) return acc
      const diff = current - acc.prev
      if (diff > 3) {
        acc.done = true
        return acc
      }
      ;(acc.diffs[diff] as any)!++
      acc.prev = current
      return acc
    },
    {
      prev: 0,
      diffs: { 0: 0, 1: 0, 2: 0, 3: 0 } as Record<number, number>,
      done: false,
    },
  )

  return res.diffs[1] * res.diffs[3]
}

const solution2 = (lines: string[]) => {
  const adapters = lines.map(Number)
  const own = Math.max(...adapters) + 3

  adapters.push(own)
  adapters.push(0)
  adapters.sort((a, b) => a - b)

  const cache = new Map<number, number[]>()

  const buildCache = (current?: LinkedListNode<number>) => {
    if (!current || cache.has(current.value)) return

    let next = current.next
    const nextValues: number[] = []
    while (next && next.value - current.value < 4) {
      nextValues.push(next.value)
      next = next.next
    }
    cache.set(current.value, nextValues)
    buildCache(current.next)
  }
  const adaptersList = linkedList(adapters)
  buildCache(adaptersList[0])

  const permutationsCache = new Map<number, number>()

  const getPermutations = (id: number): number => {
    if (permutationsCache.has(id)) return permutationsCache.get(id)!

    const options = cache.get(id)!

    const result =
      options.length === 0
        ? 1
        : options.map(getPermutations).reduce((a, b) => a + b)
    permutationsCache.set(id, result)
    return result
  }

  return getPermutations(0)
}

export default [solution1, solution2].filter(Boolean)
