import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const deleteFunction = async (id) => {
  const client = await MdsSdk.getServerlessFunctionsClient();
  return client.deleteFunction(id);
};

const handle = (id) =>
  deleteFunction(id)
    .then((resp) => display(`Function removed successfully. Id: ${resp.id}`))
    .catch((err) =>
      display(
        `An error occurred while removing the function. Message: ${err.message}`,
      ),
    );

interface Params {
  id: string;
  env: string;
}

export const command = 'delete <id>';
export const describe = 'Removes the function with the supplied id';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv.id);
