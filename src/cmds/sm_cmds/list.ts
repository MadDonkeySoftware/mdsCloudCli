import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { StateMachineListItem } from '@maddonkeysoftware/mds-cloud-sdk-node/clients';
import { display, displayTable, extendBaseCommandBuilder } from '../../utils';

const getMachines = async () => {
  const client = await MdsSdk.getStateMachineServiceClient();
  return client.listStateMachines();
};

const printResult = (machines: StateMachineListItem[]) => {
  if (machines) {
    const headers = ['Orid', 'Name', 'Active Version'];
    const rows = [];
    machines.forEach((machine) => {
      rows.push([machine.orid, machine.name, machine.activeVersion]);
    });

    displayTable(rows, headers);
  } else {
    display('An error occurred while requesting the state machine');
  }
};

const sortCompare = (a: StateMachineListItem, b: StateMachineListItem) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }

  return 0;
};

const handle = () =>
  getMachines()
    .then((machines) => machines.sort(sortCompare))
    .then((machines) => printResult(machines))
    .catch((err) =>
      display(
        `An error occurred while listing the state machines. ${err.message}`,
      ),
    );

export const command = 'list';
export const describe = 'Get the list of available state machines';
export const builder = extendBaseCommandBuilder();
export const handler = () => handle();
