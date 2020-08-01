exports.command = 'sf <command>';
exports.desc = 'Interface with the serverless functions service';
exports.builder = (yargs) => yargs.commandDir('sf_cmds');
exports.handler = () => {};
