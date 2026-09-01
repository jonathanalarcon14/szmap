import { parseFile } from './parseFile';
import { analyzeSourceFile } from './analyzeSourceFile';
import type { FileScanResult } from './FileScanResult';

export interface SkippedFile {
  file: string;
  message: string;
}

export interface ScanResult {
  results: FileScanResult[];
  skipped: SkippedFile[];
}

export async function scanInProcess(files: string[]): Promise<ScanResult> {
  const results: FileScanResult[] = [];
  const skipped: SkippedFile[] = [];
  await Promise.all(
    files.map(async (file) => {
      try {
        const { program, lines } = await parseFile(file);
        const metrics = analyzeSourceFile(program);
        results.push({ file, lines, ...metrics });
      } catch (err) {
        skipped.push({
          file,
          message: err instanceof Error ? err.message : String(err),
        });
      }
    }),
  );
  return { results, skipped };
}
