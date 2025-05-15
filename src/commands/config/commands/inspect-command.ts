import { Command, ValidationError } from '@cliffy/command';
import { ConfigService, ConfigurationError } from '../config.service.ts';
import { Output } from '../../../shared/output.ts';
import { getSortedConfigKeys } from '../config.presentation-common.ts';

export const inspectCommand = new Command()
  .name('inspect')
  .description(
    `Inspects a config detail. Valid Keys: ${
      getSortedConfigKeys({ includeAll: true }).join(', ')
    }`,
  )
  .usage('<key> [options]')
  .option('--env <env>', 'The environment to use for this operation')
  .arguments('<key>')
  .action(async ({ env }: { env?: string }, key: string) => {
    try {
      const data = await ConfigService.inspect(key, env);
      if (typeof data === 'string') {
        Output.display(data);
      } else {
        Output.displayTable(data);
      }
    } catch (err) {
      if (err instanceof ConfigurationError) {
        throw new ValidationError(err.message);
      }
      throw err;
    }
  });
