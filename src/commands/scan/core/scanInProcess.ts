import { parseFile } from './parseFile';
import { analyzeSourceFile } from './analyzeSourceFile';
import type { FileScanResult } from './FileScanResult';

export async function scanInProcess(
  files: string[],
): Promise<FileScanResult[]> {
  return Promise.all(
    files.map(async (file) => {
      const { program, lines } = await parseFile(file);
      const metrics = analyzeSourceFile(program);
      return { file, lines, ...metrics };
    }),
  );
}
