const got = require('got');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const createQueue = (name, resource) => utils.getEnvConfig()
  .then((conf) => urlJoin(conf.qsUrl, 'queue'))
  .then((url) => {
    const body = {
      name,
    };

    if (resource) {
      body.resource = resource;
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
  if (statusCode === 201 || statusCode === 204) {
    utils.display('Queue created successfully.');
  } else {
    utils.display('An error occurred while creating the queue.');
    utils.display(`Status: ${statusCode}`);
  }
};

const handle = (queue, resource) => createQueue(queue, resource)
  .then((resp) => printResult(resp.statusCode));

exports.command = 'create <queue>';
exports.desc = 'Creates a new queue';
exports.builder = utils.extendBaseCommandBuilder({
  resource: {
    default: null,
    desc: 'resource to be invoked upon message being enqueued',
  },
});
exports.handler = (argv) => handle(argv.queue, argv.resource);
