const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const getContainers = () => {
  const client = mdsSdk.getFileServiceClient();
  return client.listContainers();
};

const printResult = (containers) => {
  if (containers) {
    if (containers.length > 0) {
      const headers = ['Name', 'ORID'];
      const rows = [];
      containers.forEach((container) => {
        rows.push([container.name, container.orid]);
      });

      utils.displayTable(rows, headers);
    } else {
      utils.display('No containers found.');
    }
  } else {
    utils.display('An error occurred while requesting the list of containers.');
  }
};

const sorter = (a, b) => {
  if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
  if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
  return 0;
};

const handle = () => getContainers()
  .then((containers) => containers.sort(sorter))
  .then((containers) => printResult(containers));

exports.command = 'containers';
exports.desc = 'Get the list of available containers';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = () => handle();
