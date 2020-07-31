exports.command = 'ns <command>';
exports.desc = 'Interface with the notification service';
exports.builder = (yargs) => yargs.commandDir('ns_cmds');
exports.handler = () => {};
