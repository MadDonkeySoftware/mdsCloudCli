import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const uploadToContainer = async (containerPath, filePath) => {
  const client = await MdsSdk.getFileServiceClient();
  return client.uploadFile(containerPath, filePath);
};

const handle = (argv) =>
  uploadToContainer(argv.orid, argv.localFilePath)
    .then(() => display('File uploaded successfully'))
    .catch((err) =>
      display(
        `An error occurred while uploading the file. Message: ${err.message}`,
      ),
    );

interface Params {
  orid: string;
  localFilePath: string;
  env: string;
}

export const command = 'upload <orid> <localFilePath>';
export const describe = 'Uploads a file to the specified container and path';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
