const utils = require('../../../lib/utils');

const handle = (env) => utils.display(`Current environment: ${env}`);

exports.command = 'print';
exports.desc = 'Prints the currently configured environment to the user.';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.env);
