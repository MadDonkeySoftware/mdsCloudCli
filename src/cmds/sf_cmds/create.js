const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const createFunction = (name) => {
  const client = mdsSdk.getServerlessFunctionsClient();
  return client.createFunction(name);
};

const handle = (name, env) => createFunction(name, env)
  .then((resp) => utils.display(`Function created successfully. Id: ${resp.orid || resp.id}`))
  .catch((err) => utils.display(`An error occurred while creating the function. Message: ${err.message}`));

exports.command = 'create <name>';
exports.desc = 'Creates a new function with the provided name';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.name, argv.env);
