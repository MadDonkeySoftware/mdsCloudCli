#!/usr/bin/env node
// NOTE: the above is intentionally using node since that is the proper value after transpilation
import * as yargs from 'yargs';
import { environmentMiddleware, mdsSdkInitMiddleware } from './middleware';

// eslint-disable-next-line no-unused-expressions
yargs
  .middleware([environmentMiddleware, mdsSdkInitMiddleware])
  .commandDir('./cmds')
  .demandCommand()
  .wrap(yargs.terminalWidth())
  .help().argv;
