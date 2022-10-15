import { union } from 'lodash';
import { display, listEnvs, setDefaultEnv } from '../../utils';

const handle = (env) =>
  listEnvs()
    .then((envs) => union(envs, ['default']))
    .then((envs) => envs.indexOf(env) > -1)
    .then((exists) => (exists ? setDefaultEnv(env) : Promise.reject()))
    .then(() => display('Environment updated successfully.'))
    .catch(() =>
      display(
        'Failed to update environment. Please verify your environment exists with the "list" command.',
      ),
    );

export const command = 'set <env>';
export const desc = 'Set the default environment to execute against.';
export const handler = (argv) => handle(argv.env);
