const _ = require('lodash');
const prompts = require('prompts');
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');
const VError = require('verror');

const utils = require('../../../lib/utils');

const getPasswords = (argv) => {
  if (argv.password) {
    const questions = [
      {
        name: 'oldPassword',
        message: 'Enter your current password',
        type: 'password',
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
    ];

    // return utils.getEnvConfig().then(console.dir).then(() => prompts(questions))
    return prompts(questions).then((answers) => {
      if (answers.password !== answers.password2) {
        throw new Error('Passwords did not match.');
      }

      return _.merge({}, argv, { password: answers.password });
    });
  }
  return Promise.resolve(argv);
};

const updateIdentity = (info) => {
  const client = mdsSdk.getIdentityServiceClient();
  return client.updateUser({
    email: info.email,
    oldPassword: info.oldPassword,
    newPassword: info.password,
    friendlyName: info.name,
  });
};

const handle = (argv) =>
  getPasswords(argv)
    .then(updateIdentity)
    .then(() => utils.display('User updated successfully.'))
    .catch((err) =>
      utils.display(
        `An error occurred while updating the user. Message: ${
          err.message
        }${utils.stringifyForDisplay(VError.info(err))}`,
      ),
    );

exports.command = 'update';
exports.desc = 'Updates various aspects of your users information';
exports.builder = utils.extendBaseCommandBuilder({
  password: {
    type: 'boolean',
    desc: 'Signals that a password update is requested',
  },
  email: {
    type: 'string',
    desc: 'The new email to associate with this user',
  },
  name: {
    type: 'string',
    desc: 'The new friendly name to associate with this user',
  },
});
exports.handler = (argv) => handle(argv);
