import { buildTree } from '../../src/commands/scan/output/printTree';

describe('buildTree', () => {
  it('builds a tree with a single file at the root', () => {
    const results = [
      {
        file: '/core/index.ts',
        lines: 10,
        functions: 1,
        classes: 0,
        methods: 0,
        interfaces: 0,
      },
    ];
    const tree = buildTree(results, '/core');

    expect(tree.name).toBe('core');
    expect(tree.children.has('index.ts')).toBe(true);
    expect(tree.children.get('index.ts')?.data).toEqual(results[0]);
  });

  it('builds nested folder nodes for a deep file path', () => {
    const results = [
      {
        file: '/aaa/bbb/ccc/ddd/index.ts',
        lines: 10,
        functions: 1,
        classes: 0,
        methods: 0,
        interfaces: 0,
      },
    ];

    const tree = buildTree(results, '/aaa');

    expect(tree.name).toBe('aaa');

    const bbb = tree.children.get('bbb');
    expect(bbb).toBeDefined();

    const ccc = bbb?.children.get('ccc');
    expect(ccc).toBeDefined();

    const ddd = ccc?.children.get('ddd');
    expect(ddd).toBeDefined();

    const file = ddd?.children.get('index.ts');
    expect(file).toBeDefined();
    expect(file?.data).toEqual(results[0]);
  });

  it('reuses the same folder node for files in the same directory', () => {
    const results = [
      {
        file: '/aaa/bbb/index.ts',
        lines: 10,
        functions: 1,
        classes: 0,
        methods: 0,
        interfaces: 0,
      },
      {
        file: '/aaa/bbb/node.js',
        lines: 5,
        functions: 1,
        classes: 0,
        methods: 0,
        interfaces: 0,
      },
    ];

    const tree = buildTree(results, '/aaa');

    expect(tree.name).toBe('aaa');

    const bbb = tree.children.get('bbb');
    expect(bbb).toBeDefined();

    expect(bbb?.children.size).toEqual(2);

    const file1 = bbb?.children.get('index.ts');
    expect(file1).toBeDefined();
    expect(file1?.data).toEqual(results[0]);

    const file2 = bbb?.children.get('node.js');
    expect(file2).toBeDefined();
    expect(file2?.data).toEqual(results[1]);
  });

  it('handles files at different depths correctly', () => {
    const results = [
      {
        file: '/aaa/bbb/index.ts',
        lines: 10,
        functions: 1,
        classes: 0,
        methods: 0,
        interfaces: 0,
      },
      {
        file: '/aaa/bbb/ccc/node.js',
        lines: 5,
        functions: 1,
        classes: 0,
        methods: 0,
        interfaces: 0,
      },
    ];

    const tree = buildTree(results, '/aaa');

    expect(tree.name).toBe('aaa');

    const bbb = tree.children.get('bbb');
    expect(bbb).toBeDefined();

    expect(bbb?.children.size).toEqual(2);

    const file1 = bbb?.children.get('index.ts');
    expect(file1).toBeDefined();
    expect(file1?.data).toEqual(results[0]);

    const ccc = bbb?.children.get('ccc');
    expect(ccc).toBeDefined();

    const file2 = ccc?.children.get('node.js');
    expect(file2).toBeDefined();
    expect(file2?.data).toEqual(results[1]);
  });

  it('returns an empty tree when there are no results', () => {
    const results = [];

    const tree = buildTree(results, '/aaa');

    expect(tree.name).toBe('aaa');
    expect(tree.children.size).toEqual(0);
  });
});
