/* eslint-disable no-param-reassign */
const os = require('os');

const utils = require('../../lib/utils');

const handler = (argv) => {
  // argv._ is list of commands
  if (argv._[0] === 'env') {
    return Promise.resolve();
  }

  argv.env = argv.env || 'default';
  return Promise.resolve(utils.display(`Current environment: ${argv.env}${os.EOL}`));
};

module.exports = handler;
