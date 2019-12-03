const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const getQueues = (env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({ qsUrl: conf.qsUrl });
    const client = mdsSdk.getQueueServiceClient();
    return client.listQueues();
  });

const printResult = (queues) => {
  if (queues) {
    queues.sort();
    queues.forEach((queue) => {
      utils.display(`${queue}`);
    });
  } else {
    utils.display('An error occurred while requesting the list of queues.');
  }
};

const handle = (env) => getQueues(env)
  .then((queues) => printResult(queues));

exports.command = 'list';
exports.desc = 'Get the list of available queues';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.env);
