import { Argv } from 'yargs';

export const command = 'id <command>';
export const describe = 'Interface with the identity service';
export const builder = (yargs: Argv) => yargs.commandDir('id_cmds');
