import { map } from 'lodash';
import { ArgumentsCamelCase } from 'yargs';
import {
  CONFIG_ELEMENTS,
  display,
  extendBaseCommandBuilder,
  saveEnvConfig,
} from '../../utils';

const handle = (key: string, value: string, env: string) => {
  const configKeys = map(CONFIG_ELEMENTS, 'key');
  if (!configKeys.includes(key)) {
    return Promise.resolve(
      display(
        `"${key}" key not understood. Expected: ${configKeys.join(', ')}`,
      ),
    );
  }

  const newSettings = {};
  newSettings[key] = value;

  return saveEnvConfig(env, newSettings);
};

interface Params {
  key: string;
  value: string;
  env: string;
}

export const command = 'write <key> <value>';
export const describe = `Writes a config detail. Valid keys: ${map(
  CONFIG_ELEMENTS,
  'key',
).join(', ')}`;
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) =>
  handle(argv.key, argv.value, argv.env);
