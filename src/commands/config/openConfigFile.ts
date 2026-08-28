import { spawn } from 'child_process';
import { getConfigPath, ensureConfigFileExists } from './core';

export function openConfigFile(): void {
  ensureConfigFileExists();
  const configPath = getConfigPath();
  const editor = process.env.EDITOR || process.env.VISUAL || 'nano';

  spawn(editor, [configPath], { stdio: 'inherit' });
}
