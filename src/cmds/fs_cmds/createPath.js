const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const createPath = (orid, newPath, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({
      account: conf.account,
      userId: conf.userId,
      password: conf.password,
      identityUrl: conf.identityUrl,
      fsUrl: conf.fsUrl,
    });
    const client = mdsSdk.getFileServiceClient();
    return client.createContainerPath(orid, newPath);
  });

const handle = (orid, newPath, env) => createPath(orid, newPath, env)
  .then(() => utils.display('Container created successfully.'))
  .catch((err) => utils.display(`An error occurred while creating the container. Message: ${err.message}`));

exports.command = 'createPath <container> <path>';
exports.desc = 'Creates a new path inside of a container';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.container, argv.path, argv.env);
