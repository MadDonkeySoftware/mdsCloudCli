import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { QueueDetails } from '@maddonkeysoftware/mds-cloud-sdk-node/clients';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const getQueueDetails = async (name: string) => {
  const client = await MdsSdk.getQueueServiceClient();
  return client.getQueueDetails(name);
};

const printResult = (metadata: QueueDetails) => {
  if (metadata) {
    display(`${JSON.stringify(metadata, null, 2)}`);
  } else {
    display('An error occurred while requesting the queue metadata.');
  }
};

const handle = (queue: string) =>
  getQueueDetails(queue).then((metadata) => printResult(metadata));

interface Params {
  queue: string;
  env: string;
}

export const command = 'details <queue>';
export const describe = 'Get the details of the <queue> queue';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv.queue);
