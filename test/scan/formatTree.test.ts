import { formatTree } from '../../src/commands/scan/output/printTree';
import { type FileScanResult } from '../../src/commands/scan/core';
import { type ResolvedConfig } from '../../src/commands/config/core';

const config: ResolvedConfig = {
  colors: { folder: '', metrics: '', reset: '' },
  scan: { include: [], ignore: [], poolThreshold: 300, chunkSize: 100 },
};

function result(
  file: string,
  overrides: Partial<FileScanResult> = {},
): FileScanResult {
  return {
    file,
    lines: 10,
    functions: 1,
    classes: 0,
    methods: 0,
    interfaces: 0,
    ...overrides,
  };
}

describe('formatTree', () => {
  it('returns only the root when there are no results', () => {
    const lines = formatTree([], '/aaa', config);

    expect(lines).toEqual(['aaa']);
  });

  it('formats a single file at the root with the └── connector', () => {
    const lines = formatTree([result('/aaa/index.ts')], '/aaa', config);

    expect(lines).toEqual([
      'aaa',
      '└── index.ts — 10 lines, 1 functions, 0 classes, 0 interfaces',
    ]);
  });

  it('uses ├── for non-last siblings and └── for the last one', () => {
    const lines = formatTree(
      [result('/aaa/a.ts'), result('/aaa/b.ts'), result('/aaa/c.ts')],
      '/aaa',
      config,
    );

    expect(lines).toEqual([
      'aaa',
      '├── a.ts — 10 lines, 1 functions, 0 classes, 0 interfaces',
      '├── b.ts — 10 lines, 1 functions, 0 classes, 0 interfaces',
      '└── c.ts — 10 lines, 1 functions, 0 classes, 0 interfaces',
    ]);
  });

  it('sorts folders before files at the same level', () => {
    const lines = formatTree(
      [result('/aaa/z.ts'), result('/aaa/bbb/index.ts')],
      '/aaa',
      config,
    );

    expect(lines).toEqual([
      'aaa',
      '├── bbb',
      '│   └── index.ts — 10 lines, 1 functions, 0 classes, 0 interfaces',
      '└── z.ts — 10 lines, 1 functions, 0 classes, 0 interfaces',
    ]);
  });

  it('propagates │ prefix through deeply nested folders', () => {
    const lines = formatTree(
      [result('/aaa/bbb/ccc/deep.ts'), result('/aaa/other.ts')],
      '/aaa',
      config,
    );

    expect(lines).toEqual([
      'aaa',
      '├── bbb',
      '│   └── ccc',
      '│       └── deep.ts — 10 lines, 1 functions, 0 classes, 0 interfaces',
      '└── other.ts — 10 lines, 1 functions, 0 classes, 0 interfaces',
    ]);
  });

  it('injects color codes from config around folder and metric segments', () => {
    const colored: ResolvedConfig = {
      colors: { folder: '<F>', metrics: '<M>', reset: '<R>' },
      scan: { include: [], ignore: [], poolThreshold: 300, chunkSize: 100 },
    };

    const lines = formatTree([result('/aaa/index.ts')], '/aaa', colored);

    expect(lines).toEqual([
      '<F>aaa<R>',
      '└── index.ts — <M>10 lines, 1 functions, 0 classes, 0 interfaces<R>',
    ]);
  });
});
