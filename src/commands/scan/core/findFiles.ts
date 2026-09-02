import { fdir } from 'fdir';
import { statSync } from 'fs';
import { relative, sep } from 'path';
import picomatch from 'picomatch';
import type { ScanOptions } from './ScanOptions';

const SIMPLE_DIR_IGNORE = /^\*\*\/([^/*?{}[\]!()]+)\/\*\*$/;

export async function findFiles(
  path: string,
  options: ScanOptions,
): Promise<string[]> {
  const stats = statSync(path);
  if (stats.isFile()) {
    return [path];
  }

  const prunableDirs = new Set<string>();
  const complexIgnorePatterns: string[] = [];
  for (const pattern of options.ignore) {
    const match = SIMPLE_DIR_IGNORE.exec(pattern);
    if (match) prunableDirs.add(match[1]);
    else complexIgnorePatterns.push(pattern);
  }

  const isIgnored = complexIgnorePatterns.length
    ? picomatch(complexIgnorePatterns)
    : () => false;
  const isIncluded = options.include.length
    ? picomatch(options.include)
    : () => true;

  const results = await new fdir()
    .withFullPaths()
    .exclude((name) => name.startsWith('.') || prunableDirs.has(name))
    .filter((filePath, isDirectory) => {
      if (isDirectory) return false;
      const rel = relative(path, filePath).split(sep).join('/');
      return isIncluded(rel) && !isIgnored(rel);
    })
    .crawl(path)
    .withPromise();

  return results;
}
