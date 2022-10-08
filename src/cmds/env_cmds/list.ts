import { union } from 'lodash';
import { EOL } from 'os';
import { display, listEnvs } from '../../utils';

const handle = () =>
  listEnvs()
    .then((envs) => union(envs, ['default']))
    .then((envs) => envs.sort())
    .then((envs) => display(envs.join(EOL)));

export const command = 'list';
export const describe = 'List all the available environments.';
export const handler = handle;
