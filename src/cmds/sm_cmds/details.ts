import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { StateMachineDetails } from '@maddonkeysoftware/mds-cloud-sdk-node/clients';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const getQueues = async (id: string) => {
  const client = await MdsSdk.getStateMachineServiceClient();
  return client.getStateMachine(id);
};

const printResult = (machine: StateMachineDetails) => {
  if (machine) {
    display(JSON.stringify(machine, null, '  '));
  } else {
    display(
      'An error occurred while requesting the details of the state machine.',
    );
  }
};

const handle = (id) => getQueues(id).then((machine) => printResult(machine));

interface Params {
  id: string;
  env: string;
}

export const command = 'details <id>';
export const describe = 'Get the details for the specified state machine';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv.id);
