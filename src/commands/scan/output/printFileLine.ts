import type { FileScanResult } from '../core';
import type { ResolvedConfig } from '@config';

export function printFileLine(
  result: FileScanResult,
  path: string,
  config: ResolvedConfig,
) {
  console.log(
    `${path} — ${config.colors.metrics}${result.lines} lines, ${result.functions} functions, ${result.classes} classes, ${result.methods} methods, ${result.interfaces} interfaces${config.colors.reset}`,
  );
}
