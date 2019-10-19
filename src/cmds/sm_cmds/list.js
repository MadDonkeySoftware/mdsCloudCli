const got = require('got');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const getQueues = (env) => utils.getEnvConfig(env)
  .then((conf) => urlJoin(conf.smUrl, 'machines'))
  .then((url) => {
    const postOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      throwHttpErrors: false,
    };
    return got.get(url, postOptions);
  });

const printResult = (machines) => {
  if (machines) {
    const headers = ['Id', 'Name', 'Active Version'];
    const rows = [];
    machines.forEach((machine) => {
      rows.push([machine.id, machine.name, machine.active_version]);
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

const handle = (env) => getQueues(env)
  .then((resp) => (resp.statusCode === 200 ? JSON.parse(resp.body) : null))
  .then((machines) => machines.sort(sortCompare))
  .then((machines) => printResult(machines));

exports.command = 'list';
exports.desc = 'Get the list of available state machines';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.env);
