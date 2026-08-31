import { parseFile } from './parseFile';
import { analyzeSourceFile } from './analyzeSourceFile';
import type { FileScanResult } from './FileScanResult';

export async function scanInProcess(
  files: string[],
): Promise<FileScanResult[]> {
  const results = await Promise.all(
    files.map(async (file): Promise<FileScanResult | null> => {
      try {
        const { program, lines } = await parseFile(file);
        const metrics = analyzeSourceFile(program);
        return { file, lines, ...metrics };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.warn(`Skipped ${file}: ${message}`);
        return null;
      }
    }),
  );
  return results.filter((r): r is FileScanResult => r !== null);
}
