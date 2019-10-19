const utils = require('../../../lib/utils');

const handle = (key, value, env) => {
  if (!utils.CONFIG_KEYS.includes(key)) {
    return Promise.resolve(utils.display(`"${key}" key not understood. Expected: ${utils.CONFIG_KEYS.join(', ')}`));
  }

  const newSettings = {};
  newSettings[key] = value;

  return utils.saveEnvConfig(env, newSettings);
};

exports.command = 'write <key> <value>';
exports.desc = `Writes a config detail. Valid keys: ${utils.CONFIG_KEYS.join(', ')}`;
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.key, argv.value, argv.env);
