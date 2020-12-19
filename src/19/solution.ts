import { tupleCombinations } from "utils/tupleCombinations"

interface Rule {
  id: number
  solvedRules: string[] | null
  rules: number[][]
}

const getRule = (line: string): Rule => {
  const [idStr, ruleRaw] = line.split(": ")
  const id = Number(idStr)
  if (ruleRaw.startsWith('"')) {
    return { id, solvedRules: [ruleRaw.slice(1, -1)], rules: [] }
  }
  const rules = ruleRaw.split(" | ").map((part) => part.split(" ").map(Number))
  return { id, rules, solvedRules: null }
}

const solution1 = (lines: string[]) => {
  const rulesMap = new Map<number, Rule>()
  let stage = 0
  const messages: string[] = []
  lines.forEach((line) => {
    if (line.length === 0) {
      return stage++
    }
    if (stage === 0) {
      const rule = getRule(line)
      rulesMap.set(rule.id, rule)
    } else {
      messages.push(line)
    }
  })

  const solveRule = (id: number): string[] => {
    const entry = rulesMap.get(id)!
    if (entry.solvedRules) return entry.solvedRules!

    return (entry.solvedRules = entry.rules
      .map((rules) => {
        return rules.map(solveRule).reduce(
          (acc, current) => {
            const result: string[] = []
            acc.forEach((prev) =>
              current.forEach((next) => result.push(prev + next)),
            )
            return result
          },
          [""] as string[],
        )
      })
      .flat())
  }

  const candidates = solveRule(0)

  return messages.filter((message) => candidates.includes(message)).length
}

const solution2 = null
export default [solution1, solution2].filter(Boolean)
