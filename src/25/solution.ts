const transformSubjectNumber = (subject: number, target: number) => {
  let result = 1
  let counter = 0
  do {
    counter++
    result *= subject
    result = result % 20201227
  } while (result !== target)
  return counter
}

const solution1 = (lines: string[]) => {
  const publicKeys = lines.map(Number)
  const loop1 = transformSubjectNumber(7, publicKeys[0])
  let result = 1
  let counter = 0
  do {
    counter++
    result *= publicKeys[1]
    result = result % 20201227
  } while (counter !== loop1)
  return result
}

const solution2 = null

export default [solution1, solution2].filter(Boolean)
