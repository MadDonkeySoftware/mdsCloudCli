export const command = 'sf <command>';
export const describe = 'Interface with the serverless functions service';
export const builder = (yargs) => yargs.commandDir('sf_cmds');
