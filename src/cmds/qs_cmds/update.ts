import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const updateQueue = async ({
  queue,
  resource,
}: {
  queue: string;
  resource?: string;
}) => {
  const client = await MdsSdk.getQueueServiceClient();
  return client.updateQueue(queue, { resource });
};

const handle = (argv: ArgumentsCamelCase<Params>) =>
  updateQueue(argv)
    .then(() => display('Queue updated successfully.'))
    .catch((err) =>
      display(`An error occurred while updating the queue. ${err}`),
    );

interface Params {
  queue: string;
  resource?: string;
  env: string;
}

export const command = 'update <queue>';
export const describe = 'Updates metadata around the <queue> queue.';
export const builder = extendBaseCommandBuilder({
  resource: {
    default: null,
    desc: 'resource to be invoked upon message being enqueued. Use the string "null" to delete the current value',
  },
});
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
