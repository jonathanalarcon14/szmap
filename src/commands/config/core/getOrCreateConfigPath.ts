import { ensureConfigFileExists } from './ensureConfigFileExists';
import { getConfigPath } from './envPath';

export function getOrCreateConfigPath(): string {
  ensureConfigFileExists();
  return getConfigPath();
}
