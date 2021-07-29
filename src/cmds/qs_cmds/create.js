const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const createQueue = ({ queue, resource, dlq }) => {
  const client = mdsSdk.getQueueServiceClient();
  return client.createQueue(queue, { resource, dlq });
};

const printResults = (results) => {
  utils.display(`Queue created successfully. ${results.orid}`);
};

const handle = ({ queue, resource, dlq }) =>
  createQueue({ queue, resource, dlq })
    .then((result) => printResults(result))
    .catch((err) =>
      utils.display(
        `An error occurred while creating the queue. ${err.message}`
      )
    );

exports.command = 'create <queue>';
exports.desc = 'Creates a new queue';
exports.builder = utils.extendBaseCommandBuilder({
  resource: {
    default: null,
    desc: 'resource to be invoked upon message being enqueued',
  },
  dlq: {
    default: null,
    desc: 'ORID of queue to place message in if resource invoke fails',
  },
});
exports.handler = (argv) => handle(argv);
