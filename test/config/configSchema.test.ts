import { ConfigSchema } from '../../src/commands/config/core/ConfigTypes';

describe('ConfigSchema', () => {
  it('accepts a valid config', () => {
    const config = {
      colors: {
        folder: 'blue',
        metrics: 'gray',
      },
      scan: {
        include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        ignore: ['**/node_modules/**'],
      },
    };

    const result = ConfigSchema.safeParse(config);
    expect(result.success).toBe(true);
  });

  it('rejects an invalid color name', () => {
    const config = {
      colors: {
        folder: 'purple',
        metrics: 'gray',
      },
      scan: {
        include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        ignore: ['**/node_modules/**'],
      },
    };

    const result = ConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('rejects a config missing required fields', () => {
    const config = {
      colors: {
        folder: 'blue',
        metrics: 'gray',
      },
    };

    const result = ConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });

  it('rejects scan.include with non-string values', () => {
    const config = {
      colors: {
        folder: 'blue',
        metrics: 'gray',
      },
      scan: {
        include: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', 234],
        ignore: ['**/node_modules/**'],
      },
    };

    const result = ConfigSchema.safeParse(config);
    expect(result.success).toBe(false);
  });
});
