import { statSync } from 'fs';
import type { FileScanResult } from './core';
import type { ResolvedConfig } from '@config';
import { printTree, printFileLine } from './output';

export function printDataFiles(
  results: FileScanResult[],
  absolutePath: string,
  path: string,
  config: ResolvedConfig,
): void {
  console.log();
  const stats = statSync(absolutePath);
  if (stats.isFile()) {
    printFileLine(results[0], path, config);
  } else {
    printTree(results, absolutePath, config);
  }
  console.log();
}
