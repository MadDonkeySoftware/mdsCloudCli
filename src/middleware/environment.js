const _ = require('lodash');
/* eslint-disable no-param-reassign */
const utils = require('../../lib/utils');

const skipDisplayAccount = (argv) =>
  _.isEqual(['config', 'wizard'], argv._) ||
  _.isEqual(['id', 'register'], argv._);

const handler = async (argv) => {
  // argv._ is list of commands
  if (argv._[0] === 'env' || argv._[0] === 'setup') {
    return undefined;
  }

  argv.env = argv.env || 'default';
  const conf = await utils.getEnvConfig(argv.env);
  utils.display(`Current environment: ${argv.env}`);
  if (!skipDisplayAccount(argv)) {
    utils.display(`Current account: ${conf.account || 'N/A'}`);
  }
  utils.display('');

  return undefined;
};

module.exports = handler;
