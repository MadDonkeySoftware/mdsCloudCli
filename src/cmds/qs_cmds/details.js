const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const getQueueDetails = (name) => {
  const client = mdsSdk.getQueueServiceClient();
  return client.getQueueDetails(name);
};

const printResult = (metadata) => {
  if (metadata) {
    utils.display(`${JSON.stringify(metadata, null, 2)}`);
  } else {
    utils.display('An error occurred while requesting the queue metadata.');
  }
};

const handle = (queue, env) =>
  getQueueDetails(queue, env).then((metadata) => printResult(metadata));

exports.command = 'details <queue>';
exports.desc = 'Get the details of the <queue> queue';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.queue, argv.env);
