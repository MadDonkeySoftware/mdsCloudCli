const _ = require('lodash');
const prompts = require('prompts');
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../lib/utils');
const registerUser = require('../../lib/register-user');

const removeTrailingSlash = (state) => (typeof state.value === 'string' && state.value.endsWith('/')
  ? state.value.substr(0, state.value.length - 1)
  : state.value);

const getPrompt = (element) => (element.isUrl
  ? `Enter url for the ${element.display}`
  : `Enter your ${element.display}`);

const getEnvUrls = () => {
  const configElements = _.sortBy(
    _.filter(utils.CONFIG_ELEMENTS, (e) => e.isUrl && e.key !== 'identityUrl'),
    'displayOrder',
  );
  const query = configElements.map((e) => ({
    name: e.key,
    message: getPrompt(e),
    type: e.promptType,
    onState: removeTrailingSlash,
  }));

  return prompts(query);
};

const isEnvAlreadyConfigured = () => utils.listEnvs()
  .then((envs) => envs.length > 0)
  .catch(() => false);

const configureIdentity = () => {
  const questions = [
    {
      name: 'identityUrl',
      message: 'Please enter the identity url for your system.',
      type: 'text',
      onState: removeTrailingSlash,
    },
    {
      name: 'allowSelfSignCert',
      message: 'Allow self signed certificates?',
      type: 'confirm',
    },
  ];

  return prompts(questions)
    .then((answers) => {
      mdsSdk.initialize({
        identityUrl: answers.identityUrl,
        allowSelfSignCert: answers.allowSelfSignCert,
      });
      const client = mdsSdk.getIdentityServiceClient();
      return client.getPublicSignature()
        .then(() => answers.identityUrl);
    })
    .catch((err) => {
      utils.display('It appears that the url entered is incorrect or not responsive.');
      throw err;
    });
};

const handle = async (argv) => {
  try {
    const isConfigured = await isEnvAlreadyConfigured();
    if (isConfigured) {
      utils.display('Environment appears to already be configured. Use the config and/or env sub-command instead.');
    } else {
      const identityUrl = await configureIdentity();
      const registrationAnswers = await registerUser.run();
      const envUrls = await getEnvUrls();
      await utils.saveEnvConfig(argv.env, {
        account: registrationAnswers.accountId,
        userId: registrationAnswers.userId,
        password: registrationAnswers.password,
        identityUrl,
        ...envUrls,
      });
      await utils.setDefaultEnv(argv.env);
      utils.display('Congratulations! You are now ready to start using this MDS Cloud install!');
    }
  } catch (err) {
    utils.display('An error occurred running setup. Please clear the errors and try again.');
    utils.display('If the problem persists reach out to your support personnel.');
  }
};

exports.command = 'setup';
exports.desc = 'Collects initial setup information';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv);
