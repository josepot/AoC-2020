const fields: Record<string, (val: string) => boolean> = {
  byr: (x) => {
    const val = Number(x)
    return val >= 1920 && val <= 2002
  },
  iyr: (x) => {
    const val = Number(x)
    return val >= 2010 && val <= 2020
  },
  eyr: (x) => {
    const val = Number(x)
    return val >= 2020 && val <= 2030
  },
  hgt: (x) => {
    const val = parseInt(x, 10)
    if (x.endsWith("cm")) {
      return val >= 150 && val <= 193
    } else if (x.endsWith("in")) {
      return val >= 59 && val <= 76
    } else {
      return false
    }
  },
  hcl: (x) => {
    if (!x.startsWith("#")) return false
    return (
      x
        .slice(1)
        .split("")
        .map((x) => x.charCodeAt(0))
        .filter((x) => (x >= 97 && x <= 102) || (x >= 48 && x <= 57)).length ===
      6
    )
  },
  ecl: (x) => ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"].includes(x),
  pid: (x) => {
    return (
      x
        .split("")
        .map((x) => x.charCodeAt(0))
        .filter((x) => x >= 48 && x <= 57).length === 9
    )
  },
  cid: () => true,
}

const getPassports = (lines: string[]) => {
  let rawPassports: string[] = []
  let [current] = lines
  current += " "
  lines.slice(1).forEach((line) => {
    if (line.length === 0) {
      rawPassports.push(current)
      current = ""
    }
    current += line
    current += " "
  })
  if (current) {
    rawPassports.push(current)
  }

  return rawPassports.map((rawPass) =>
    Object.fromEntries(
      (rawPass + " cid:whatever")
        .split(" ")
        .filter(Boolean)
        .map((fieldVal) => {
          const [field, val] = fieldVal.split(":")
          return [field, val]
        }),
    ),
  )
}

const solution1 = (lines: string[]) =>
  getPassports(lines).filter(
    (pass) => Object.keys(pass).filter((key) => fields[key]).length === 8,
  ).length

const solution2 = (lines: string[]) =>
  getPassports(lines).filter(
    (pass) =>
      Object.entries(pass).filter(([key, value]) => fields[key](value))
        .length === 8,
  ).length

export default [solution1, solution2]
