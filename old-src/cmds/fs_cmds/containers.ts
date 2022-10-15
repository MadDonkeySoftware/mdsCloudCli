import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ContainerListItem } from '@maddonkeysoftware/mds-cloud-sdk-node/types';
import { display, displayTable, extendBaseCommandBuilder } from '../../utils';

const getContainers = async () => {
  const client = await MdsSdk.getFileServiceClient();
  return client.listContainers();
};

const printResult = (containers: ContainerListItem[]) => {
  if (containers) {
    if (containers.length > 0) {
      const headers = ['Name', 'ORID'];
      const rows = [];
      containers.forEach((container) => {
        rows.push([container.name, container.orid]);
      });

      displayTable(rows, headers);
    } else {
      display('No containers found.');
    }
  } else {
    display('An error occurred while requesting the list of containers.');
  }
};

const sorter = (a: ContainerListItem, b: ContainerListItem) => {
  if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
  if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
  return 0;
};

const handle = () =>
  getContainers()
    .then((containers) => containers.sort(sorter))
    .then((containers) => printResult(containers));

export const command = 'containers';
export const describe = 'Get the list of available containers';
export const builder = extendBaseCommandBuilder();
export const handler = () => handle();
