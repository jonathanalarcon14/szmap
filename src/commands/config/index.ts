export { loadConfig } from './loadConfig';
export { type ResolvedConfig, ANSI_COLORS } from './core';
import { Command } from 'commander';
import { openConfigFile } from './openConfigFile';
import { resetConfig } from './resetConfig';
import { ANSI_COLORS } from './core';

export function registerConfigCommand(program: Command) {
  program
    .command('config')
    .aliases(['c', 'cfg'])
    .description('open the szmap configuration file in your editor')
    .option('-r, --reset', 'restore configuration to default values')
    .action((options: { reset?: boolean }) => {
      if (options.reset) {
        resetConfig();
        console.log(
          `${ANSI_COLORS.green}Configuration restored to defaults.${ANSI_COLORS.reset}`,
        );
        return;
      }
      openConfigFile();
    });
}
