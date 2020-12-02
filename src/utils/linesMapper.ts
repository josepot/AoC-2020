export const linesMapper = <T>(
  mapFn: (line: string) => T,
  solution: (lines: T[]) => any,
) => (lines: string[]) => solution(lines.map(mapFn))
