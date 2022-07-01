import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const deleteStateMachine = async (id) => {
  const client = await MdsSdk.getStateMachineServiceClient();
  return client.deleteStateMachine(id);
};

const printResult = (machine) => {
  if (machine) {
    display(`State machine ${machine.orid} successfully deleted.`);
  } else {
    display('An error occurred while deleting the state machine.');
  }
};

const handle = (id: string) =>
  deleteStateMachine(id).then((response) => printResult(response));

interface Params {
  id: string;
  env: string;
}

export const command = 'delete <id>';
export const describe = 'Deletes the specified state machine';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv.id);
