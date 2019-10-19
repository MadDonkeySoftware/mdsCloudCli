const os = require('os');
const utils = require('../../../lib/utils');

const handle = () => utils.listEnvs()
  .then((envs) => envs.sort())
  .then((envs) => utils.display(envs.join(os.EOL)));

exports.command = 'list';
exports.desc = 'List all the available environments.';
exports.builder = {};
exports.handler = () => handle();
