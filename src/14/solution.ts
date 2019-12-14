interface Node {
  id: string;
  total: number;
  requires: Array<[string, number]>;
}

const getLine = (str: string) => {
  const [inputsRaw, targetRaw] = str.split(" => ");
  const inputs = inputsRaw.split(", ").map(x => {
    const [rawNumber, key] = x.split(" ");
    return [key, Number(rawNumber)] as [string, number];
  });
  const [rawNumber, key] = targetRaw.split(" ");
  const target = [key, Number(rawNumber)] as [string, number];
  return [inputs, target] as [Array<[string, number]>, [string, number]];
};

const solution1 = (nodes: Map<string, Node>, nFuel = 1) => {
  const have = new Map<string, number>();
  const getPrimitivePrice = (rootKey: string, amount: number) => {
    let result = 0;
    const { total, requires } = nodes.get(rootKey)!;
    const multiplier = Math.ceil(amount / total);

    requires.forEach(([chidKey, childAmount]) => {
      const amountToget = multiplier * childAmount;
      if (!nodes.has(chidKey)) {
        result += amountToget;
      } else {
        if ((have.get(chidKey) ?? 0) < amountToget) {
          result += getPrimitivePrice(
            chidKey,
            amountToget - (have.get(chidKey) ?? 0)
          );
        }
        have.set(chidKey, (have.get(chidKey) ?? 0) - amountToget);
      }
    });
    have.set(rootKey, (have.get(rootKey) ?? 0) + multiplier * total);

    return result;
  };
  return getPrimitivePrice("FUEL", nFuel);
};

const solution2 = (nodes: Map<string, Node>) => {
  const target = 1000000000000;
  let up = 10000000;
  let down = 1000000;

  let diff;
  do {
    diff = Math.round((up - down) / 2);
    const result = solution1(nodes, down + diff);

    if (result > target) {
      up -= diff;
    } else if (result < target) {
      down += diff;
    } else {
      return down + diff;
    }
  } while (diff > 1);

  return down;
};

export default [solution1, solution2].map(fn => (lines: string[]) => {
  const nodes = new Map<string, Node>();
  lines.map(getLine).forEach(([left, [keyRight, nRight]]) => {
    nodes.set(keyRight, {
      id: keyRight,
      total: nRight,
      requires: left
    });
  });

  return fn(nodes);
});
