const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const getMachines = async () => {
  const client = await mdsSdk.getStateMachineServiceClient();
  return client.listStateMachines();
};

const printResult = (machines) => {
  if (machines) {
    const headers = ['Orid', 'Name', 'Active Version'];
    const rows = [];
    machines.forEach((machine) => {
      rows.push([machine.orid, machine.name, machine.active_version]);
    });

    utils.displayTable(rows, headers);
  } else {
    utils.display('An error occurred while requesting the state machine');
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

const handle = (env) =>
  getMachines(env)
    .then((machines) => machines.sort(sortCompare))
    .then((machines) => printResult(machines))
    .catch((err) =>
      utils.display(
        `An error occurred while listing the state machines. ${err.message}`,
      ),
    );

exports.command = 'list';
exports.desc = 'Get the list of available state machines';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.env);
