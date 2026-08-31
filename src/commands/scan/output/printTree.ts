import type { FileScanResult } from '../core';
import { relative, basename } from 'path';
import type { ResolvedConfig } from '@config';

interface TreeNode {
  name: string;
  children: Map<string, TreeNode>;
  data?: FileScanResult;
}

export function printTree(
  results: FileScanResult[],
  absolutePath: string,
  config: ResolvedConfig,
): void {
  for (const line of formatTree(results, absolutePath, config)) {
    console.log(line);
  }
}

export function formatTree(
  results: FileScanResult[],
  absolutePath: string,
  config: ResolvedConfig,
): string[] {
  const tree = buildTree(results, absolutePath);
  const lines: string[] = [];
  formatNode(tree, config, lines);
  return lines;
}

function formatNode(
  node: TreeNode,
  config: ResolvedConfig,
  lines: string[],
  prefix: string = '',
  isLast: boolean = true,
  isRoot: boolean = true,
): void {
  if (isRoot) {
    lines.push(`${config.colors.folder}${node.name}${config.colors.reset}`);
  } else {
    const connector = isLast ? '└── ' : '├── ';
    const label = node.data
      ? `${node.name} — ${config.colors.metrics}${node.data.lines} lines, ${node.data.functions} functions, ${node.data.classes} classes, ${node.data.methods} methods, ${node.data.interfaces} interfaces${config.colors.reset}`
      : `${config.colors.folder}${node.name}${config.colors.reset}`;
    lines.push(prefix + connector + label);
  }

  const children = Array.from(node.children.values()).sort((a, b) => {
    const aIsFolder = !a.data;
    const bIsFolder = !b.data;

    if (aIsFolder && !bIsFolder) return -1;
    if (!aIsFolder && bIsFolder) return 1;
    return 0;
  });
  const childPrefix = isRoot ? '' : prefix + (isLast ? '    ' : '│   ');

  children.forEach((child, index) => {
    const childIsLast = index === children.length - 1;
    formatNode(child, config, lines, childPrefix, childIsLast, false);
  });
}

// Exported for testing only — not part of this module's public API (see index.ts)
export function buildTree(
  results: FileScanResult[],
  absolutePath: string,
): TreeNode {
  const root: TreeNode = { name: basename(absolutePath), children: new Map() };

  for (const result of results) {
    const relativePath = relative(absolutePath, result.file);
    const segments = relativePath.split('/').filter(Boolean);

    insertPath(root, segments, result);
  }
  return root;
}

function insertPath(
  root: TreeNode,
  segments: string[],
  data: FileScanResult,
): void {
  let currentNode = root;
  let isNewBranch = false;

  segments.forEach((segment, index) => {
    const isLast = index === segments.length - 1;
    const exists = !isNewBranch && currentNode.children.has(segment);

    if (!exists) {
      currentNode.children.set(segment, {
        name: segment,
        children: new Map(),
        data: isLast ? data : undefined,
      });
      isNewBranch = true;
    }

    currentNode = currentNode.children.get(segment)!;
  });
}
