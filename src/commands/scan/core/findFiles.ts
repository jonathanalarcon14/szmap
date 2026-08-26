import { globby } from 'globby';
import type { ScanOptions } from './ScanOptions';

export async function findFiles(
  path: string,
  options: ScanOptions,
): Promise<string[]> {
  return globby(options.include, {
    cwd: path,
    absolute: true,
    ignore: options.ignore,
  });
}
