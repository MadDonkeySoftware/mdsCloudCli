const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const getQueues = (env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({
      account: conf.account,
      userId: conf.userId,
      password: conf.password,
      identityUrl: conf.identityUrl,
      qsUrl: conf.qsUrl,
    });
    const client = mdsSdk.getQueueServiceClient();
    return client.listQueues();
  });

const printResult = (queues) => {
  if (queues) {
    const headers = ['Name', 'ORID'];
    const rows = [];
    queues.forEach((q) => {
      rows.push([q.name, q.orid]);
    });
    utils.displayTable(rows, headers);
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
