import { readFile } from 'fs/promises';
import { parseSync, type ParserOptions, type Program } from 'oxc-parser';

const PARSE_OPTIONS = { experimentalRawTransfer: true } as ParserOptions;

export interface ParsedFile {
  program: Program;
  lines: number;
}

export async function parseFile(file: string): Promise<ParsedFile> {
  const content = await readFile(file, 'utf-8');
  const { program } = parseSync(file, content, PARSE_OPTIONS);
  return { program, lines: content.split('\n').length };
}
