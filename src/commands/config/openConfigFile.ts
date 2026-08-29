import { spawnSync } from 'child_process';
import { getOrCreateConfigPath } from './core';
import { ANSI_COLORS } from '@config';

export function openConfigFile(): void {
  const configPath = getOrCreateConfigPath();
  const editor = process.env.EDITOR || process.env.VISUAL || 'nano';

  console.log(
    `${ANSI_COLORS.green}Opening ${configPath} in ${editor}...${ANSI_COLORS.reset}`,
  );
  const result = spawnSync(editor, [configPath], { stdio: 'inherit' });
  if (result.error) {
    console.error(
      `${ANSI_COLORS.red}Could not open editor "${editor}".${ANSI_COLORS.reset}`,
    );
    process.exitCode = 1;
  }
}
