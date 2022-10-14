import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, displayTable, extendBaseCommandBuilder } from '../../utils';

const getQueueLength = async (names) => {
  const client = await MdsSdk.getQueueServiceClient();
  return Promise.all(
    names.map((name) =>
      client
        .getQueueLength(name)
        .then((rsp) => ({ name, size: rsp.size }))
        .catch((err) => ({ name, size: err.message })),
    ),
  );
};

const displayResults = (results) => {
  if (results.length > 1) {
    const headers = ['Queue', 'Size'];
    const rows = results.map((metadata) => [metadata.name, metadata.size]);
    displayTable(rows, headers);
  } else {
    display(`${results[0].size}`);
  }
};

const handle = (queues) =>
  getQueueLength(queues)
    .then((results) => displayResults(results))
    .catch((err) =>
      display(`An error occurred while requesting the queue length. ${err}`),
    );

interface Params {
  queues: string[];
  env: string;
}

export const command = 'length <queues..>';
export const describe = 'Get the length of the <queue> queue';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) =>
  handle(argv.queues);
