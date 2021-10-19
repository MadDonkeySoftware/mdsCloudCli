const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const mapPath = (newPath) => {
  if (!newPath) {
    return newPath;
  }

  if (newPath[0] === '.') {
    return newPath.replace('.', process.cwd());
  }

  return newPath;
};

const uploadToContainer = async (containerPath, dest) => {
  const client = await mdsSdk.getFileServiceClient();
  const destination = dest ? mapPath(dest) : process.cwd();
  return client.downloadFile(containerPath, destination);
};

const handle = (argv) =>
  uploadToContainer(argv.orid, argv.dest, argv.env)
    .then(() => utils.display('File downloaded successfully'))
    .catch((err) =>
      utils.display(
        `An error occurred while downloading the file. Message: ${err.message}`,
      ),
    );

exports.command = 'download <orid> [dest]';
exports.desc = 'Download a file from the specified container path';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv);
