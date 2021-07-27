const _ = require('lodash');
const utils = require('../../../lib/utils');

const handle = (env) =>
  utils
    .listEnvs()
    .then((envs) => _.union(envs, ['default']))
    .then((envs) => envs.indexOf(env) > -1)
    .then((exists) => (exists ? utils.setDefaultEnv(env) : Promise.reject()))
    .then(() => utils.display('Environment updated successfully.'))
    .catch(() =>
      utils.display(
        'Failed to update environment. Please verify your environment exists with the "list" command.'
      )
    );

exports.command = 'set <env>';
exports.desc = 'Set the default environment to execute against.';
exports.builder = {};
exports.handler = (argv) => handle(argv.env);
