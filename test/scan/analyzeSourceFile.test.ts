import { parseSync, type Program } from 'oxc-parser';
import { analyzeSourceFile } from '../../src/commands/scan/core/analyzeSourceFile';

function parse(code: string): Program {
  return parseSync('test.ts', code).program;
}

describe('analyzeSourceFile', () => {
  it('counts a declared function', () => {
    const result = analyzeSourceFile(parse(`function foo() {};`));
    expect(result).toEqual({
      functions: 1,
      classes: 0,
      methods: 0,
      interfaces: 0,
    });
  });

  it('counts an arrow function', () => {
    const result = analyzeSourceFile(parse(`const foo = (() => {});`));
    expect(result).toEqual({
      functions: 1,
      classes: 0,
      methods: 0,
      interfaces: 0,
    });
  });

  it('counts multiple functions correctly', () => {
    const result = analyzeSourceFile(
      parse(
        `
      const foo = (() => {});
      function foo2() {};
      const foo3 = (() => {});
      function foo4() {};
      `,
      ),
    );
    expect(result).toEqual({
      functions: 4,
      classes: 0,
      methods: 0,
      interfaces: 0,
    });
  });

  it('counts a class', () => {
    const result = analyzeSourceFile(
      parse(
        `
      class Cat {};
      `,
      ),
    );
    expect(result).toEqual({
      functions: 0,
      classes: 1,
      methods: 0,
      interfaces: 0,
    });
  });

  it('counts methods inside a class', () => {
    const result = analyzeSourceFile(
      parse(
        `
      class Cat {

        foo() {};
        foo2() {};
        foo3() {};

      };
      `,
      ),
    );
    expect(result).toEqual({
      functions: 0,
      classes: 1,
      methods: 3,
      interfaces: 0,
    });
  });

  it('counts an interface', () => {
    const result = analyzeSourceFile(
      parse(
        `
      interface Pet {

        foo(): void;
        foo2(): void;
        foo3(): void;

      };
      `,
      ),
    );
    expect(result).toEqual({
      functions: 0,
      classes: 0,
      methods: 0,
      interfaces: 1,
    });
  });

  it('counts a mix of functions, classes, and interfaces in the same file', () => {
    const result = analyzeSourceFile(
      parse(
        `
      const a = (() => {});
      function b() {};
      const c = (() => {});
      function d() {};


      class Pet {};


      class Cat {

        foo() {};
        foo2() {};
        foo3() {};

      };



      interface Abcd {

        foo(): void;
        foo2(): void;
        foo3(): void;

      };
      `,
      ),
    );
    expect(result).toEqual({
      functions: 4,
      classes: 2,
      methods: 3,
      interfaces: 1,
    });
  });

  it('returns all zeros for an empty file', () => {
    const result = analyzeSourceFile(parse(``));
    expect(result).toEqual({
      functions: 0,
      classes: 0,
      methods: 0,
      interfaces: 0,
    });
  });
});
