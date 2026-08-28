import envPaths from 'env-paths';
import { join } from 'path';

const paths = envPaths('szmap', { suffix: '' });

export function getConfigPath(): string {
  return join(paths.config, 'config.json');
}
