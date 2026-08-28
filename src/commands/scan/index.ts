import { Command } from 'commander';
import { scanPath } from './scanPath';
import type { ScanOptions } from './core';
import { printDataFiles } from './printDataFiles';
import { resolve } from 'path';

const DEFAULT_INCLUDE = ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'];
const DEFAULT_IGNORE = ['**/node_modules/**'];

export function registerScanCommand(program: Command) {
  program.argument('[path]', '', '.').action(async (path: string) => {
    const options: ScanOptions = {
      include: DEFAULT_INCLUDE,
      ignore: DEFAULT_IGNORE,
    };
    const absolutePath: string = resolve(path);
    const result = await scanPath(absolutePath, options);
    printDataFiles(result, absolutePath);
  });
}
