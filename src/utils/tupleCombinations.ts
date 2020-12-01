export const tupleCombinations = <T>(
  arr: T[],
  cb: (...args: T[]) => boolean | void,
): T[] | undefined => {
  const len = cb.length
  if (len < 2) {
    throw new Error("Wrong arity on cb function")
  }
  const idxs = new Array<number>(len)
  const vals = new Array<T>(len)

  for (let idx = 0; idx < len; idx += 1) {
    idxs[idx] = idx
    vals[idx] = arr[idx]
  }

  function inc(idx: number): true | void {
    idxs[idx]++
    if (idxs[idx] === arr.length - (len - idx)) {
      if (idx === 0 || inc(idx - 1)) return true
      idxs[idx] = idxs[idx - 1] + 1
    }
  }

  let res = cb(...vals)
  while (!res) {
    if (inc(len - 1)) break
    for (let idx = 0; idx < len; idx += 1) {
      vals[idx] = arr[idxs[idx]]
    }
    res = cb(...vals)
  }

  if (res) return vals
}
