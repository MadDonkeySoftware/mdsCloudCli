const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const getFunctions = () => {
  const client = mdsSdk.getServerlessFunctionsClient();
  return client.listFunctions();
};

const printResult = (functions) => {
  if (functions) {
    const headers = ['Name', 'ORID'];
    const rows = [];
    functions.forEach((func) => {
      rows.push([func.name, func.orid]);
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

const handle = (env) => getFunctions(env)
  .then((machines) => machines.sort(sortCompare))
  .then((machines) => printResult(machines))
  .catch((err) => utils.display(`An error occurred while listing the functions. ${err.message}`));

exports.command = 'list';
exports.desc = 'Get the list of available serverless functions';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = () => handle();
