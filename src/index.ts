#!/usr/bin/env node
import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { registerScanCommand, registerConfigCommand } from './commands';
import { loadConfig } from '@config';

const program = new Command();

program
  .name('szmap')
  .description('Analyze codebases and visualize file metrics as a tree')
  .version(pkg.version);

const config = loadConfig();

registerScanCommand(program, config);
registerConfigCommand(program);

program.parse();
