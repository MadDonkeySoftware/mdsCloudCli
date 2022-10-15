import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const deleteQueue = async (orid: string) => {
  const client = await MdsSdk.getQueueServiceClient();
  return client.deleteQueue(orid);
};

const handle = (queue: string) =>
  deleteQueue(queue)
    .then(() => display('Queue removed successfully.'))
    .catch((err) =>
      display(`An error occurred while removing the queue. ${err.message}`),
    );

interface Params {
  queue: string;
  env: string;
}

export const command = 'delete <queue>';
export const describe = 'Removes a queue';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv.queue);
