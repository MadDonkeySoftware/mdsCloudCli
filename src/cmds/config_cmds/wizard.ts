import { sortBy } from 'lodash';
import prompts, { PromptObject } from 'prompts';
import { ArgumentsCamelCase } from 'yargs';
import {
  CONFIG_ELEMENTS,
  display,
  extendBaseCommandBuilder,
  getEnvConfig,
  saveEnvConfig,
} from '../../utils';

const getPrompt = (element) =>
  element.isUrl
    ? `Enter url for the ${element.display}`
    : `Enter your ${element.display}`;

const handle = async (env) => {
  const removeTrailingSlash = (state) =>
    typeof state.value === 'string' && state.value.endsWith('/')
      ? state.value.substr(0, state.value.length - 1)
      : state.value;

  const oldConfig = await getEnvConfig(env);

  // NOTE: In a future update change the wizard to collect the identity url and allow self sign
  // information before continuing with the configuration. The URLs supplied by the config service
  // could be used as default values for a new configuration. Also, the wizard could be expanded to
  // include account registration if the CLI user is creating a new mdsCloud account and mdsCloud
  // user.
  // const mdsSdkUtils = require('@maddonkeysoftware/mds-cloud-sdk-node/src/lib/utils');
  // const foo = mdsSdkUtils.getConfigurationUrls('identityUrl', allowSelfCert));

  const configElements = sortBy(CONFIG_ELEMENTS, 'displayOrder');
  const query = configElements.map(
    (e) =>
      ({
        name: e.key,
        message: getPrompt(e),
        type: e.promptType,
        initial: oldConfig ? oldConfig[e.key] : '',
        onState: removeTrailingSlash,
      } as PromptObject),
  );

  try {
    const results = await prompts(query);
    saveEnvConfig(env, results);
  } catch (err) {
    if (err.message !== 'canceled') {
      display(err.stack);
    }
  }
};

interface Params {
  env: string;
}

export const command = 'wizard';
export const describe = 'Collects and writes all config details';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv.env);
