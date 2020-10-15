const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const createContainer = (name) => {
  const client = mdsSdk.getFileServiceClient();
  return client.createContainer(name);
};

const handle = (name, env) => createContainer(name, env)
  .then(() => utils.display('Container created successfully.'))
  .catch((err) => utils.display(`An error occurred while creating the container. Message: ${err.message}`));

exports.command = 'create <container>';
exports.desc = 'Creates a new container';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.container, argv.env);
