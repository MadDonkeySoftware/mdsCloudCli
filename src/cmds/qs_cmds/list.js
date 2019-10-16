const got = require('got');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const getQueues = () => utils.getEnvConfig()
  .then((conf) => urlJoin(conf.qsUrl, 'queues'))
  .then((url) => {
    const postOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      throwHttpErrors: false,
    };
    return got.get(url, postOptions);
  });

const printResult = (queues) => {
  if (queues) {
    queues.forEach((queue) => {
      utils.display(`${queue}`);
    });
  } else {
    utils.display('An error occurred while requesting the list of queues.');
  }
};

exports.command = 'list';
exports.desc = 'Get the list of available queues';
exports.builder = {};
exports.handler = () => getQueues()
  .then((resp) => (resp.statusCode === 200 ? JSON.parse(resp.body) : null))
  .then((queues) => queues.sort())
  .then((queues) => printResult(queues));
