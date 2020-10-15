const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const deleteFunction = (id) => {
  const client = mdsSdk.getServerlessFunctionsClient();
  return client.deleteFunction(id);
};

const handle = (id, env) => deleteFunction(id, env)
  .then((resp) => utils.display(`Function removed successfully. Id: ${resp.id}`))
  .catch((err) => utils.display(`An error occurred while removing the function. Message: ${err.message}`));

exports.command = 'delete <id>';
exports.desc = 'Removes the function with the supplied id';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.id, argv.env);
