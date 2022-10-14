import { Argv } from 'yargs';

export const command = 'config <command>';
export const describe = 'Configure yoru system for various MDS services.';
export const builder = (yargs: Argv) => yargs.commandDir('config_cmds');
