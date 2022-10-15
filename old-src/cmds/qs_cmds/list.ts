import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { display, displayTable, extendBaseCommandBuilder } from '../../utils';

const getQueues = async () => {
  const client = await MdsSdk.getQueueServiceClient();
  return client.listQueues();
};

const printResult = (queues) => {
  if (queues) {
    const headers = ['Name', 'ORID'];
    const rows = [];
    queues.forEach((q) => {
      rows.push([q.name, q.orid]);
    });
    displayTable(rows, headers);
  } else {
    display('An error occurred while requesting the list of queues.');
  }
};

const handle = () => getQueues().then((queues) => printResult(queues));

export const command = 'list';
export const describe = 'Get the list of available queues';
export const builder = extendBaseCommandBuilder();
export const handler = () => handle();
