interface Rule {
  id: number
  rules: number[][] | string
}

const getRule = (line: string): Rule => {
  const [idStr, ruleRaw] = line.split(": ")
  const id = Number(idStr)
  return {
    id,
    rules: ruleRaw.startsWith('"')
      ? ruleRaw.slice(1, -1)
      : ruleRaw.split(" | ").map((part) => part.split(" ").map(Number)),
  }
}

const solution = (part: number) => (lines: string[]) => {
  const separatorIdx = lines.indexOf("")
  const rulesMap = new Map<number, Rule>(
    lines
      .slice(0, separatorIdx)
      .map(getRule)
      .map((rule) => [rule.id, rule]),
  )
  const messages = lines.slice(separatorIdx + 1)

  if (part === 2) {
    rulesMap.get(8)!.rules = [[42], [42, 8]]
    rulesMap.get(11)!.rules = [
      [42, 31],
      [42, 11, 31],
    ]
  }

  const followsRule = (message: string, ruleIds: number[]): boolean => {
    if (ruleIds.length === 0) return message.length === 0
    const [firstRule, ...otherRuleIds] = ruleIds
    const entry = rulesMap.get(firstRule)!
    return typeof entry.rules === "string"
      ? message.startsWith(entry.rules) &&
          followsRule(message.slice(1), otherRuleIds)
      : entry.rules.some((inner) =>
          followsRule(message, [...inner, ...otherRuleIds]),
        )
  }

  return messages.filter((message) => followsRule(message, [0])).length
}

export default [1, 2].map(solution)
