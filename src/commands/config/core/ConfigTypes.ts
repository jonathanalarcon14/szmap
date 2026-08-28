import { z } from 'zod';

const colorNames = [
  'black',
  'red',
  'green',
  'yellow',
  'blue',
  'magenta',
  'cyan',
  'white',
  'gray',
  'brightRed',
  'brightGreen',
  'brightYellow',
  'brightBlue',
  'brightMagenta',
  'brightCyan',
  'brightWhite',
] as const;

export const ANSI_COLORS: Record<
  (typeof colorNames)[number] | 'reset',
  string
> = {
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  reset: '\x1b[0m',
};

const ColorNameSchema = z.enum(colorNames);

export const ConfigSchema = z.object({
  colors: z.object({
    folder: ColorNameSchema,
    metrics: ColorNameSchema,
  }),
  scan: z.object({
    include: z.array(z.string()),
    ignore: z.array(z.string()),
  }),
});

export type RawConfig = z.infer<typeof ConfigSchema>;

export interface ResolvedConfig {
  colors: {
    folder: string;
    metrics: string;
    reset: string;
  };
  scan: {
    include: string[];
    ignore: string[];
  };
}
