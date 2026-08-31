import { execFile } from 'child_process';
import { promisify } from 'util';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const exec = promisify(execFile);
const here = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(here, '..', '..', 'dist', 'index.js');
const FIXTURE = resolve(here, 'utils');

async function runCli(args: string[]) {
  try {
    const { stdout, stderr } = await exec('node', [CLI, ...args]);
    return { code: 0, stdout, stderr };
  } catch (err) {
    const e = err as { code: number; stdout: string; stderr: string };
    return { code: e.code, stdout: e.stdout, stderr: e.stderr };
  }
}

describe('szmap CLI (e2e)', () => {
  it('prints the version', async () => {
    const { code, stdout } = await runCli(['--version']);
    expect(code).toBe(0);
    expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('lists the scan command in --help', async () => {
    const { code, stdout } = await runCli(['--help']);
    expect(code).toBe(0);
    expect(stdout).toContain('scan');
  });

  it('reports missing paths with a non-zero exit code', async () => {
    const { code, stderr } = await runCli(['/definitely/not/a/real/path']);
    expect(code).not.toBe(0);
    expect(stderr + '').toMatch(/not found/i);
  });

  it('scans a fixture and reports file metrics', async () => {
    const { code, stdout } = await runCli([FIXTURE]);
    expect(code).toBe(0);
    expect(stdout).toContain('util.ts');
    expect(stdout).toContain('extra.ts');
    expect(stdout).toMatch(/2 file[s]? scanned/);
  });

  it('excludes files via the --ignore flag', async () => {
    const { code, stdout } = await runCli([FIXTURE, '--ignore', 'extra.ts']);
    expect(code).toBe(0);
    expect(stdout).toContain('util.ts');
    expect(stdout).not.toContain('extra.ts');
    expect(stdout).toMatch(/1 file[s]? scanned/);
  });

  it('reports accurate metrics when scanning a single file', async () => {
    const { code, stdout } = await runCli([resolve(FIXTURE, 'util.ts')]);
    expect(code).toBe(0);
    expect(stdout).toContain('util.ts');
    expect(stdout).toMatch(/2 functions/);
    expect(stdout).toMatch(/1 classes/);
    expect(stdout).toMatch(/2 methods/);
    expect(stdout).toMatch(/1 interfaces/);
    expect(stdout).toMatch(/1 file[s]? scanned/);
  });

  it('excludes files via inline !pattern positional args', async () => {
    const { code, stdout } = await runCli([FIXTURE, '!util.ts']);
    expect(code).toBe(0);
    expect(stdout).toContain('extra.ts');
    expect(stdout).not.toContain('util.ts');
    expect(stdout).toMatch(/1 file[s]? scanned/);
  });

  it('combines inline ! and --ignore into a single exclude list', async () => {
    const { code, stdout } = await runCli([
      FIXTURE,
      '!util.ts',
      '--ignore',
      'extra.ts',
    ]);
    expect(code).toBe(0);
    expect(stdout).toMatch(/No files matched/);
  });
});
