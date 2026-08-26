import { Command } from 'commander';
import { scanPath } from './scanPath';
import type { ScanOptions } from './core';

const DEFAULT_INCLUDE = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
const DEFAULT_IGNORE = ['**/node_modules/**'];

export function registerScanCommand(program: Command) {
  program.argument('[path]', '', '.').action(async (path: string) => {
    const options: ScanOptions = {
      include: DEFAULT_INCLUDE,
      ignore: DEFAULT_IGNORE,
    };
    return await scanPath(path, options);
  });
}
