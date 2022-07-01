import { Argv } from 'yargs';

export const command = 'qs <command>';
export const describe = 'Interface with the queue service';
export const builder = (yargs: Argv) => yargs.commandDir('qs_cmds');
