import { display, extendBaseCommandBuilder } from '../../utils';

const handle = (env) => display(`Current environment: ${env}`);

export const command = 'print';
export const desc = 'Prints the currently configured environment to the user.';
export const builder = extendBaseCommandBuilder();
export const handler = (argv) => handle(argv.env);
