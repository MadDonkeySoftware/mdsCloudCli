exports.command = 'qs <command>';
exports.desc = 'Interface with the queue service';
exports.builder = (yargs) => yargs.commandDir('qs_cmds');
exports.handler = () => {};
