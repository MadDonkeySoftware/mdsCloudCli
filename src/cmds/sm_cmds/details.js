const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const getQueues = (id, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({
      account: conf.account,
      userId: conf.userId,
      password: conf.password,
      identityUrl: conf.identityUrl,
      smUrl: conf.smUrl,
    });
    const client = mdsSdk.getStateMachineServiceClient();
    return client.getStateMachine(id);
  });

const printResult = (machine) => {
  if (machine) {
    utils.display(JSON.stringify(machine, null, '  '));
  } else {
    utils.display('An error occurred while requesting the details of the state machine.');
  }
};

const handle = (id, env) => getQueues(id, env)
  .then((machine) => printResult(machine));

exports.command = 'details <id>';
exports.desc = 'Get the details for the specified state machine';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.id, argv.env);
