const got = require('got');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const deleteQueue = (name) => utils.getEnvConfig()
  .then((conf) => urlJoin(conf.qsUrl, 'queue', name))
  .then((url) => {
    const postOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      throwHttpErrors: false,
    };

    return got.delete(url, postOptions);
  });

const printResult = (statusCode) => {
  if (statusCode === 204) {
    utils.display('Queue removed successfully.');
  } else {
    utils.display('An error occurred while removing the queue.');
  }
};

exports.command = 'delete <queue>';
exports.desc = 'Removes a queue';
exports.builder = {};
exports.handler = (argv) => deleteQueue(argv.queue)
  .then((resp) => printResult(resp.statusCode));
