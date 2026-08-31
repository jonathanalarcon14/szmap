#!/usr/bin/env node
import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { registerScanCommand, registerConfigCommand } from './commands';

const program = new Command();

program
  .name('szmap')
  .description('Analyze codebases and visualize file metrics')
  .version(pkg.version, '-v, --version', 'output the current version')
  .helpOption('-h, --help', 'display help for command');

registerScanCommand(program);
registerConfigCommand(program);

program.parse();
