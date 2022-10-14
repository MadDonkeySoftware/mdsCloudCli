import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const createContainer = async (name) => {
  const client = await MdsSdk.getFileServiceClient();
  return client.createContainer(name);
};

const handle = (name: string) =>
  createContainer(name)
    .then(() => display('Container created successfully.'))
    .catch((err) =>
      display(
        `An error occurred while creating the container. Message: ${err.message}`,
      ),
    );

interface Params {
  container: string;
  env: string;
}

export const command = 'create <container>';
export const describe = 'Creates a new container';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) =>
  handle(argv.container);
