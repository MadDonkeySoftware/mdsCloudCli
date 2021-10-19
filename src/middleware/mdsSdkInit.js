/* eslint-disable no-param-reassign */
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');
const utils = require('../../lib/utils');

const handler = async (argv) => {
  // argv._ is list of commands
  if (argv._[0] === 'env' || argv._[0] === 'config' || argv._[0] === 'setup') {
    return undefined;
  }

  const env = argv.env || 'default';
  const conf = await utils.getEnvConfig(env);
  await mdsSdk.initialize(conf);
  return undefined;
};

module.exports = handler;
