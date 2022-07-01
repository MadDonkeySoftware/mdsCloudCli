import { assign } from 'lodash';
import { BuilderCallback } from 'yargs';
import { getDefaultEnv } from './get-default-env';

export function extendBaseCommandBuilder<
  T = Record<string, unknown>,
  R = Record<string, unknown>,
>(options?): BuilderCallback<T, R> {
  const base = {
    env: {
      default: getDefaultEnv(),
      desc: 'The environment to write this value to',
    },
  };

  return assign({}, base, options);
}
