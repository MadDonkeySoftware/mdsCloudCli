exports.command = 'fs <command>';
exports.desc = 'Interface with the file service';
exports.builder = (yargs) => yargs.commandDir('fs_cmds');
exports.handler = () => {};
