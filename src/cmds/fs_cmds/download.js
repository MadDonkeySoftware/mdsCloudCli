const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const uploadToContainer = (containerPath, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({ fsUrl: conf.fsUrl });
    const client = mdsSdk.getFileServiceClient();
    return client.downloadFile(containerPath, process.cwd());
  });

const handle = (argv) => uploadToContainer(argv.containerPath, argv.env)
  .then(() => utils.display('File downloaded successfully'))
  .catch((err) => utils.display(`An error occurred while downloading the file. Message: ${err.message}`));

exports.command = 'download <containerPath>';
exports.desc = 'Download a file from the specified container path';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv);
