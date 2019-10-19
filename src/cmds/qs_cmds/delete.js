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

const handle = (queue) => deleteQueue(queue)
  .then((resp) => printResult(resp.statusCode));

exports.command = 'delete <queue>';
exports.desc = 'Removes a queue';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.queue);
