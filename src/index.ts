#!/usr/bin/env node
import { Command } from 'commander';
import pkg from '../package.json' with { type: 'json' };
import { registerScanCommand, registerConfigCommand } from './commands';

const program = new Command();

program.name('szmap').description('').version(pkg.version);

registerScanCommand(program);
registerConfigCommand(program);

program.parse();
