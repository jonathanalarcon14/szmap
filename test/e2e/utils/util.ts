export interface Greeter {
  greet(name: string): string;
}

export function add(a: number, b: number): number {
  return a + b;
}

export const multiply = (a: number, b: number): number => a * b;

export class Calculator implements Greeter {
  greet(name: string): string {
    return `hi ${name}`;
  }

  square(n: number): number {
    return n * n;
  }
}
