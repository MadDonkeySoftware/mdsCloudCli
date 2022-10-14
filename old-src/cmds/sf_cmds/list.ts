import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { display, displayTable, extendBaseCommandBuilder } from '../../utils';

const getFunctions = async () => {
  const client = await MdsSdk.getServerlessFunctionsClient();
  return client.listFunctions();
};

const printResult = (functions) => {
  if (functions) {
    const headers = ['Name', 'ORID'];
    const rows = [];
    functions.forEach((func) => {
      rows.push([func.name, func.orid]);
    });

    displayTable(rows, headers);
  } else {
    display('An error occurred while requesting the state machine');
  }
};

const sortCompare = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }

  return 0;
};

const handle = () =>
  getFunctions()
    .then((machines) => machines.sort(sortCompare))
    .then((machines) => printResult(machines))
    .catch((err) =>
      display(`An error occurred while listing the functions. ${err.message}`),
    );

export const command = 'list';
export const describe = 'Get the list of available serverless functions';
export const builder = extendBaseCommandBuilder();
export const handler = () => handle();
