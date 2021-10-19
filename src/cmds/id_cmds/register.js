const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');
const VError = require('verror');
const utils = require('../../../lib/utils');
const registerUser = require('../../../lib/register-user');

const ensureCanRun = async () => {
  const client = await mdsSdk.getIdentityServiceClient();
  return client.getPublicSignature().then((data) => !!data);
};

const handleResponse = (resp) => {
  utils.display(
    `Registration successful! Your account ID is: ${resp.accountId}`,
  );
};

const handle = () =>
  ensureCanRun()
    .then(registerUser.run)
    .then(handleResponse)
    .catch((err) =>
      utils.display(
        `An error occurred while registering: ${
          err.message
        }.${utils.stringifyForDisplay(VError.info(err))}`,
      ),
    );

exports.command = 'register';
exports.desc = 'Collects and writes all config details.';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.env);
