const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const getContainers = (env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({ fsUrl: conf.fsUrl });
    const client = mdsSdk.getFileServiceClient();
    return client.listContainers();
  });

const printResult = (containers) => {
  if (containers) {
    if (containers.length > 0) {
      containers.forEach((queue) => {
        utils.display(`${queue}`);
      });
    } else {
      utils.display('No containers found.');
    }
  } else {
    utils.display('An error occurred while requesting the list of containers.');
  }
};

const handle = (env) => getContainers(env)
  .then((containers) => containers.sort())
  .then((containers) => printResult(containers));

exports.command = 'containers';
exports.desc = 'Get the list of available containers';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.env);
