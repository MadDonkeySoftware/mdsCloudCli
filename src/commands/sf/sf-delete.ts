#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { createCommand } from 'commander';
import { Options } from '../../types';
import { display, extendBaseCommand, stringifyForDisplay } from '../../utils';

const cmd = createCommand();
cmd
  .name('delete')
  .argument('<orid>', 'The ORID of the function to remove')
  .description('Removes the function for the provided ORID')
  .showHelpAfterError(true);

extendBaseCommand(cmd);

cmd.action(async (orid: string, options: Options) => {
  await MdsSdk.initialize(options.env);
  const client = await MdsSdk.getServerlessFunctionsClient();

  try {
    const result = await client.deleteFunction(orid);
    display(`Serverless function removed successfully. ${result.id}`);
  } catch (err) {
    display('An error occurred while removing the serverless function');
    display(stringifyForDisplay(err.message || err));
  }
});

cmd.parseAsync(process.argv);
