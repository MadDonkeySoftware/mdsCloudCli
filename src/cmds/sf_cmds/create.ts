import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const createFunction = async (name) => {
  const client = await MdsSdk.getServerlessFunctionsClient();
  return client.createFunction(name);
};

const handle = (name) =>
  createFunction(name)
    .then((resp) => display(`Function created successfully. Id: ${resp.id}`))
    .catch((err) =>
      display(
        `An error occurred while creating the function. Message: ${err.message}`,
      ),
    );

interface Params {
  name: string;
  env: string;
}

export const command = 'create <name>';
export const describe = 'Creates a new function with the provided name';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv.name);
