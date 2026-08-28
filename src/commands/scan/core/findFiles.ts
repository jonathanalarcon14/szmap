import { globby } from 'globby';
import { statSync } from 'fs';
import type { ScanOptions } from './ScanOptions';

export async function findFiles(
  path: string,
  options: ScanOptions,
): Promise<string[]> {
  const stats = statSync(path);
  if (stats.isFile()) {
    return [path];
  }
  return globby(options.include, {
    cwd: path,
    absolute: true,
    ignore: options.ignore,
  });
}
