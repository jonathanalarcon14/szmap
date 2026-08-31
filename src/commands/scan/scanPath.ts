import {
  findFiles,
  scanInProcess,
  scanWithPool,
  type ScanOptions,
  type FileScanResult,
} from './core';

export async function scanPath(
  path: string,
  options: ScanOptions,
  poolThreshold: number,
  chunkSize: number,
): Promise<FileScanResult[]> {
  const files = await findFiles(path, options);
  return files.length > poolThreshold
    ? scanWithPool(files, chunkSize)
    : scanInProcess(files);
}
