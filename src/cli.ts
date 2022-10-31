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
  .command('id', 'Interacts with the MDS identity service')
  .command('ns', 'Interacts with the MDS notification service')
  .command('qs', 'Interacts with the MDS queue service')
  .command('sf', 'Interacts with the MDS serverless functions service');

app.parse(process.argv);
