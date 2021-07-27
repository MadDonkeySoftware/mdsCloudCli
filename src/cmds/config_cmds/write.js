const _ = require('lodash');
const utils = require('../../../lib/utils');

const handle = (key, value, env) => {
  const configKeys = _.map(utils.CONFIG_ELEMENTS, 'key');
  if (!configKeys.includes(key)) {
    return Promise.resolve(
      utils.display(
        `"${key}" key not understood. Expected: ${configKeys.join(', ')}`
      )
    );
  }

  const newSettings = {};
  newSettings[key] = value;

  return utils.saveEnvConfig(env, newSettings);
};

exports.command = 'write <key> <value>';
exports.desc = `Writes a config detail. Valid keys: ${_.map(
  utils.CONFIG_ELEMENTS,
  'key'
).join(', ')}`;
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.key, argv.value, argv.env);
