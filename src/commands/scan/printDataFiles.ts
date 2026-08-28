import type { FileScanResult } from './scanPath';
import { printTree } from './output';

export function printDataFiles(
  results: FileScanResult[],
  absolutePath: string,
): void {
  printTree(results, absolutePath);
}
