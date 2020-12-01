const solution1 = (lines: string[]) => {
  const entries = lines.map(Number)

  for (let i = 0; i < entries.length; i++) {
    for (let z = i + 1; z < entries.length; z++) {
      if (entries[i] + entries[z] === 2020) return entries[i] * entries[z]
    }
  }
}

const solution2 = (lines: string[]) => {
  const entries = lines.map(Number)

  for (let i = 0; i < entries.length; i++) {
    for (let z = i + 1; z < entries.length; z++) {
      for (let zz = z + 1; zz < entries.length; zz++) {
        if (entries[i] + entries[z] + entries[zz] === 2020)
          return entries[i] * entries[z] * entries[zz]
      }
    }
  }
}

export default [solution1, solution2]
