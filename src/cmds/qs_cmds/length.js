const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const getQueueLength = (name, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({ qsUrl: conf.qsUrl });
    const client = mdsSdk.getQueueServiceClient();
    return client.getQueueLength(name);
  });


const handle = (queue, env) => getQueueLength(queue, env)
  .then((metadata) => utils.display(`${metadata.size}`))
  .catch((err) => utils.display(`An error occurred while requesting the queue length. ${err}`));

exports.command = 'length <queue>';
exports.desc = 'Get the length of the <queue> queue';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.queue, argv.env);
