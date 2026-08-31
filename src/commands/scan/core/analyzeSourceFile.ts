import type { Node, Program } from 'oxc-parser';
import type { FileMetrics } from './FileMetrics';

const FUNCTION_TYPES = new Set([
  'FunctionDeclaration',
  'ArrowFunctionExpression',
  'FunctionExpression',
]);

export function analyzeSourceFile(program: Program): FileMetrics {
  let functions = 0;
  let classes = 0;
  let methods = 0;
  let interfaces = 0;

  function visit(node: Node, parentType: string | null): void {
    switch (node.type) {
      case 'ClassDeclaration':
        classes++;
        break;
      case 'MethodDefinition':
        methods++;
        break;
      case 'TSInterfaceDeclaration':
        interfaces++;
        break;
      default:
        if (
          FUNCTION_TYPES.has(node.type) &&
          parentType !== 'MethodDefinition'
        ) {
          functions++;
        }
    }
    for (const key in node) {
      const child = (node as unknown as Record<string, unknown>)[key];
      if (!child) continue;
      if (Array.isArray(child)) {
        for (const item of child) {
          if (item && typeof item === 'object' && 'type' in item) {
            visit(item as Node, node.type);
          }
        }
      } else if (typeof child === 'object' && 'type' in child) {
        visit(child as Node, node.type);
      }
    }
  }

  visit(program, null);
  return { functions, classes, methods, interfaces };
}
