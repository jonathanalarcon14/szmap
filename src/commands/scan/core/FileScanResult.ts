import type { FileMetrics } from './FileMetrics';

export interface FileScanResult extends FileMetrics {
  file: string;
  lines: number;
}
