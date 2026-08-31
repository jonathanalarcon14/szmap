import { readFileSync } from 'fs';
import { parse } from 'jsonc-parser';
import * as v from 'valibot';
import {
  getOrCreateConfigPath,
  defaultConfig,
  ConfigSchema,
  type RawConfig,
  type ResolvedConfig,
  ANSI_COLORS,
} from './core';

export function loadConfig(): ResolvedConfig {
  const configPath = getOrCreateConfigPath();
  const raw = readFileSync(configPath, 'utf-8');
  const parsed: unknown = parse(raw);

  const result = v.safeParse(ConfigSchema, parsed);

  let rawConfig: RawConfig;

  if (result.success) {
    rawConfig = result.output;
  } else {
    console.warn(
      `${ANSI_COLORS.brightYellow}szmap config is invalid, using defaults for this run.\nRun 'szmap config --reset' to restore defaults.${ANSI_COLORS.reset}`,
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
