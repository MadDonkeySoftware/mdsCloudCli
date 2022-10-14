import { find, map, sortBy } from 'lodash';
import { ArgumentsCamelCase } from 'yargs';
import {
  CONFIG_ELEMENTS,
  display,
  displayTable,
  extendBaseCommandBuilder,
  getEnvConfig,
} from '../../utils';

const handle = (key: string, env: string) => {
  if (key !== 'all' && !find(CONFIG_ELEMENTS, (e) => e.key === key)) {
    return Promise.resolve(
      display(
        `"${key}" key not understood. Expected: ${map(
          CONFIG_ELEMENTS,
          'key',
        ).join(', ')}`,
      ),
    );
  }

  return getEnvConfig(env).then((settings) => {
    if (key === 'all') {
      const rows = [];
      const configElements = sortBy(CONFIG_ELEMENTS, 'displayOrder');
      configElements.forEach((e) => {
        let value;
        if (e.key === 'password') {
          value = settings[e.key] ? '***' : '';
        } else {
          value = settings[e.key] || '';
        }
        rows.push([e.display, value]);
      });
      displayTable(rows, ['Setting', 'Value']);
    } else {
      display(
        settings[key] ||
          `It appears "${key}" is not present in the ${env} config.`,
      );
    }
  });
};

interface Params {
  key: string;
  env: string;
}

export const command = 'inspect <key>';
export const describe = `Inspects a config detail. Valid Keys: ${[
  ...map(CONFIG_ELEMENTS, 'key'),
  'all',
].join(', ')}`;
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) =>
  handle(argv.key, argv.env);
