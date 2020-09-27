const fs = require('fs');
const util = require('util');
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');
const VError = require('verror');

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
  .then((conf) => generateBody(data)
    .then((body) => {
      mdsSdk.initialize({
        account: conf.account,
        userId: conf.userId,
        password: conf.password,
        identityUrl: conf.identityUrl,
        smUrl: conf.smUrl,
      });
      const client = mdsSdk.getStateMachineServiceClient();
      return client.invokeStateMachine(id, body);
    }));

const operationSorter = (a, b) => new Date(a.created) - new Date(b.created);

const watchOutput = (env, orid, watchInterval) => new Promise((resolve, reject) => {
  const client = mdsSdk.getStateMachineServiceClient();
  const minWatchInterval = 10;
  let lastState;
  let interval = watchInterval;
  if (interval < minWatchInterval) {
    interval = minWatchInterval;
    utils.display(`Watch interval must be at least ${minWatchInterval}. Using ${minWatchInterval}.`);
  }

  const writeUpdate = () => {
    try {
      return client.getDetailsForExecution(orid)
        .then((details) => {
          const { status, operations } = details;
          const orderedOperations = operations.sort(operationSorter);

          const latestOperation = orderedOperations[orderedOperations.length - 1];

          if (status === 'Succeeded' || status === 'Failed') {

            utils.display('');
            utils.display(`Execution: ${status}`);
            utils.display(`Output: ${utils.stringifyForDisplay(latestOperation.output)}`);
            resolve();
          } else {
            const newState = latestOperation.stateKey;
            if (lastState !== newState) {
              lastState = newState;
              utils.display('');
              utils.display(`${newState}.`, true);
            } else {
              utils.display('.', true);
            }

            setTimeout(writeUpdate, interval * 1000);
          }
        });
    } catch (err) {
      return reject(err);
    }
  };

  utils.display('');
  utils.display('States:', true);
  writeUpdate();
});

const handleOutput = (details, { env, watch, watchInterval }) => {
  utils.display(`State machine execution created successfully. Id: ${details.orid}`);
  if (watch) {
    return watchOutput(env, details.orid, watchInterval);
  }

  return Promise.resolve();
};

const handle = (argv) => invokeStateMachine(argv)
  .then((resp) => handleOutput(resp, argv))
  .catch((err) => utils.display(`An error occurred while invoking the state machine. ${utils.stringifyForDisplay(VError.info(err))}`));

exports.command = 'invoke <id> [data]';
exports.desc = 'Invokes an execution of a state machine.';
exports.builder = utils.extendBaseCommandBuilder({
  watch: {
    type: 'boolean',
    default: false,
    desc: 'Prints state changes of execution until the execution succeeds or fails.',
  },
  'watch-interval': {
    type: 'number',
    default: 10,
    desc: 'Interval, in seconds, in which to print updates from the watch flag.',
  },
});
exports.handler = (argv) => handle(argv);
