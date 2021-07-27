/* eslint-disable no-param-reassign */
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');
const utils = require('../../lib/utils');

const handler = (argv) => {
  // argv._ is list of commands
  if (argv._[0] === 'env' || argv._[0] === 'config' || argv._[0] === 'setup') {
    return Promise.resolve();
  }

  const env = argv.env || 'default';
  return utils.getEnvConfig(env).then((conf) => {
    mdsSdk.initialize(conf);
  });
};

module.exports = handler;
