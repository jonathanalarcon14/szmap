import { writeFileSync } from 'fs';
import { getOrCreateConfigPath, defaultConfigTemplate } from './core';

export function resetConfig(): void {
  const configPath = getOrCreateConfigPath();
  writeFileSync(configPath, defaultConfigTemplate);
}
