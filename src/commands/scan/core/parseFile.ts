import { readFile } from 'fs/promises';
import * as ts from 'typescript';

export interface ParsedFile {
  sourceFile: ts.SourceFile;
  lines: number;
}

export async function parseFile(file: string): Promise<ParsedFile> {
  const content = await readFile(file, 'utf-8');
  const sourceFile = ts.createSourceFile(
    file,
    content,
    ts.ScriptTarget.Latest,
    true,
  );
  return { sourceFile, lines: content.split('\n').length };
}
