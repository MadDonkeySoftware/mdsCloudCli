const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const updateQueue = ({ queue, resource }) => {
  const client = mdsSdk.getQueueServiceClient();
  return client.updateQueue(queue, { resource });
};

const handle = (argv) => updateQueue(argv)
  .then(() => utils.display('Queue updated successfully.'))
  .catch((err) => utils.display(`An error occurred while updating the queue. ${err}`));

exports.command = 'update <queue>';
exports.desc = 'Updates metadata around the <queue> queue.';
exports.builder = utils.extendBaseCommandBuilder({
  resource: {
    default: null,
    desc: 'resource to be invoked upon message being enqueued. Use the string "null" to delete the current value',
  },
});
exports.handler = (argv) => handle(argv);
