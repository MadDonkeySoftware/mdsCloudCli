import { Command, ValidationError } from '@cliffy/command';
import { configCommand } from './commands/config/index.ts';

export const mainCommand = new Command()
  .name('mds')
  .description('MDS Cloud command line tool')
  .version('0.1.1')
  .usage('<sub-command> [options]')
  .action(() => {
    throw new ValidationError('No sub-command provided');
  })
  .command('config', configCommand);

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  await mainCommand.parse(Deno.args);
}
