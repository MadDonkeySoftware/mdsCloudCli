import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const getFunction = async (id) => {
  const client = await MdsSdk.getServerlessFunctionsClient();
  return client.getFunctionDetails(id);
};

const printResult = (details) => {
  if (details) {
    display(JSON.stringify(details, null, '  '));
  } else {
    display('An error occurred while requesting the details of the function.');
  }
};

const handle = (id) => getFunction(id).then((details) => printResult(details));

interface Params {
  id: string;
  env: string;
}

export const command = 'details <id>';
export const describe = 'Get the details for the specified state machine';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv.id);
