import { Command } from 'commander';
import { loadConfig } from '@config';
import { scanPath } from './scanPath';
import type { ScanOptions } from './core';
import { printDataFiles } from './printDataFiles';
import { resolve } from 'path';

export function registerScanCommand(program: Command) {
  program.argument('[paths...]', '', ['.']).action(async (paths: string[]) => {
    const config = loadConfig();
    const options: ScanOptions = {
      include: config.scan.include,
      ignore: config.scan.ignore,
    };
    console.log();
    for (const path of paths) {
      const absolutePath: string = resolve(path);
      const result = await scanPath(absolutePath, options);
      printDataFiles(result, absolutePath, path);
    }
    console.log();
  });
}
