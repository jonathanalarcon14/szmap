import { statSync } from 'fs';
import type { FileScanResult } from './scanPath';
import { printTree, printFileLine } from './output';

export function printDataFiles(
  results: FileScanResult[],
  absolutePath: string,
  path: string,
): void {
  console.log();
  const stats = statSync(absolutePath);
  if (stats.isFile()) {
    printFileLine(results[0], path);
  } else {
    printTree(results, absolutePath);
  }
  console.log();
}
