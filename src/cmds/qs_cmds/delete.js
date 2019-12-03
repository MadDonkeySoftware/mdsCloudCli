const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const deleteQueue = (name, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({ qsUrl: conf.qsUrl });
    const client = mdsSdk.getQueueServiceClient();
    return client.deleteQueue(name);
  });

const handle = (queue, env) => deleteQueue(queue, env)
  .then(() => utils.display('Queue removed successfully.'))
  .catch((err) => utils.display(`An error occurred while removing the queue. ${err.message}`));

exports.command = 'delete <queue>';
exports.desc = 'Removes a queue';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.queue, argv.env);
