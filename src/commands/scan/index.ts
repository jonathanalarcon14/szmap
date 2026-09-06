import { Command } from 'commander';
import { existsSync } from 'fs';
import type { ScanOptions, SkippedFile } from './core';
import { resolve } from 'path';

export function registerScanCommand(program: Command) {
  program
    .argument(
      '[paths...]',
      'files or directories to scan (prefix with ! to exclude, defaults to current directory)',
      ['.'],
    )
    .option(
      '-i, --ignore <patterns...>',
      'glob patterns to exclude (relative to each scan root)',
    )
    .action(async (args: string[], flags: { ignore?: string[] }) => {
      const [
        { scanPath },
        { printDataFiles },
        { parsePathArgs },
        { loadConfig, ANSI_COLORS },
      ] = await Promise.all([
        import('./scanPath.js'),
        import('./printDataFiles.js'),
        import('./core/index.js'),
        import('@config'),
      ]);
      const config = loadConfig();
      const { paths: rawPaths, ignores: inlineIgnores } = parsePathArgs(args);
      const paths = rawPaths.length > 0 ? rawPaths : ['.'];
      const options: ScanOptions = {
        include: config.scan.include,
        ignore: [
          ...config.scan.ignore,
          ...inlineIgnores,
          ...(flags.ignore ?? []),
        ],
      };
      console.log(
        `${ANSI_COLORS.green}Scanning ${paths.length} ${paths.length === 1 ? 'path' : 'paths'}...${ANSI_COLORS.reset}`,
      );
      const start = Date.now();
      let totalFiles = 0;
      const allSkipped: SkippedFile[] = [];
      for (const path of paths) {
        const absolutePath: string = resolve(path);
        if (!existsSync(absolutePath)) {
          console.error(
            `${ANSI_COLORS.red}Path not found: ${path}${ANSI_COLORS.reset}`,
          );
          process.exitCode = 1;
          continue;
        }
        const { results, skipped } = await scanPath(
          absolutePath,
          options,
          config.scan.poolThreshold,
          config.scan.chunkSize,
        );
        allSkipped.push(...skipped);
        if (results.length === 0) {
          console.log(
            `${ANSI_COLORS.yellow}No files matched in '${path}'. Check your patterns with 'szmap config'.${ANSI_COLORS.reset}`,
          );
          continue;
        }
        totalFiles += results.length;
        printDataFiles(results, absolutePath, path, config);
      }

      if (totalFiles > 0) {
        const time = Date.now() - start;
        const formattedTime =
          time < 1000 ? `${time}ms` : `${(time / 1000).toFixed(2)}s`;
        console.log(
          `${totalFiles} ${totalFiles === 1 ? 'file' : 'files'} scanned in ${formattedTime}`,
        );
      }

      if (allSkipped.length > 0) {
        const label = allSkipped.length === 1 ? 'file' : 'files';
        console.log(
          `${ANSI_COLORS.yellow}Skipped ${allSkipped.length} ${label} (parse errors):`,
        );
        for (const { file, message } of allSkipped) {
          console.log(`  ${file} — ${message}`);
        }
        console.log(ANSI_COLORS.reset);
      } else if (totalFiles > 0) {
        console.log();
      }
    });
}
