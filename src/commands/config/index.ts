import { Command, ValidationError } from '@cliffy/command';
import { inspectCommand } from './commands/inspect-command.ts';
import { writeCommand } from './commands/write-command.ts';
import { wizardCommand } from './commands/wizard-command.ts';

export const configCommand = new Command()
  .name('config')
  .description(
    'Configures your system for various MDS services and environments',
  )
  .usage('<sub-command> [options]')
  .action(() => {
    throw new ValidationError('No sub-command provided');
  })
  .command('inspect', inspectCommand)
  .command('write', writeCommand)
  .command('wizard', wizardCommand);
