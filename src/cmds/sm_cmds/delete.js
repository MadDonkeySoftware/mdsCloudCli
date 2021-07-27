const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const deleteStateMachine = (id) => {
  const client = mdsSdk.getStateMachineServiceClient();
  return client.deleteStateMachine(id);
};

const printResult = (machine) => {
  if (machine) {
    utils.display(`State machine ${machine.orid} successfully deleted.`);
  } else {
    utils.display('An error occurred while deleting the state machine.');
  }
};

const handle = (id, env) =>
  deleteStateMachine(id, env).then((response) => printResult(response));

exports.command = 'delete <id>';
exports.desc = 'Deletes the specified state machine';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.id);
