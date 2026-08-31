export interface ParsedPathArgs {
  paths: string[];
  ignores: string[];
}

export function parsePathArgs(args: string[]): ParsedPathArgs {
  const paths: string[] = [];
  const ignores: string[] = [];
  for (const arg of args) {
    if (arg.startsWith('!')) ignores.push(arg.slice(1));
    else paths.push(arg);
  }
  return { paths, ignores };
}
