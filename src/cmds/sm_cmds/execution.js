const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');
const utils = require('../../../lib/utils');

const getDetails = ({ id, env }) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({ smUrl: conf.smUrl });
    const client = mdsSdk.getStateMachineServiceClient();
    return client.getDetailsForExecution(id);
  });

const operationSorter = (a, b) => new Date(a.created) - new Date(b.created);

const handleOutput = (details) => {
  const { operations } = details;
  const orderedOperations = operations.sort(operationSorter);
  utils.display(utils.stringifyForDisplay({ ...details, operations: orderedOperations }));

  return Promise.resolve();
};

const handle = (argv) => getDetails(argv)
  .then((details) => handleOutput(details, argv))
  .catch((err) => utils.display(`An error occurred while getting the execution details. ${err.message}`));

exports.command = 'execution <id>';
exports.desc = 'Gets the details of an execution.';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv);
