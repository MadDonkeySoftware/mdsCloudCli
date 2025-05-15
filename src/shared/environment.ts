import { join } from '@std/path';
import { homedir } from 'node:os';
import { type Cache, InMemoryCache } from './cache.ts';

const envFileName = 'selectedEnv';
const settingDir = join(homedir(), '.mds');

export class Environment {
  private static cache: Cache = new InMemoryCache();

  static resetCache() {
    this.cache.removeAll();
  }

  static async getDefaultEnv() {
    const cacheKey = 'getDefaultEnv';
    const cacheVal = this.cache.get(cacheKey);
    if (cacheVal) {
      return cacheVal as string;
    }

    const file = join(settingDir, envFileName);

    // Check if file exists asynchronously
    try {
      await Deno.lstat(file);
    } catch (err) {
      if (!(err instanceof Deno.errors.NotFound)) {
        throw err;
      }
      return 'default';
    }

    try {
      // Read file asynchronously
      const data = await Deno.readFile(file);
      if (data) {
        // Trim just in case the file was edited by the user.
        const trimmedData = new TextDecoder().decode(data).trim();
        this.cache.set(cacheKey, trimmedData);
        return trimmedData;
      }
    } catch (error) {
      // If any error occurs during file operations, return the default
      console.error('Error reading default environment:', error);
    }

    return 'default';
  }
}
