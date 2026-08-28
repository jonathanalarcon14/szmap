import type { FileScanResult } from '../scanPath';
import { loadConfig } from '@config';

export function printFileLine(result: FileScanResult, path: string) {
  const config = loadConfig();
  console.log(
    `${path} — ${config.colors.metrics}${result.lines} lines, ${result.functions} functions, ${result.classes} classes, ${result.interfaces} interfaces${config.colors.reset}`,
  );
}
