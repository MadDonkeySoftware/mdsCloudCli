import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ExecutionInvokeResult } from '@maddonkeysoftware/mds-cloud-sdk-node/clients';
import { readFile } from 'fs/promises';
import VError from 'verror';
import { ArgumentsCamelCase } from 'yargs';
import {
  display,
  extendBaseCommandBuilder,
  stringifyForDisplay,
} from '../../utils';

const generateBody = (data) => {
  if (!data) {
    return Promise.resolve('{}');
  }

  if (data.startsWith('@')) {
    return readFile(data.substring(1));
  }

  return Promise.resolve(data);
};

const invokeStateMachine = async ({
  id,
  data,
}: {
  id: string;
  data?: string;
}) => {
  const body = await generateBody(data);
  const client = await MdsSdk.getStateMachineServiceClient();
  return client.invokeStateMachine(id, body);
};

const operationSorter = (a, b) =>
  new Date(a.created).valueOf() - new Date(b.created).valueOf();

const watchOutput = async (orid: string, watchInterval: number) => {
  const client = await MdsSdk.getStateMachineServiceClient();
  return new Promise((resolve, reject) => {
    const minWatchInterval = 10;
    let lastState;
    let interval = watchInterval;
    if (interval < minWatchInterval) {
      interval = minWatchInterval;
      display(
        `Watch interval must be at least ${minWatchInterval}. Using ${minWatchInterval}.`,
      );
    }

    const writeUpdate = () => {
      try {
        return client.getDetailsForExecution(orid).then((details) => {
          const { status, operations } = details;
          const orderedOperations = operations.sort(operationSorter);

          const latestOperation =
            orderedOperations[orderedOperations.length - 1];

          if (status === 'Succeeded' || status === 'Failed') {
            display('');
            display(`Execution: ${status}`);
            display(`Output: ${stringifyForDisplay(latestOperation.output)}`);
            resolve(undefined);
          } else {
            const newState = latestOperation.stateKey;
            if (lastState !== newState) {
              lastState = newState;
              display('');
              display(`${newState}.`, true);
            } else {
              display('.', true);
            }

            setTimeout(writeUpdate, interval * 1000);
          }
        });
      } catch (err) {
        return reject(err);
      }
    };

    display('');
    display('States:', true);
    writeUpdate();
  });
};

const handleOutput = (
  details: ExecutionInvokeResult,
  { watch, watchInterval }: { watch: boolean; watchInterval: number },
) => {
  display(`State machine execution created successfully. Id: ${details.orid}`);
  if (watch) {
    return watchOutput(details.orid, watchInterval);
  }

  return Promise.resolve();
};

const handle = (argv: ArgumentsCamelCase<Params>) =>
  invokeStateMachine(argv)
    .then((resp) => handleOutput(resp, argv))
    .catch((err) =>
      display(
        `An error occurred while invoking the state machine. ${stringifyForDisplay(
          VError.info(err),
        )}`,
      ),
    );

interface Params {
  id: string;
  data?: string;
  watch: boolean;
  watchInterval: number;
  env: string;
}

export const command = 'invoke <id> [data]';
export const describe = 'Invokes an execution of a state machine.';
export const builder = extendBaseCommandBuilder({
  watch: {
    type: 'boolean',
    default: false,
    desc: 'Prints state changes of execution until the execution succeeds or fails.',
  },
  'watch-interval': {
    type: 'number',
    default: 10,
    desc: 'Interval, in seconds, in which to print updates from the watch flag.',
  },
});
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
