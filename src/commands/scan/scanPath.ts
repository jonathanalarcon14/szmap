import {
  findFiles,
  parseFile,
  analyzeSourceFile,
  type ScanOptions,
  type FileMetrics,
} from './core';

export interface FileScanResult extends FileMetrics {
  file: string;
  lines: number;
}

export async function scanPath(
  path: string,
  options: ScanOptions,
): Promise<FileScanResult[]> {
  const files = await findFiles(path, options);
  const results = await Promise.all(
    files.map(async (file) => {
      const { sourceFile, lines } = await parseFile(file);
      const metrics = analyzeSourceFile(sourceFile);
      return { file, lines, ...metrics };
    }),
  );
  return results;
}
