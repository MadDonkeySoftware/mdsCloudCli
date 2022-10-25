#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation

import { createCommand } from 'commander';
// import * as yargs from 'yargs';
// import { environmentMiddleware, mdsSdkInitMiddleware } from './middleware';

const app = createCommand();
app
  .name('mds')
  .description('MDS Cloud command line interface')
  .executableDir('commands')
  .command('config', 'Configure your system for various MDS services.')
  .command('env', 'Inspect or adjust mds CLI environments.')
  .command('fs', 'Interacts with the MDS file service')
  .hook('preSubcommand', (thisCommand, subCommand) => {
    // TODO: Not sure if these should be done here or in each sub-command
    // mds sdk init
    // environment display (maybe)
  });

app.parse(process.argv);
