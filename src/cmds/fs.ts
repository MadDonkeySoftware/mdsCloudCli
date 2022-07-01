import { Argv } from 'yargs';

export const command = 'fs <command>';
export const describe = 'Interface with the file service';
export const builder = (yargs: Argv) => yargs.commandDir('fs_cmds');
