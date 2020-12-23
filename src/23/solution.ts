import { circularLinkedList, CircularLinkedListNode } from "utils/linkedLists"

const solution = (nRounds: number, nCups: number, rawInput: string) => {
  const possibleNumbers = Array(nCups)
    .fill(null)
    .map((_, idx) => idx + 1)

  rawInput
    .split("")
    .map(Number)
    .forEach((n, idx) => {
      possibleNumbers[idx] = n
    })

  const circList = circularLinkedList(possibleNumbers)
  const map: Map<number, CircularLinkedListNode<number>> = new Map(
    circList.map((v) => [v.value, v]),
  )

  let [current] = circList
  for (let i = 0; i < nRounds; i++) {
    const impossibleTargets = new Set<number>()

    const firstNext = current.next
    let lastNext = firstNext
    impossibleTargets.add(lastNext.value)

    lastNext = lastNext.next
    impossibleTargets.add(lastNext.value)

    lastNext = lastNext.next
    impossibleTargets.add(lastNext.value)

    let targetValue = current.value - 1
    if (targetValue === 0) targetValue = nCups

    while (impossibleTargets.has(targetValue)) {
      if (--targetValue === 0) targetValue = nCups
    }

    current.next = lastNext.next

    const target = map.get(targetValue)!

    lastNext.next = target.next
    target.next = firstNext

    current = current.next
  }

  return map.get(1)!
}

const solution1 = (line: string) => {
  let labelOne = solution(100, 9, line)
  let result = ""
  let current = labelOne
  do {
    current = current.next
    result += current.value
  } while (current.next.value !== 1)
  return result
}

const solution2 = (line: string) => {
  let labelOne = solution(10_000_000, 1_000_000, line)
  return labelOne.next.value * labelOne.next.next.value
}

export default [solution1, solution2].filter(Boolean)
