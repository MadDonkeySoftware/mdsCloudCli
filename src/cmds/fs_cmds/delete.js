const mdsSdk = require('@maddonkeysoftware/mds-sdk-node');

const utils = require('../../../lib/utils');

const deleteContainer = (containerOrFile, env) => utils.getEnvConfig(env)
  .then((conf) => {
    mdsSdk.initialize({ fsUrl: conf.fsUrl });
    const client = mdsSdk.getFileServiceClient();
    return client.deleteContainerOrPath(containerOrFile);
  });

const handle = (containerOrFile, env) => deleteContainer(containerOrFile, env)
  .then(() => utils.display('Container or file removed successfully.'))
  .catch((err) => utils.display(`An error occurred while removing the container or file. Message: ${err.message}`));

exports.command = 'delete <containerOrFile>';
exports.desc = 'Removes a container or a file. Ex. "test" for the container test or "test/Foo" to remove the file "Foo" from the container "test."';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.containerOrFile, argv.env);
