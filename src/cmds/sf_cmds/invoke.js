const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');
const VError = require('verror');

const utils = require('../../../lib/utils');

const invokeFunction = (argv) => {
  const client = mdsSdk.getServerlessFunctionsClient();
  let input;
  switch (argv.inputType) {
    case 'object':
      input = JSON.parse(argv.input);
      break;
    default:
      input = argv.input;
      break;
  }
  return client.invokeFunction(argv.id, input, argv.runAsync);
};

const handleOutput = (resp, argv) => {
  if (argv.runAsync) {
    utils.display('Function invoked successfully.');
  } else {
    utils.display(utils.stringifyForDisplay(resp));
  }
};

const handle = (argv) => invokeFunction(argv)
  .then((resp) => handleOutput(resp, argv))
  .catch((err) => utils.display(`An error occurred while invoking the function. ${utils.stringifyForDisplay(VError.info(err))}`));

exports.command = 'invoke <id> [data]';
exports.desc = 'Invokes an execution of a state machine.';
exports.builder = utils.extendBaseCommandBuilder({
  runAsync: {
    default: false,
    desc: 'False to wait for the function execution to complete and print the result; True to run function async.',
  },
  input: {
    default: undefined,
    desc: 'Input to be passed to the function',
  },
  'input-type': {
    default: 'string',
    choices: ['string', 'object'],
    desc: 'Input type to be supplied to the function. Use object for JSON object formatting',
  },
});
exports.handler = (argv) => handle(argv);
