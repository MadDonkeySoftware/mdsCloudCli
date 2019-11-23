const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const getContainerContents = (containerOrPath, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({ fsUrl: conf.fsUrl });
    const client = mdsSdk.getFileServiceClient();
    return client.getContainerContents(containerOrPath);
  });

const printResult = (metadata) => {
  if (metadata) {
    utils.display(`${JSON.stringify(metadata, null, 2)}`);
  } else {
    utils.display('An error occurred while requesting the container details.');
  }
};

const handle = (queue, env) => getContainerContents(queue, env)
  .then((metadata) => printResult(metadata));

exports.command = 'list <container>';
exports.desc = 'Get the details of the <container> contents';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.container, argv.env);
