exports.command = 'sm <command>';
exports.desc = 'Interface with the state machine service';
exports.builder = (yargs) => yargs.commandDir('sm_cmds');
exports.handler = () => {};
