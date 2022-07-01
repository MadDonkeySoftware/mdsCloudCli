import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const deleteContainer = async (containerOrFile) => {
  const client = await MdsSdk.getFileServiceClient();
  return client.deleteContainerOrPath(containerOrFile);
};

const handle = (containerOrFile: string) =>
  deleteContainer(containerOrFile)
    .then(() => display('Container or file removed successfully.'))
    .catch((err) =>
      display(
        `An error occurred while removing the container or file. Message: ${err.message}`,
      ),
    );

interface Params {
  containerOrFile: string;
  env: string;
}

export const command = 'delete <containerOrFile>';
export const describe =
  'Removes a container or a file. Ex. "test" for the container test or "test/Foo" to remove the file "Foo" from the container "test."';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) =>
  handle(argv.containerOrFile);
