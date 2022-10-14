import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const createQueue = async ({
  queue,
  resource,
  dlq,
}: {
  queue: string;
  resource?: string;
  dlq?: string;
}) => {
  const client = await MdsSdk.getQueueServiceClient();
  return client.createQueue(queue, { resource, dlq });
};

const printResults = (results) => {
  display(`Queue created successfully. ${results.orid}`);
};

const handle = ({
  queue,
  resource,
  dlq,
}: {
  queue: string;
  resource?: string;
  dlq?: string;
}) =>
  createQueue({ queue, resource, dlq })
    .then((result) => printResults(result))
    .catch((err) =>
      display(`An error occurred while creating the queue. ${err.message}`),
    );

interface Params {
  queue: string;
  resource?: string;
  dlq?: string;
  env: string;
}

export const command = 'create <queue>';
export const describe = 'Creates a new queue';
export const builder = extendBaseCommandBuilder({
  resource: {
    default: null,
    desc: 'resource to be invoked upon message being enqueued',
  },
  dlq: {
    default: null,
    desc: 'ORID of queue to place message in if resource invoke fails',
  },
});
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
