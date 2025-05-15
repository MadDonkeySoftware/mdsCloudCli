import { Command } from '@cliffy/command';
// @deno-types="npm:@types/prompts"
import prompts, { PromptObject } from 'prompts';
import { ConfigService } from '../config.service.ts';
import { Output } from '../../../shared/output.ts';
import { ENV_CONFIG_ELEMENTS } from '../config.constants.ts';

export const wizardCommand = new Command()
  .name('wizard')
  .description('Collects and writes all config details')
  .option('--env <env>', 'The environment to use for this operation')
  .action(async ({ env }: { env?: string }) => {
    const removeTrailingSlash: prompts.PrevCaller<string, void> = (state) =>
      typeof state.value === 'string' && state.value.endsWith('/')
        ? state.value.substr(0, state.value.length - 1)
        : state.value;

    const oldConfig = await ConfigService.getConfig(env);

    // NOTE: In a future update change the wizard to collect the identity url and allow self sign
    // information before continuing with the configuration. The URLs supplied by the config service
    // could be used as default values for a new configuration. Also, the wizard could be expanded to
    // include account registration if the CLI user is creating a new mdsCloud account and mdsCloud
    // user.
    // const mdsSdkUtils = require('@maddonkeysoftware/mds-cloud-sdk-node/src/lib/utils');
    // const foo = mdsSdkUtils.getConfigurationUrls('identityUrl', allowSelfCert));

    const configElements = ENV_CONFIG_ELEMENTS.sort(
      (a, b) => a.displayOrder - b.displayOrder,
    );
    const query = configElements.map(
      (e) => ({
        name: e.key,
        message: e.queryPrompt,
        type: e.promptType,
        initial: oldConfig ? oldConfig[e.key] : '',
        onState: removeTrailingSlash,
      } as PromptObject),
    );

    let results;
    try {
      results = await prompts(query);

      // Handle user cancellation (Ctrl+C)
      if (Object.keys(results).length === 0) {
        Output.display('Configuration wizard cancelled');
        Deno.exit(0);
      }

      const envName = await ConfigService.update({
        env,
        configUpdates: results,
      });
      Output.display(
        `Successfully updated config for environment "${envName}"`,
      );
    } catch (err) {
      Output.display(
        `Failed to update configuration: ${(err as Error).message}`,
      );
      Deno.exit(1);
    }

    // NOTE: For some reason after calling prompts, the process will hang open unless we explicitly exit.
    Deno.exit(0);
  });
