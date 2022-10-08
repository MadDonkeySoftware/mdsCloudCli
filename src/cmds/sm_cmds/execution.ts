import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import {
  ExecutionDetailsResult,
  OperationDetail,
} from '@maddonkeysoftware/mds-cloud-sdk-node/clients';
import { ArgumentsCamelCase } from 'yargs';
import {
  display,
  extendBaseCommandBuilder,
  stringifyForDisplay,
} from '../../utils';

const getDetails = async (id: string) => {
  const client = await MdsSdk.getStateMachineServiceClient();
  return client.getDetailsForExecution(id);
};

const operationSorter = (a: OperationDetail, b: OperationDetail) =>
  new Date(a.created).valueOf() - new Date(b.created).valueOf();

const handleOutput = (details: ExecutionDetailsResult) => {
  const { operations } = details;
  const orderedOperations = operations.sort(operationSorter);
  display(stringifyForDisplay({ ...details, operations: orderedOperations }));

  return Promise.resolve();
};

const handle = (argv: ArgumentsCamelCase<Params>) =>
  getDetails(argv.id)
    .then((details) => handleOutput(details))
    .catch((err) =>
      display(
        `An error occurred while getting the execution details. ${err.message}`,
      ),
    );

interface Params {
  id: string;
  env: string;
}

export const command = 'execution <id>';
export const describe = 'Gets the details of an execution.';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
