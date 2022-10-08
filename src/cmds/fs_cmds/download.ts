import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const mapPath = (newPath) => {
  if (!newPath) {
    return newPath;
  }

  if (newPath[0] === '.') {
    return newPath.replace('.', process.cwd());
  }

  return newPath;
};

const uploadToContainer = async (containerPath: string, dest?: string) => {
  const client = await MdsSdk.getFileServiceClient();
  const destination = dest ? mapPath(dest) : process.cwd();
  return client.downloadFile(containerPath, destination);
};

const handle = (argv: ArgumentsCamelCase<Params>) =>
  uploadToContainer(argv.orid, argv.dest)
    .then(() => display('File downloaded successfully'))
    .catch((err) =>
      display(
        `An error occurred while downloading the file. Message: ${err.message}`,
      ),
    );

interface Params {
  orid: string;
  dest?: string;
  env: string;
}

export const command = 'download <orid> [dest]';
export const describe = 'Download a file from the specified container path';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
