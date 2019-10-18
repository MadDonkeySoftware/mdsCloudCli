const got = require('got');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const getQueueDetails = (name, env) => utils.getEnvConfig(env)
  .then((conf) => urlJoin(conf.qsUrl, 'queue', name, 'details'))
  .then((url) => {
    const postOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      throwHttpErrors: false,
    };
    return got.get(url, postOptions);
  });

const printResult = (metadata) => {
  if (metadata) {
    utils.display(`${JSON.stringify(metadata, null, 2)}`);
  } else {
    utils.display('An error occurred while requesting the queue metadata.');
  }
};

exports.command = 'details <queue>';
exports.desc = 'Get the details of the <queue> queue';
exports.builder = {
  env: {
    default: 'default',
    desc: 'The environment to write this value to',
  },
};
exports.handler = (argv) => getQueueDetails(argv.queue, argv.env)
  .then((resp) => (resp.statusCode === 200 ? JSON.parse(resp.body) : null))
  .then((metadata) => printResult(metadata));
