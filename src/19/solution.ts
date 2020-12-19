interface Rule {
  id: number
  solvedRules: Set<string> | null
  rules: number[][]
}

const getRule = (line: string): Rule => {
  const [idStr, ruleRaw] = line.split(": ")
  const id = Number(idStr)
  if (ruleRaw.startsWith('"')) {
    return { id, solvedRules: new Set([ruleRaw.slice(1, -1)]), rules: [] }
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

  const solveRule = (id: number): Set<string> => {
    const entry = rulesMap.get(id)!
    if (entry.solvedRules) return entry.solvedRules!

    return (entry.solvedRules = new Set(
      entry.rules
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
        .flat(),
    ))
  }

  const candidates = solveRule(0)

  return messages.filter((message) => candidates.has(message)).length
}

const solution2 = (lines: string[]) => {
  const rulesMap = new Map<number, Rule>()
  let stage = 0
  const messages: string[] = []
  lines.forEach((line) => {
    if (line.length === 0) {
      return stage++
    }
    if (stage === 0) {
      if (line.startsWith("8: 42")) {
        line = "8: 42 | 42 8"
      } else if (line.startsWith("11: ")) {
        line = "11: 42 31 | 42 11 31"
      }
      const rule = getRule(line)
      rulesMap.set(rule.id, rule)
    } else {
      messages.push(line)
    }
  })

  const followsRule = (ids: number[], message: string): boolean => {
    if (ids.length === 0) return message.length === 0
    const [firstRule, ...otherRules] = ids
    const entry = rulesMap.get(firstRule)!
    return entry.solvedRules
      ? message.startsWith([...entry.solvedRules][0]) &&
          followsRule(otherRules, message.slice(1))
      : entry.rules.some((inner) =>
          followsRule([...inner, ...otherRules], message),
        )
  }

  return messages.filter((message) => followsRule([0], message)).length
}

export default [solution1, solution2].filter(Boolean)
