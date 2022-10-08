import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import prompts, { PromptObject } from 'prompts';
import { RegisterUser } from '../lib/register-user';
import {
  CONFIG_ELEMENTS,
  display,
  extendBaseCommandBuilder,
  listEnvs,
  saveEnvConfig,
  setDefaultEnv,
} from '../utils';
import { filter, sortBy } from 'lodash';

const removeTrailingSlash = (state) =>
  typeof state.value === 'string' && state.value.endsWith('/')
    ? state.value.substr(0, state.value.length - 1)
    : state.value;

const getPrompt = (element) =>
  element.isUrl
    ? `Enter url for the ${element.display}`
    : `Enter your ${element.display}`;

const getEnvUrls = () => {
  const configElements = sortBy(
    filter(CONFIG_ELEMENTS, (e) => e.isUrl && e.key !== 'identityUrl'),
    'displayOrder',
  );
  const query = configElements.map(
    (e) =>
      ({
        name: e.key,
        message: getPrompt(e),
        type: e.promptType,
        onState: removeTrailingSlash,
      } as PromptObject),
  );

  return prompts(query);
};

const isEnvAlreadyConfigured = () =>
  listEnvs()
    .then((envs) => envs.length > 0)
    .catch(() => false);

const configureIdentity = () => {
  const questions = [
    {
      name: 'identityUrl',
      message: 'Please enter the identity url for your system.',
      type: 'text',
      onState: removeTrailingSlash,
    } as PromptObject,
    {
      name: 'allowSelfSignCert',
      message: 'Allow self signed certificates?',
      type: 'confirm',
    } as PromptObject,
  ];

  return prompts(questions)
    .then((answers) => {
      MdsSdk.initialize({
        identityUrl: answers.identityUrl,
        allowSelfSignCert: answers.allowSelfSignCert,
      });
      return [MdsSdk.getIdentityServiceClient(), answers];
    })
    .then(([client, answers]) => {
      return client.getPublicSignature().then(() => answers.identityUrl);
    })
    .catch((err) => {
      display(
        'It appears that the url entered is incorrect or not responsive.',
      );
      throw err;
    });
};

const handle = async (argv) => {
  try {
    const isConfigured = await isEnvAlreadyConfigured();
    if (isConfigured) {
      display(
        'Environment appears to already be configured. Use the config and/or env sub-command instead.',
      );
    } else {
      const identityUrl = await configureIdentity();
      const registrationAnswers = await RegisterUser();
      const envUrls = await getEnvUrls();
      await saveEnvConfig(argv.env, {
        account: registrationAnswers.accountId,
        userId: registrationAnswers.userId,
        password: registrationAnswers.password,
        identityUrl,
        ...envUrls,
      });
      await setDefaultEnv(argv.env);
      display(
        'Congratulations! You are now ready to start using this MDS Cloud install!',
      );
    }
  } catch (err) {
    display(
      'An error occurred running setup. Please clear the errors and try again.',
    );
    display('If the problem persists reach out to your support personnel.');
  }
};

interface Params {
  env: string;
}

export const command = 'setup';
export const describe = 'Collects initial setup information';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
