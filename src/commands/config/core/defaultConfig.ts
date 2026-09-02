import type { RawConfig } from './ConfigTypes';

export const defaultConfig: RawConfig = {
  colors: {
    folder: 'blue',
    metrics: 'gray',
  },
  scan: {
    include: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.mts',
      '**/*.cts',
    ],
    ignore: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
    ],
    poolThreshold: 1000,
    chunkSize: 100,
  },
};

export const defaultConfigTemplate = `{
  // Colors used in the tree output.
  // Available names: black, red, green, yellow, blue, magenta, cyan, white, gray, brightRed, brightGreen, brightYellow, brightBlue, brightMagenta, brightCyan, brightWhite
  "colors": {
    "folder": "${defaultConfig.colors.folder}",
    "metrics": "${defaultConfig.colors.metrics}"
  },
  // Which files to include or ignore when scanning (glob patterns).
  "scan": {
    "include": ${JSON.stringify(defaultConfig.scan.include)},
    "ignore": ${JSON.stringify(defaultConfig.scan.ignore)},
    // Minimum number of files before spawning a worker pool. Lower on fast machines, higher on slow ones.
    "poolThreshold": ${defaultConfig.scan.poolThreshold},
    // How many files each worker processes per task. Larger = less overhead, smaller = better load balancing.
    "chunkSize": ${defaultConfig.scan.chunkSize}
  }
}
// Note: if this file becomes invalid, szmap will fall back to default settings
`;
