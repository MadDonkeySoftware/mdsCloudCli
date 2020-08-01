/* eslint-disable no-param-reassign */
const utils = require('../../lib/utils');

const handler = (argv) => {
  // argv._ is list of commands
  if (argv._[0] === 'env') {
    return Promise.resolve();
  }

  argv.env = argv.env || 'default';

  utils.display(`Current environment: ${argv.env}`);
  if (!(argv._[0] === 'config' && argv._[1] === 'wizard')) {
    utils.display(`Current account: ${argv.account}`);
  }
  utils.display('');

  return Promise.resolve();
};

module.exports = handler;
