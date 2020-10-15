const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const getFunction = (id) => {
  const client = mdsSdk.getServerlessFunctionsClient();
  return client.getFunctionDetails(id);
};

const printResult = (details) => {
  if (details) {
    utils.display(JSON.stringify(details, null, '  '));
  } else {
    utils.display('An error occurred while requesting the details of the function.');
  }
};

const handle = (id, env) => getFunction(id, env)
  .then((details) => printResult(details));

exports.command = 'details <id>';
exports.desc = 'Get the details for the specified state machine';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.id, argv.env);
