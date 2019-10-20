const got = require('got');
const fs = require('fs');
const util = require('util');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const readFile = util.promisify(fs.readFile);

const generateBody = (data) => {
  if (!data) {
    return Promise.resolve('{}');
  }

  if (data.startsWith('@')) {
    return readFile(data.substring(1));
  }

  return Promise.resolve(data);
};

const invokeStateMachine = ({ id, data, env }) => utils.getEnvConfig(env)
  .then((conf) => urlJoin(conf.smUrl, 'machine', id, 'invoke'))
  .then((url) => generateBody(data)
    .then((body) => {
      const postOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
        throwHttpErrors: false,
        body,
      };

      return got.post(url, postOptions);
    }));

const operationSorter = (a, b) => new Date(a.created) - new Date(b.created);

const watchOutput = (env, id, watchInterval) => new Promise((resolve) => {
  let lastState;
  const writeUpdate = () => utils.getEnvConfig(env)
    .then((conf) => urlJoin(conf.smUrl, 'execution', id))
    .then((url) => {
      const postOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
        throwHttpErrors: false,
      };

      return got.get(url, postOptions)
        .then((resp) => {
          const { status, operations } = JSON.parse(resp.body);
          const orderedOperations = operations.sort(operationSorter);

          const latestOperation = orderedOperations[orderedOperations.length - 1];

          if (status === 'Succeeded' || status === 'Failed') {
            utils.display('');
            utils.display(`Execution: ${status}`);
            utils.display(`Output: ${utils.stringifyForDisplay(latestOperation.output)}`);
            return resolve();
          }

          const newState = latestOperation.stateKey;
          if (lastState !== newState) {
            lastState = newState;
            utils.display('');
            utils.display(`${newState}.`, true);
          } else {
            utils.display('.', true);
          }

          return setTimeout(writeUpdate, watchInterval * 1000);
        });
    });

  setTimeout(writeUpdate, watchInterval * 1000);
});

const handleOutput = (resp, { env, watch, watchInterval }) => {
  const { statusCode, body } = resp;
  const { id } = JSON.parse(body);

  if (statusCode === 200) {
    utils.display(`State machine created successfully. Id: ${id}`);
    if (watch) {
      return watchOutput(env, id, watchInterval);
    }
  } else {
    utils.display('An error occurred while creating the state machine.');
    utils.display(`Status: ${statusCode}`);
  }

  return Promise.resolve();
};

const handle = (argv) => invokeStateMachine(argv)
  .then((resp) => handleOutput(resp, argv));

exports.command = 'invoke <id> [data]';
exports.desc = 'Invokes an execution of a state machine.';
exports.builder = utils.extendBaseCommandBuilder({
  watch: {
    default: false,
    desc: 'Prints state changes of execution until the execution succeeds or fails.',
  },
  'watch-interval': {
    default: 2,
    desc: 'Interval, in seconds, in which to print updates from the watch flag.',
  },
});
exports.handler = (argv) => handle(argv);
