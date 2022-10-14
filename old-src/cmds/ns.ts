import { Argv } from 'yargs';

export const command = 'ns <command>';
export const describe = 'Interface with the notification service';
export const builder = (yargs: Argv) => yargs.commandDir('ns_cmds');
