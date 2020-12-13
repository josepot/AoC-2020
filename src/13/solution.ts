const solution1 = (lines: string[]) => {
  const [earliestRaw, idsRaw] = lines

  const earliest = Number(earliestRaw)
  const ids = idsRaw
    .split(",")
    .filter((x) => x !== "x")
    .map(Number)

  const winner = ids
    .map((id) => [id, id - (earliest % id)] as const)
    .sort((a, b) => a[1] - b[1])[0]
  return winner[0] * winner[1]
}

function modMultiplicativeInverse(a: bigint, m: bigint): bigint {
  const mod = a % m
  for (let i = 1n; i < m; i++) if ((i * mod) % m == 1n) return i
  return 1n
}

function chineseRemainder(n: bigint[], a: bigint[]) {
  const accProduct = n.reduce((a, b) => a * b)
  let sum = 0n
  for (let i = 0; i < a.length; ++i) {
    const p = accProduct / n[i]
    sum += a[i] * p * modMultiplicativeInverse(p, n[i])
  }
  return sum % accProduct
}

const solutio2 = (lines: string[]) => {
  const [, idsRaw] = lines
  const busIdsIdx = idsRaw
    .split(",")
    .map((id, idx) => [Number(id), idx] as const)
    .filter(([id]) => !isNaN(id))

  const modsDiff = busIdsIdx.map(([busId, idx]) =>
    BigInt(busId - (idx % busId)),
  )
  const busIds = busIdsIdx.map(([id]) => BigInt(id))

  return Number(chineseRemainder(busIds, modsDiff))
}

export default [solution1, solutio2]
