const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const createQueue = (name, resource, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({ qsUrl: conf.qsUrl });
    const client = mdsSdk.getQueueServiceClient();
    return client.createQueue(name, { resource });
  });

const handle = (queue, resource, env) => createQueue(queue, resource, env)
  .then(() => utils.display('Queue created successfully.'))
  .catch((err) => utils.display(`An error occurred while creating the queue. ${err.message}`));

exports.command = 'create <queue>';
exports.desc = 'Creates a new queue';
exports.builder = utils.extendBaseCommandBuilder({
  resource: {
    default: null,
    desc: 'resource to be invoked upon message being enqueued',
  },
});
exports.handler = (argv) => handle(argv.queue, argv.resource, argv.env);
