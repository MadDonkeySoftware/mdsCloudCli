const got = require('got');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const getQueues = (id) => utils.getEnvConfig()
  .then((conf) => urlJoin(conf.smUrl, 'machine', id))
  .then((url) => {
    const postOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      throwHttpErrors: false,
    };
    return got.get(url, postOptions);
  });

const printResult = (machine) => {
  if (machine) {
    utils.display(JSON.stringify(machine, null, '  '));
  } else {
    utils.display('An error occurred while requesting the details of the state machine.');
  }
};

exports.command = 'details <id>';
exports.desc = 'Get the details for the specified state machine';
exports.builder = {};
exports.handler = (argv) => getQueues(argv.id)
  .then((resp) => (resp.statusCode === 200 ? JSON.parse(resp.body) : null))
  .then((machine) => printResult(machine));
