const _ = require('lodash');
const prompts = require('prompts');
const utils = require('../../../lib/utils');

const getPrompt = (element) =>
  element.isUrl
    ? `Enter url for the ${element.display}`
    : `Enter your ${element.display}`;

const handle = async (env) => {
  const removeTrailingSlash = (state) =>
    typeof state.value === 'string' && state.value.endsWith('/')
      ? state.value.substr(0, state.value.length - 1)
      : state.value;

  const oldConfig = await utils.getEnvConfig(env);

  // NOTE: In a future update change the wizard to collect the identity url and allow self sign
  // information before continuing with the configuration. The URLs supplied by the config service
  // could be used as default values for a new configuration. Also, the wizard could be expanded to
  // include account registration if the CLI user is creating a new mdsCloud account and mdsCloud
  // user.
  // const mdsSdkUtils = require('@maddonkeysoftware/mds-cloud-sdk-node/src/lib/utils');
  // const foo = mdsSdkUtils.getConfigurationUrls('identityUrl', allowSelfCert));

  const configElements = _.sortBy(utils.CONFIG_ELEMENTS, 'displayOrder');
  const query = configElements.map((e) => ({
    name: e.key,
    message: getPrompt(e),
    type: e.promptType,
    initial: oldConfig ? oldConfig[e.key] : '',
    onState: removeTrailingSlash,
  }));

  try {
    const results = await prompts(query);
    utils.saveEnvConfig(env, results);
  } catch (err) {
    if (err.message !== 'canceled') {
      utils.display(err.stack);
    }
  }
};

exports.command = 'wizard';
exports.desc = 'Collects and writes all config details.';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.env);
