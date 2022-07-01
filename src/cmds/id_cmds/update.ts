import { ArgumentsCamelCase } from 'yargs';
import prompts, { PromptObject } from 'prompts';
import { VError } from 'verror';
import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { merge } from 'lodash';
import {
  display,
  extendBaseCommandBuilder,
  stringifyForDisplay,
} from '../../utils';

const getPasswords = (argv: ArgumentsCamelCase<Params>) => {
  if (argv.password) {
    const questions = [
      {
        name: 'oldPassword',
        message: 'Enter your current password',
        type: 'password',
      } as PromptObject,
      {
        name: 'password',
        message: 'Enter your desired password',
        type: 'password',
      } as PromptObject,
      {
        name: 'password2',
        message: 'Confirm your desired password',
        type: 'password',
      } as PromptObject,
    ];

    return prompts(questions).then((answers) => {
      if (answers.password !== answers.password2) {
        throw new Error('Passwords did not match.');
      }

      return merge({}, argv, { password: answers.password });
    });
  }
  return Promise.resolve(argv);
};

const updateIdentity = async (info) => {
  const client = await MdsSdk.getIdentityServiceClient();
  return client.updateUser({
    email: info.email,
    oldPassword: info.oldPassword,
    newPassword: info.password,
    friendlyName: info.name,
  });
};

const handle = (argv: ArgumentsCamelCase<Params>) =>
  getPasswords(argv)
    .then(updateIdentity)
    .then(() => display('User updated successfully.'))
    .catch((err) =>
      display(
        `An error occurred while updating the user. Message: ${
          err.message
        }${stringifyForDisplay(VError.info(err))}`,
      ),
    );

interface Params {
  password: boolean;
  email: string;
  name: string;
  env: string;
}

export const command = 'update';
export const describe = 'Updates various aspects of your users information';
export const builder = extendBaseCommandBuilder({
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
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
