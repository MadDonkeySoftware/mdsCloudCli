const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const getQueueLength = (names, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({
      account: conf.account,
      userId: conf.userId,
      password: conf.password,
      identityUrl: conf.identityUrl,
      qsUrl: conf.qsUrl,
    });
    const client = mdsSdk.getQueueServiceClient();
    return Promise.all(
      names.map((name) => client.getQueueLength(name)
        .then((rsp) => ({ name, size: rsp.size }))
        .catch((err) => ({ name, size: err.message }))),
    );
  });

const displayResults = (results) => {
  if (results.length > 1) {
    const headers = ['Queue', 'Size'];
    const rows = results.map((metadata) => [metadata.name, metadata.size]);
    utils.displayTable(rows, headers);
  } else {
    utils.display(`${results[0].size}`);
  }
};

const handle = (queues, env) => getQueueLength(queues, env)
  // .then((results) => { console.dir(results); return results; })
  .then((results) => displayResults(results))
  .catch((err) => utils.display(`An error occurred while requesting the queue length. ${err}`));

exports.command = 'length <queues..>';
exports.desc = 'Get the length of the <queue> queue';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.queues, argv.env);
