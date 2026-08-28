import type { FileScanResult } from '../scanPath';

const METRIC_COLOR = '\x1b[90m';
const RESET = '\x1b[0m';

export function printFileLine(result: FileScanResult, path: string) {
  console.log(
    `${path} — ${METRIC_COLOR}${result.lines} lines, ${result.functions} functions, ${result.classes} classes, ${result.interfaces} interfaces${RESET}`,
  );
}
