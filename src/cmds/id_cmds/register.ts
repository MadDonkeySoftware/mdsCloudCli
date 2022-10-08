import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { VError } from 'verror';
import {
  display,
  extendBaseCommandBuilder,
  stringifyForDisplay,
} from '../../utils';
import { RegisterUser } from '../../lib/register-user';

const ensureCanRun = async () => {
  const client = await MdsSdk.getIdentityServiceClient();
  return client.getPublicSignature().then((data) => !!data);
};

const handleResponse = (resp) => {
  display(`Registration successful! Your account ID is: ${resp.accountId}`);
};

const handle = () =>
  ensureCanRun()
    .then(RegisterUser)
    .then(handleResponse)
    .catch((err) =>
      display(
        `An error occurred while registering: ${
          err.message
        }.${stringifyForDisplay(VError.info(err))}`,
      ),
    );

export const command = 'register';
export const describe = 'Collects and writes all config details.';
export const builder = extendBaseCommandBuilder();
export const handler = () => handle();
