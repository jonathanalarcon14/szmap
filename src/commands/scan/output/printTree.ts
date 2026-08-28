import type { FileScanResult } from '../scanPath';
import { relative, basename } from 'path';

const FOLDER_COLOR = '\x1b[34m';
const METRIC_COLOR = '\x1b[90m';
const RESET = '\x1b[0m';

interface TreeNode {
  name: string;
  children: Map<string, TreeNode>;
  data?: FileScanResult;
}

export function printTree(
  results: FileScanResult[],
  absolutePath: string,
): void {
  const tree = buildTree(results, absolutePath);
  printNode(tree);
}

function printNode(
  node: TreeNode,
  prefix: string = '',
  isLast: boolean = true,
  isRoot: boolean = true,
): void {
  if (isRoot) {
    console.log(`${FOLDER_COLOR}${node.name}${RESET}`);
  } else {
    const connector = isLast ? '└── ' : '├── ';
    const label = node.data
      ? `${node.name} — ${METRIC_COLOR}${node.data.lines} lines, ${node.data.functions} functions, ${node.data.classes} classes, ${node.data.interfaces} interfaces${RESET}`
      : `${FOLDER_COLOR}${node.name}${RESET}`;
    console.log(prefix + connector + label);
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
    printNode(child, childPrefix, childIsLast, false);
  });
}

function buildTree(results: FileScanResult[], absolutePath: string): TreeNode {
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
