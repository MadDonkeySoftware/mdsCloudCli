import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const enqueueMessage = async ({
  queue,
  message,
}: {
  queue: string;
  message: string;
}) => {
  const client = await MdsSdk.getQueueServiceClient();
  return client.enqueueMessage(queue, message);
};

const handle = (argv: ArgumentsCamelCase<Params>) =>
  enqueueMessage(argv)
    .then(() => display('Message queued successfully.'))
    .catch((err) =>
      display(`An error occurred while enqueueing the message. ${err}`),
    );

interface Params {
  queue: string;
  message: string;
  env: string;
}

export const command = 'enqueueMessage <queue> <message>';
export const describe = '';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
