import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import VError from 'verror';
import { ArgumentsCamelCase } from 'yargs';
import {
  display,
  extendBaseCommandBuilder,
  stringifyForDisplay,
} from '../../utils';

const invokeFunction = async (argv: ArgumentsCamelCase<Params>) => {
  const client = await MdsSdk.getServerlessFunctionsClient();
  let input: unknown = undefined;
  if (input) {
    switch (argv.inputType) {
      case 'object':
        input = JSON.parse(argv.input);
        break;
      default:
        input = argv.input;
        break;
    }
  }
  return client.invokeFunction(argv.id, input, argv.runAsync);
};

const handleOutput = (resp: unknown, argv: ArgumentsCamelCase<Params>) => {
  if (argv.runAsync) {
    display('Function invoked successfully.');
  } else {
    display(stringifyForDisplay(resp));
  }
};

const handle = (argv: ArgumentsCamelCase<Params>) =>
  invokeFunction(argv)
    .then((resp) => handleOutput(resp, argv))
    .catch((err) =>
      display(
        `An error occurred while invoking the function. ${stringifyForDisplay(
          VError.info(err),
        )}`,
      ),
    );

interface Params {
  id: string;
  data?: string;
  runAsync: boolean;
  input?: string;
  inputType: string;
  env: string;
}

export const command = 'invoke <id> [data]';
export const describe = 'Invokes an execution of a state machine.';
export const builder = extendBaseCommandBuilder({
  runAsync: {
    default: false,
    desc: 'False to wait for the function execution to complete and print the result; True to run function async.',
  },
  input: {
    default: undefined,
    desc: 'Input to be passed to the function',
  },
  'input-type': {
    default: 'string',
    choices: ['string', 'object'],
    desc: 'Input type to be supplied to the function. Use object for JSON object formatting',
  },
});
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
