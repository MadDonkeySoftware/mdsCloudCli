const utils = require('../../../lib/utils');

const handle = (key, env) => {
  if (!utils.CONFIG_KEYS.includes(key)) {
    return Promise.resolve(utils.display(`"${key}" key not understood. Expected: ${utils.CONFIG_KEYS.join(', ')}`));
  }

  return utils.getEnvConfig(env)
    .then((settings) => utils.display(settings[key] || `It appears "${key}" is not present in the ${env} config.`));
};

exports.command = 'inspect <key>';
exports.desc = `Inspects a config detail. Valid keys: ${utils.CONFIG_KEYS.join(', ')}`;
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.key, argv.env);
