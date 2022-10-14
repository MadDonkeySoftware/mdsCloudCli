import { Argv } from 'yargs';

export const command = 'env <command>';
export const describe = 'Inspect or adjust mds CLI environments.';
export const builder = (yargs: Argv) => yargs.commandDir('env_cmds');
