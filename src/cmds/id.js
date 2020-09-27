exports.command = 'id <command>';
exports.desc = 'Interface with the identity service';
exports.builder = (yargs) => yargs.commandDir('id_cmds');
exports.handler = () => {};
