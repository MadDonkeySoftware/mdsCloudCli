exports.command = 'env <command>';
exports.desc = 'Inspect or adjust mds CLI environments.';
exports.builder = (yargs) => yargs.commandDir('env_cmds');
exports.handler = () => {};
