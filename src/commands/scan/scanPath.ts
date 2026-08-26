import {
  findFiles,
  parseFile,
  analyzeSourceFile,
  type ScanOptions,
} from './core';

export async function scanPath(
  path: string,
  options: ScanOptions,
): Promise<void> {
  const files = await findFiles(path, options);
  const results = await Promise.all(
    files.map(async (file) => {
      const { sourceFile, lines } = await parseFile(file);
      const metrics = analyzeSourceFile(sourceFile);
      return { file, lines, ...metrics };
    }),
  );
  console.log(results);
}
