const fs = require('fs');
const util = require('util');
const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const readFile = util.promisify(fs.readFile);

const updateStateMachine = ({ id, file, env }) => utils.getEnvConfig(env)
  .then((conf) => readFile(file)
    .then((body) => {
      const client = mdsSdk.getStateMachineServiceClient(conf.smUrl);
      return client.updateStateMachine(id, body.toString());
    }));

const handle = (argv) => updateStateMachine(argv)
  .then((details) => utils.display(`State machine ${details.uuid} successfully updated.`))
  .catch((err) => utils.display(`An error occurred wile updating the state machine. ${err.message}`));

exports.command = 'update <id> <file>';
exports.desc = 'Updates a state machine';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv);
