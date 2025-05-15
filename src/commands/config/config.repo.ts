import { join } from '@std/path';
import { homedir } from 'node:os';
import { EnvConfig } from './config.constants.ts';

const settingDir = join(homedir(), '.mds');

export class ConfigRepo {
  static async ensureDirectory(path: string) {
    try {
      const stat = await Deno.lstat(path);
      if (!stat.isDirectory) {
        throw new Error(`Path exists but is not a directory: ${path}`);
      }
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
      }
      await Deno.mkdir(path, { recursive: true });
    }
  }

  static async getEnvConfig<T>(name: string): Promise<T | null> {
    const file = join(settingDir, `${name}.json`);

    try {
      await Deno.lstat(file);
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
      }
      return null;
    }

    const data = await Deno.readFile(file);
    try {
      return JSON.parse(new TextDecoder().decode(data)) as T;
    } catch (err) {
      throw new Error(`Failed to parse JSON from ${file}`, { cause: err });
    }
  }

  static async saveEnvConfig<T extends EnvConfig>(name: string, data: T) {
    const file = join(settingDir, `${name}.json`);
    await this.ensureDirectory(settingDir);
    await Deno.writeFile(
      file,
      new TextEncoder().encode(JSON.stringify(data, null, '\t')),
    );
  }
}
