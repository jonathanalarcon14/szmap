import type { RawConfig } from './ConfigTypes';

export const defaultConfig: RawConfig = {
  colors: {
    folder: 'blue',
    metrics: 'gray',
  },
  scan: {
    include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    ignore: ['**/node_modules/**'],
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
    "ignore": ${JSON.stringify(defaultConfig.scan.ignore)}
  }
}
// Note: if this file becomes invalid, szmap will fall back to default settings
`;
