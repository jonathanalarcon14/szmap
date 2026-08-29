import { ConfigSchema } from '../../src/commands/config/core/ConfigTypes';

describe('ConfigSchema', () => {
  // Un objeto que cumple exactamente la forma esperada:
  // colores válidos (dentro de la lista permitida) y scan con arrays de strings.
  // safeParse debería tener éxito (result.success === true).
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

  // Un color que no existe en la lista de nombres válidos (ej: 'purple').
  // El schema debería rechazarlo (result.success === false).
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

  // Un objeto al que le falta una propiedad requerida (ej: sin 'scan').
  // zod debería rechazar la validación por estructura incompleta.
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

  // El array 'include' contiene un valor que no es string (ej: un número).
  // zod debería rechazarlo porque z.array(z.string()) exige strings.
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
