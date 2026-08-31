import type { FileScanResult } from '../core';
import type { ResolvedConfig } from '@config';

export function printFileLine(
  result: FileScanResult,
  path: string,
  config: ResolvedConfig,
) {
  console.log(
    `${path} — ${config.colors.metrics}${result.lines} ${result.lines === 1 ? 'line' : 'lines'}, ${result.functions} ${result.functions === 1 ? 'function' : 'functions'}, ${result.classes} ${result.classes === 1 ? 'class' : 'classes'}, ${result.methods} ${result.methods === 1 ? 'method' : 'methods'}, ${result.interfaces} ${result.interfaces === 1 ? 'interface' : 'interfaces'}${config.colors.reset}`,
  );
}
