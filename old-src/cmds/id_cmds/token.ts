import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import VError from 'verror';
import {
  display,
  extendBaseCommandBuilder,
  stringifyForDisplay,
} from '../../utils';

const handle = async () => {
  try {
    const client = await MdsSdk.getIdentityServiceClient();
    const token = await client.authenticate({
      accountId: null,
      password: null,
      userId: null,
    });
    display(token);
  } catch (err) {
    display(
      `An error occurred while updating the user. Message: ${
        err.message
      }${stringifyForDisplay(VError.info(err))}`,
    );
  }
};

export const command = 'token';
export const describe = 'Updates various aspects of your users information';
export const builder = extendBaseCommandBuilder();
export const handler = () => handle();
