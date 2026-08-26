import * as ts from 'typescript';
import type { FileMetrics } from './FileMetrics';

export function analyzeSourceFile(sourceFile: ts.SourceFile): FileMetrics {
  let functions = 0;
  let classes = 0;
  let methods = 0;
  let interfaces = 0;

  function visit(node: ts.Node) {
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node)
    ) {
      functions++;
    }
    if (ts.isClassDeclaration(node)) {
      classes++;
    }
    if (ts.isMethodDeclaration(node)) {
      methods++;
    }
    if (ts.isInterfaceDeclaration(node)) {
      interfaces++;
    }
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return { functions, classes, methods, interfaces };
}
