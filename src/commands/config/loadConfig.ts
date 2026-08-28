import { readFileSync } from 'fs';
import { parse } from 'jsonc-parser';
import {
  ensureConfigFileExists,
  getConfigPath,
  defaultConfig,
  ConfigSchema,
  type RawConfig,
  type ResolvedConfig,
  ANSI_COLORS,
} from './core';

export function loadConfig(): ResolvedConfig {
  ensureConfigFileExists();

  const configPath = getConfigPath();
  const raw = readFileSync(configPath, 'utf-8');
  const parsed: unknown = parse(raw);

  const result = ConfigSchema.safeParse(parsed);

  let rawConfig: RawConfig;

  if (result.success) {
    rawConfig = result.data;
  } else {
    console.warn(
      `${ANSI_COLORS.brightYellow}szmap config is invalid, using defaults for this run.${ANSI_COLORS.reset}`,
    );
    rawConfig = defaultConfig;
  }

  return {
    colors: {
      folder: ANSI_COLORS[rawConfig.colors.folder],
      metrics: ANSI_COLORS[rawConfig.colors.metrics],
      reset: ANSI_COLORS['reset'],
    },
    scan: rawConfig.scan,
  };
}
