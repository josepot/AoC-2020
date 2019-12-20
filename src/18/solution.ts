import {
  Position,
  getAdjacentPositions,
  getPositionFromKey,
  getDiagonalPositions
} from "utils/ts/directions";
import graphDistinctSearch from "utils/ts/graphDistinctSearch";

const solution1 = (lines: string[]) => {
  const positions = new Map<string, string>();
  let initialPosition: Position;
  lines.forEach((line, y) =>
    line.split("").forEach((value, x) => {
      const key = `${x},${y}`;
      positions.set(key, value);
      if (value === "@") {
        initialPosition = getPositionFromKey(key);
        positions.set(key, ".");
      }
    })
  );

  const getNextKeysAtReach = (
    currentPosition: Position,
    collectedKeys: Set<string>
  ) => {
    interface SearchNode {
      id: string;
      steps: number;
    }
    const initialNode: SearchNode = {
      id: currentPosition.key,
      steps: 0
    };
    const distances = new Map<string, [number, string]>();
    try {
      graphDistinctSearch(
        initialNode,
        node => {
          const value = positions.get(node.id)!;
          if (
            value !== "." &&
            value.toLowerCase() === value &&
            !collectedKeys.has(value)
          ) {
            distances.set(value, [node.steps, node.id]);
          }
          return getAdjacentPositions(getPositionFromKey(node.id))
            .filter(p => {
              const value = positions.get(p.key);
              if (value === ".") return true;
              if (value === "#") return false;
              if (value?.toLowerCase() === value) return true;
              return collectedKeys.has(value!.toLowerCase());
            })
            .map(x => ({
              id: x.key,
              steps: node.steps + 1
            }));
        },
        (a, b) => b.steps - a.steps
      );
    } catch (e) {}
    return distances;
  };

  const previous = new Map<string, number>();

  const getSolution = (
    currentPosition: Position,
    keys: Set<string>
  ): number => {
    const currentKey = [currentPosition.key, ...[...keys].sort()].join(",");
    if (previous.has(currentKey)) return previous.get(currentKey)!;

    const nextKeys = getNextKeysAtReach(currentPosition, keys);
    if (nextKeys.size === 0) return 0;

    previous.set(
      currentKey,
      Math.min(
        ...[...nextKeys.entries()].map(
          ([key, [distance, positionId]]) =>
            distance +
            getSolution(getPositionFromKey(positionId), new Set([...keys, key]))
        )
      )
    );
    return previous.get(currentKey)!;
  };

  return getSolution(initialPosition!, new Set());
};

const solution2 = (lines: string[]) => {
  const positions = new Map<string, string>();
  let initialPosition: Position = { key: "", x: 0, y: 0 };
  lines.forEach((line, y) =>
    line.split("").forEach((value, x) => {
      const key = `${x},${y}`;
      positions.set(key, value);
      if (value === "@") {
        initialPosition = getPositionFromKey(key);
      }
    })
  );

  positions.set(initialPosition.key, "#");
  getAdjacentPositions(initialPosition).forEach(x => positions.set(x.key, "#"));
  const initialPositions = getDiagonalPositions(initialPosition);

  const getNextKeysAtReach = (
    currentPosition: Position,
    collectedKeys: Set<string>
  ) => {
    interface SearchNode {
      id: string;
      steps: number;
    }
    const initialNode: SearchNode = {
      id: currentPosition.key,
      steps: 0
    };
    const distances = new Map<string, [number, string]>();
    try {
      graphDistinctSearch(
        initialNode,
        node => {
          const value = positions.get(node.id)!;
          if (
            value !== "." &&
            value.toLowerCase() === value &&
            !collectedKeys.has(value)
          ) {
            distances.set(value, [node.steps, node.id]);
          }
          return getAdjacentPositions(getPositionFromKey(node.id))
            .filter(p => {
              const value = positions.get(p.key);
              if (value === ".") return true;
              if (value === "#") return false;
              if (value?.toLowerCase() === value) return true;
              return collectedKeys.has(value!.toLowerCase());
            })
            .map(x => ({
              id: x.key,
              steps: node.steps + 1
            }));
        },
        (a, b) => b.steps - a.steps
      );
    } catch (e) {}
    return distances;
  };

  const previous = new Map<string, number>();

  const getSolution = (
    currentPositions: Position[],
    keys: Set<string>
  ): number => {
    const currentKey = [
      ...currentPositions.map(x => x.key),
      ...[...keys].sort()
    ].join(",");
    if (previous.has(currentKey)) return previous.get(currentKey)!;

    const nextKeysByRobot = currentPositions.map(currentPosition =>
      getNextKeysAtReach(currentPosition, keys)
    );
    if (nextKeysByRobot.every(x => x.size === 0)) return 0;

    previous.set(
      currentKey,
      Math.min(
        ...nextKeysByRobot
          .map((nextKeys, robotIdx) =>
            [...nextKeys.entries()].map(
              ([key, [distance, positionId]]) =>
                distance +
                getSolution(
                  currentPositions.map((x, idx) =>
                    idx === robotIdx ? getPositionFromKey(positionId) : x
                  ),
                  new Set([...keys, key])
                )
            )
          )
          .flat()
      )
    );
    return previous.get(currentKey)!;
  };

  return getSolution(initialPositions, new Set());
};

export default [solution1, solution2];