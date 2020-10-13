const _ = require('lodash');
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');
const prompts = require('prompts');

const collectInfo = () => {
  const questions = [
    {
      name: 'friendlyName',
      message: 'What should I call you',
      type: 'text',
    },
    {
      name: 'userId',
      message: 'Enter your desired user name',
      type: 'text',
    },
    {
      name: 'email',
      message: 'Enter your account recovery email address',
      type: 'text',
    },
    {
      name: 'password',
      message: 'Enter your desired password',
      type: 'password',
    },
    {
      name: 'password2',
      message: 'Confirm your desired password',
      type: 'password',
    },
    {
      name: 'accountName',
      message: 'Enter a friendly name for your account',
      type: 'text',
    },
  ];

  return prompts(questions);
};

const validateData = (answers) => {
  // TODO: see about using prompts validate hooks
  if (!answers.friendlyName) {
    throw new Error('Friendly name (What should I call you) appears to be blank.');
  }

  if (!answers.userId) {
    throw new Error('Authentication user name appears to be blank.');
  }

  if (!answers.email) {
    throw new Error('Recovery email address appears to be blank.');
  }

  if (!answers.password) {
    throw new Error('Password appears to be blank.');
  }

  if (answers.password !== answers.password2) {
    throw new Error('Passwords do not match');
  }

  if (!answers.accountName) {
    throw new Error('Account name appears to be blank.');
  }

  return answers;
};

const submitRegistration = (answers) => {
  const client = mdsSdk.getIdentityServiceClient();
  return client.register(answers)
    .then((resp) => _.merge({}, answers, resp));
};

const run = () => collectInfo()
  .then(validateData)
  .then(submitRegistration);

module.exports = {
  run,
};
