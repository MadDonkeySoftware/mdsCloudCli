const got = require('got');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const getDetails = ({ id, env }) => utils.getEnvConfig(env)
  .then((conf) => urlJoin(conf.smUrl, 'execution', id))
  .then((url) => {
    const postOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      throwHttpErrors: false,
    };

    return got.get(url, postOptions);
  });

const operationSorter = (a, b) => new Date(a.created) - new Date(b.created);

const handleOutput = (resp) => {
  const { statusCode, body } = resp;

  if (statusCode === 200) {
    const details = JSON.parse(body);
    const { operations } = details;

    const orderedOperations = operations.sort(operationSorter);

    details.operations = orderedOperations;

    utils.display(utils.stringifyForDisplay(details));
  } else {
    utils.display('An error occurred while getting the execution details.');
    utils.display(`Status: ${statusCode}`);
  }

  return Promise.resolve();
};

const handle = (argv) => getDetails(argv)
  .then((resp) => handleOutput(resp, argv));

exports.command = 'execution <id>';
exports.desc = 'Gets the details of an execution.';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv);
