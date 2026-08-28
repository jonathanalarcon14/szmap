export { loadConfig } from './loadConfig';
export { type ResolvedConfig } from './core';
import { Command } from 'commander';
import { openConfigFile } from './openConfigFile';
import { resetConfig } from './resetConfig';

export function registerConfigCommand(program: Command) {
  program
    .command('config')
    .aliases(['c', 'cfg'])
    .description('')
    .option('-r, --reset', '')
    .action((options: { reset?: boolean }) => {
      if (options.reset) {
        resetConfig();
        return;
      }
      openConfigFile();
    });
}
