import { glob } from 'tinyglobby';
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
  return glob(options.include, {
    cwd: path,
    absolute: true,
    ignore: options.ignore,
  });
}
