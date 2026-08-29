import { Command } from 'commander';
import { existsSync } from 'fs';
import type { ResolvedConfig } from '@config';
import { scanPath } from './scanPath';
import type { ScanOptions } from './core';
import { printDataFiles } from './printDataFiles';
import { ANSI_COLORS } from '@config';
import { resolve } from 'path';

export function registerScanCommand(program: Command, config: ResolvedConfig) {
  program
    .argument(
      '[paths...]',
      'files or directories to scan (defaults to current directory)',
      ['.'],
    )
    .action(async (paths: string[]) => {
      const options: ScanOptions = {
        include: config.scan.include,
        ignore: config.scan.ignore,
      };
      console.log(
        `${ANSI_COLORS.green}Scanning ${paths.length} ${paths.length === 1 ? 'path' : 'paths'}...${ANSI_COLORS.reset}`,
      );
      const start = Date.now();
      let totalFiles = 0;
      for (const path of paths) {
        const absolutePath: string = resolve(path);
        if (!existsSync(absolutePath)) {
          console.error(
            `${ANSI_COLORS.red}Path not found: ${path}${ANSI_COLORS.reset}`,
          );
          process.exitCode = 1;
          continue;
        }
        const result = await scanPath(absolutePath, options);
        if (result.length === 0) {
          console.log(
            `${ANSI_COLORS.yellow}No files matched in ${path}. Check your patterns with 'szmap config'.${ANSI_COLORS.reset}`,
          );
          continue;
        }
        totalFiles += result.length;
        printDataFiles(result, absolutePath, path, config);
      }

      if (totalFiles > 0) {
        const time = Date.now() - start;
        const formattedTime =
          time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(2)}s`;
        console.log(
          `${totalFiles} ${totalFiles === 1 ? 'file' : 'files'} scanned in ${formattedTime}`,
        );
        console.log();
      }
    });
}
