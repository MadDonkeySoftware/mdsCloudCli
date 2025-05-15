import {
  ENV_CONFIG_ELEMENTS,
  EnvConfig,
  EnvConfigElementMetadata,
} from './config.constants.ts';
import { Environment } from '../../shared/environment.ts';
import { ConfigRepo } from './config.repo.ts';

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

export class ConfigService {
  private static getDisplayValue(
    elemMetadata: EnvConfigElementMetadata,
    value: string | boolean,
  ) {
    return elemMetadata.promptType === 'confirm'
      ? elemMetadata.displayConverter(value as boolean)
      : elemMetadata.displayConverter(value as string);
  }

  static async getConfig(env?: string) {
    const workingEnv = env || (await Environment.getDefaultEnv());
    return ConfigRepo.getEnvConfig<EnvConfig>(workingEnv);
  }

  static async inspect(key: string, env?: string) {
    const configElementMap: Record<string, EnvConfigElementMetadata> = {};

    ENV_CONFIG_ELEMENTS.forEach((e) => {
      configElementMap[e.key] = e;
    });

    const configMeta = configElementMap[key];

    if (!configMeta && key !== 'all') {
      throw new ConfigurationError(`Invalid key: ${key}`);
    }

    const workingEnv = env || (await Environment.getDefaultEnv());
    const config = await ConfigRepo.getEnvConfig<EnvConfig>(workingEnv);

    if (!config) {
      throw new ConfigurationError(
        `No config found for environment: ${workingEnv}`,
      );
    }

    if (key === 'all') {
      const rows: string[][] = [];
      ENV_CONFIG_ELEMENTS
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .forEach((e) => {
          const value = config[e.key];
          if (value) {
            rows.push([
              e.display,
              ConfigService.getDisplayValue(e, value),
            ]);
          }
        });
      return rows;
    } else {
      const value = config[key];
      return value != null
        ? ConfigService.getDisplayValue(configMeta, value)
        : `It appears "${key}" is not present in the ${workingEnv} config.`;
    }
  }

  /**
   * @param env The environment to use for this operation
   * @param configUpdates An object containing the key/value pairs to update
   */
  static async update(
    { env, configUpdates }: { env?: string; configUpdates: Partial<EnvConfig> },
  ) {
    const configElementMap: Record<string, EnvConfigElementMetadata> = {};

    ENV_CONFIG_ELEMENTS.forEach((e) => {
      configElementMap[e.key] = e;
    });
    const configKeys = Object.keys(configElementMap);
    const updatedKeys = Object.keys(configUpdates);

    const invalidKeys = updatedKeys.filter((k) => !configKeys.includes(k));
    if (invalidKeys.length) {
      throw new ConfigurationError(
        `"${invalidKeys.join(', ')}" key(s) not understood. Expected: ${
          configKeys.join(', ')
        }`,
      );
    }

    const invalidValueSets = Object.entries(configUpdates).filter(([_k, v]) =>
      v === undefined || v === null || v === ''
    );
    if (invalidValueSets.length) {
      throw new ConfigurationError(
        `Value cannot be empty for key: ${
          invalidValueSets.map(([k, _v]) => k).join(', ')
        }`,
      );
    }

    const workingEnv = env || (await Environment.getDefaultEnv());
    const config = await ConfigRepo.getEnvConfig<EnvConfig>(workingEnv) || {};

    // Convert the value using the key-specific converter
    // and save the updated values along side the existing values
    const validValuePairs = Object.entries(configUpdates).filter(
      ([k, v]) =>
        configKeys.includes(k) && v !== undefined && v !== null && v !== '',
    ).map(([k, v]) => [
      k,
      configElementMap[k].saveConverter(v as string),
    ]);
    const updatedConfig = {
      ...config,
      ...Object.fromEntries(validValuePairs),
    };

    await ConfigRepo.saveEnvConfig(workingEnv, updatedConfig);
    return workingEnv;
  }
}
