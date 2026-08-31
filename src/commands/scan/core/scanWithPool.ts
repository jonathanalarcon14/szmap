import { availableParallelism } from 'os';
import { fileURLToPath } from 'url';
import type { FileScanResult } from './FileScanResult';

export async function scanWithPool(
  files: string[],
  chunkSize: number,
): Promise<FileScanResult[]> {
  const { default: Tinypool } = await import('tinypool');
  const isTs = import.meta.url.endsWith('.ts');
  const workerUrl = new URL(
    isTs ? './scanInProcess.ts' : './scanInProcess.js',
    import.meta.url,
  );
  const pool = new Tinypool({
    filename: fileURLToPath(workerUrl),
    maxThreads: Math.max(1, availableParallelism() - 1),
    execArgv: isTs ? ['--import', 'tsx'] : [],
  });
  const chunks: string[][] = [];
  for (let i = 0; i < files.length; i += chunkSize) {
    chunks.push(files.slice(i, i + chunkSize));
  }
  try {
    const results = (await Promise.all(
      chunks.map((chunk) => pool.run(chunk, { name: 'scanInProcess' })),
    )) as FileScanResult[][];
    return results.flat();
  } finally {
    await pool.destroy();
  }
}
