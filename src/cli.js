#!/usr/bin/env node
const yargs = require('yargs');
const environment = require('./middleware/environment');

const middleware = [
  environment,
];

// eslint-disable-next-line no-unused-expressions
yargs
  .middleware(middleware)
  .commandDir('./cmds')
  .demandCommand()
  .wrap(yargs.terminalWidth())
  .help()
  .argv;
