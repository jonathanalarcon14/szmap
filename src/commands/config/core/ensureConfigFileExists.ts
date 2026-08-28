import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { getConfigPath } from './envPath';
import { defaultConfigTemplate } from './defaultConfig';

export function ensureConfigFileExists(): void {
  const configPath = getConfigPath();
  if (!existsSync(configPath)) {
    mkdirSync(dirname(configPath), { recursive: true });
    writeFileSync(configPath, defaultConfigTemplate);
  }
}
