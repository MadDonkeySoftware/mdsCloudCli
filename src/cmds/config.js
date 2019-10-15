exports.command = 'config <command>';
exports.desc = 'Configure your system to operate against the various MDS services.';
exports.builder = (yargs) => yargs.commandDir('config_cmds');
exports.handler = () => {};
