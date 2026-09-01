#!/usr/bin/env node
import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { registerScanCommand, registerConfigCommand } from './commands';
import { ANSI_COLORS } from '@config';

const program = new Command();

program
  .name('szmap')
  .description('Analyze codebases and visualize file metrics')
  .version(pkg.version, '-v, --version', 'output the current version')
  .helpOption('-h, --help', 'display help for command');

registerScanCommand(program);
registerConfigCommand(program);

program.parseAsync().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`${ANSI_COLORS.red}Error: ${message}${ANSI_COLORS.reset}`);
  process.exit(1);
});
