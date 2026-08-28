import { Command } from 'commander';
import { openConfigFile } from './openConfigFile';

export { loadConfig } from './loadConfig';
export { type ResolvedConfig } from './core/ConfigTypes';

export function registerConfigCommand(program: Command) {
  program
    .command('config')
    .aliases(['c', 'cfg'])
    .description('')
    .action(() => {
      openConfigFile();
    });
}
