const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const enqueueMessage = ({ queue, message }) => {
  const client = mdsSdk.getQueueServiceClient();
  return client.enqueueMessage(queue, message);
};

const handle = (argv) =>
  enqueueMessage(argv)
    .then(() => utils.display('Message queued successfully.'))
    .catch((err) =>
      utils.display(`An error occurred while enqueueing the message. ${err}`),
    );

exports.command = 'enqueueMessage <queue> <message>';
exports.desc = '';
exports.builder = utils.extendBaseCommandBuilder({});
exports.handler = (argv) => handle(argv);
