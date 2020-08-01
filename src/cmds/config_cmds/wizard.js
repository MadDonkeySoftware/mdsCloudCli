const _ = require('lodash');
const prompts = require('prompts');
const utils = require('../../../lib/utils');

const getPrompt = (key) => {
  switch (key) {
    case 'account':
      return 'Enter your account number';
    default:
      return `Enter url for the ${utils.CONFIG_KEY_DESCRIPTIONS[key]}`;
  }
};

const handle = (env) => {
  const removeTrailingSlash = (state) => (state.value.endsWith('/')
    ? state.value.substr(0, state.value.length - 1)
    : state.value);

  return utils.getEnvConfig(env).then((oldConfig) => {
    const configKeys = _.sortBy(utils.CONFIG_KEYS);
    const query = configKeys.map((key) => ({
      name: key,
      message: getPrompt(key),
      type: 'text',
      initial: oldConfig[key],
      onState: removeTrailingSlash,
    }));

    prompts(query).then((results) => {
      utils.saveEnvConfig(env, results);
    }).catch((err) => {
      if (err.message !== 'canceled') {
        utils.display(err.stack);
      }
    });
  });
};

exports.command = 'wizard';
exports.desc = 'Collects and writes all config details.';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.env);
