import { availableParallelism } from 'os';
import { fileURLToPath } from 'url';
import type { ScanResult } from './scanInProcess';

export async function scanWithPool(
  files: string[],
  chunkSize: number,
): Promise<ScanResult> {
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
    const chunkResults = (await Promise.all(
      chunks.map((chunk) => pool.run(chunk, { name: 'scanInProcess' })),
    )) as ScanResult[];
    return {
      results: chunkResults.flatMap((c) => c.results),
      skipped: chunkResults.flatMap((c) => c.skipped),
    };
  } finally {
    await pool.destroy();
  }
}
