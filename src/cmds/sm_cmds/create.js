const fs = require('fs');
const util = require('util');
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const readFile = util.promisify(fs.readFile);

const createStateMachine = async (file) => {
  const body = await readFile(file);
  const client = await mdsSdk.getStateMachineServiceClient();
  return client.createStateMachine(body.toString());
};

const handle = (file, env) =>
  createStateMachine(file, env)
    .then((resp) =>
      utils.display(`State machine created successfully. Id: ${resp.orid}`),
    )
    .catch((err) =>
      utils.display(
        `An error occurred wile creating the state machine. ${err.message}`,
      ),
    );

exports.command = 'create <file>';
exports.desc = 'Creates a new state machine';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.file, argv.env);
