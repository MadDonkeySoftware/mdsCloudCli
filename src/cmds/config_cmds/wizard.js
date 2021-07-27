const _ = require('lodash');
const prompts = require('prompts');
const utils = require('../../../lib/utils');

const getPrompt = (element) =>
  element.isUrl
    ? `Enter url for the ${element.display}`
    : `Enter your ${element.display}`;

const handle = (env) => {
  const removeTrailingSlash = (state) =>
    typeof state.value === 'string' && state.value.endsWith('/')
      ? state.value.substr(0, state.value.length - 1)
      : state.value;

  return utils.getEnvConfig(env).then((oldConfig) => {
    const configElements = _.sortBy(utils.CONFIG_ELEMENTS, 'displayOrder');
    const query = configElements.map((e) => ({
      name: e.key,
      message: getPrompt(e),
      type: e.promptType,
      initial: oldConfig ? oldConfig[e.key] : '',
      onState: removeTrailingSlash,
    }));

    prompts(query)
      .then((results) => {
        utils.saveEnvConfig(env, results);
      })
      .catch((err) => {
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
