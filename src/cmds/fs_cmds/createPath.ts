import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const createPath = async (orid, newPath) => {
  const client = await MdsSdk.getFileServiceClient();
  return client.createContainerPath(orid, newPath);
};

const handle = (orid: string, newPath: string) =>
  createPath(orid, newPath)
    .then(() => display('Container created successfully.'))
    .catch((err) =>
      display(
        `An error occurred while creating the container. Message: ${err.message}`,
      ),
    );

interface Params {
  container: string;
  path: string;
  env: string;
}

export const command = 'createPath <container> <path>';
export const describe = 'Creates a new path inside of a container';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) =>
  handle(argv.container, argv.path);
