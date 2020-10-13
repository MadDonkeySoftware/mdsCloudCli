const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const uploadToContainer = (containerPath, filePath, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({
      account: conf.account,
      userId: conf.userId,
      password: conf.password,
      identityUrl: conf.identityUrl,
      fsUrl: conf.fsUrl,
    });
    const client = mdsSdk.getFileServiceClient();
    return client.uploadFile(containerPath, filePath);
  });

const handle = (argv) => uploadToContainer(argv.orid, argv.localFilePath, argv.env)
  .then(() => utils.display('File uploaded successfully'))
  .catch((err) => utils.display(`An error occurred while uploading the file. Message: ${err.message}`));

exports.command = 'upload <orid> <localFilePath>';
exports.desc = 'Uploads a file to the specified container and path';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv);
