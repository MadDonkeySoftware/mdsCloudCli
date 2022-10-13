import { isEqual } from 'lodash';
import { EnvironmentConfiguration } from '@maddonkeysoftware/mds-cloud-sdk-node/types';
/* eslint-disable no-param-reassign */
import { display, getEnvConfig } from '../utils';

const skipDisplayAccount = (argv) =>
  isEqual(['config', 'wizard'], argv._) || isEqual(['id', 'register'], argv._);

export async function environmentMiddleware(argv) {
  // argv._ is list of commands
  const skipSetupCommands = ['env', 'setup', 'encrypt', 'decrypt'];
  if (skipSetupCommands.indexOf(argv._[0]) !== -1) {
    return undefined;
  }

  argv.env = argv.env || 'default';
  const conf = await getEnvConfig<EnvironmentConfiguration>(argv.env);
  display(`Current environment: ${argv.env}`);
  if (!skipDisplayAccount(argv)) {
    display(`Current account: ${conf.account || 'N/A'}`);
  }
  display('');

  return undefined;
}
