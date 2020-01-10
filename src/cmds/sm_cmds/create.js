const fs = require('fs');
const util = require('util');
const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const readFile = util.promisify(fs.readFile);

const createStateMachine = (file, env) => utils.getEnvConfig(env)
  .then((conf) => readFile(file)
    .then((body) => {
      mdsSdk.initialize({ smUrl: conf.smUrl });
      const client = mdsSdk.getStateMachineServiceClient();
      return client.createStateMachine(body.toString());
    }));

const handle = (file, env) => createStateMachine(file, env)
  .then((resp) => utils.display(`State machine created successfully. Id: ${resp.uuid}`))
  .catch((err) => utils.display(`An error occurred wile creating the state machine. ${err.message}`));

exports.command = 'create <file>';
exports.desc = 'Creates a new state machine';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.file, argv.env);
