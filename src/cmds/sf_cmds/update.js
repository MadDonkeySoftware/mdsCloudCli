const os = require('os');
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const updateFunction = (argv) => utils.getEnvConfig(argv.env)
  .then((conf) => {
    mdsSdk.initialize({
      account: conf.account,
      userId: conf.userId,
      password: conf.password,
      identityUrl: conf.identityUrl,
      sfUrl: conf.sfUrl,
    });
    const client = mdsSdk.getServerlessFunctionsClient();
    return client.updateFunctionCode(argv.id, argv.runtime, argv.entryPoint, argv.source);
  });

const handle = (argv) => updateFunction(argv)
  .then((resp) => utils.display(`Function updated successfully.${os.EOL}${utils.stringifyForDisplay(resp)}`))
  .catch((err) => utils.display(`An error occurred while updating the function. Message: ${err.message}`));

exports.command = 'update <id>';
exports.desc = 'Removes the function with the supplied id';
exports.builder = utils.extendBaseCommandBuilder({
  runtime: {
    demand: true,
    desc: 'The runtime to use for the function',
  },
  'entry-point': {
    demand: true,
    desc: 'The path to the source file and method to invoke. Use "foo/bar:method" format.',
  },
  source: {
    demand: true,
    desc: 'Path to an archive (zip) or folder that will be uploaded to the function.',
  },
});
exports.handler = (argv) => handle(argv);
