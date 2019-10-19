const got = require('got');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const getQueueLength = (name, env) => utils.getEnvConfig(env)
  .then((conf) => urlJoin(conf.qsUrl, 'queue', name, 'length'))
  .then((url) => {
    const postOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      throwHttpErrors: false,
    };
    return got.get(url, postOptions);
  });

const printResult = (size) => {
  if (size > -1) {
    utils.display(`${size}`);
  } else {
    utils.display('An error occurred while requesting the queue length.');
  }
};

const handle = (queue, env) => getQueueLength(queue, env)
  .then((resp) => (resp.statusCode === 200 ? JSON.parse(resp.body).size : -1))
  .then((size) => printResult(size))

exports.command = 'length <queue>';
exports.desc = 'Get the length of the <queue> queue';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.queue, argv.env);
