/* eslint-disable no-param-reassign */
import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { getEnvConfig } from '../utils';

export async function mdsSdkInitMiddleware(argv) {
  // argv._ is list of commands
  if (argv._[0] === 'env' || argv._[0] === 'config' || argv._[0] === 'setup') {
    return undefined;
  }

  const env = argv.env || 'default';
  const conf = await getEnvConfig(env);
  await MdsSdk.initialize(conf);
  return undefined;
}
