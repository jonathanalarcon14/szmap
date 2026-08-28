import { writeFileSync } from 'fs';
import {
  getConfigPath,
  defaultConfigTemplate,
  ensureConfigFileExists,
} from './core';

export function resetConfig(): void {
  ensureConfigFileExists();
  const configPath = getConfigPath();
  writeFileSync(configPath, defaultConfigTemplate);
}
