const got = require('got');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const updateQueue = ({ queue, resource, env }) => utils.getEnvConfig(env)
  .then((conf) => urlJoin(conf.qsUrl, 'queue', queue))
  .then((url) => {
    const body = { };

    if (resource) {
      body.resource = resource.toUpperCase() === 'NULL' ? null : resource;
    }

    const postOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      throwHttpErrors: false,
      body: JSON.stringify(body),
    };

    return got.post(url, postOptions);
  });

const printResult = (statusCode) => {
  if (statusCode === 200) {
    utils.display('Queue updated successfully.');
  } else {
    utils.display('An error occurred while updating the queue.');
    utils.display(`Status: ${statusCode}`);
  }
};

const handle = (argv) => updateQueue(argv)
  .then((resp) => printResult(resp.statusCode));

exports.command = 'update <queue>';
exports.desc = 'Updates metadata around the <queue> queue.';
exports.builder = utils.extendBaseCommandBuilder({
  resource: {
    default: null,
    desc: 'resource to be invoked upon message being enqueued. Use the string "null" to delete the current value',
  },
});
exports.handler = (argv) => handle(argv);
