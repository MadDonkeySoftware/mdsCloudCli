import { Command, ValidationError } from '@cliffy/command';
import { ConfigService, ConfigurationError } from '../config.service.ts';
import { Output } from '../../../shared/output.ts';
import { getSortedConfigKeys } from '../config.presentation-common.ts';

export const writeCommand = new Command()
  .name('write')
  .description(
    `Writes a config detail. Valid Keys: ${
      getSortedConfigKeys().join(', ')
    }\nFor boolean values (like allowSelfSignCert), use 'true', 'yes', '1', or 'on' for true, other values will be treated as false.`,
  )
  .usage('<key> [options]')
  .option('--env <env>', 'The environment to use for this operation')
  .arguments('<key> <value>')
  .action(async ({ env }: { env?: string }, key: string, value: string) => {
    try {
      await ConfigService.update({ env, configUpdates:  { [key]: value} });
      Output.display(`Successfully updated ${key}`);
    } catch (err) {
      if (err instanceof ConfigurationError) {
        throw new ValidationError(err.message);
      }
      throw err;
    }
  });
