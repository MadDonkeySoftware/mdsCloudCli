import { ArgumentsCamelCase } from 'yargs';
import { readFile } from 'fs/promises';
import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { display, extendBaseCommandBuilder } from '../../utils';

const createStateMachine = async (file: string) => {
  const body = await readFile(file);
  const client = await MdsSdk.getStateMachineServiceClient();
  return client.createStateMachine(body.toString());
};

const handle = (file) =>
  createStateMachine(file)
    .then((resp) =>
      display(`State machine created successfully. Id: ${resp.orid}`),
    )
    .catch((err) =>
      display(
        `An error occurred wile creating the state machine. ${err.message}`,
      ),
    );

interface Params {
  file: string;
  env: string;
}

export const command = 'create <file>';
export const describe = 'Creates a new state machine';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv.file);
