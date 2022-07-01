import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { readFile } from 'fs/promises';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const updateStateMachine = async ({ id, file }) => {
  const body = await readFile(file);
  const client = await MdsSdk.getStateMachineServiceClient();
  return client.updateStateMachine(id, body.toString());
};

const handle = (argv) =>
  updateStateMachine(argv)
    .then((details) =>
      display(`State machine ${details.orid} successfully updated.`),
    )
    .catch((err) =>
      display(
        `An error occurred wile updating the state machine. ${err.message}`,
      ),
    );

interface Params {
  id: string;
  file: string;
  env: string;
}

export const command = 'update <id> <file>';
export const describe = 'Updates a state machine';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
