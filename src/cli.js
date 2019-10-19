#!/usr/bin/env node
const environment = require('./middleware/environment');

const middleware = [
  environment,
];

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .middleware(middleware)
  .commandDir('./cmds')
  .demandCommand()
  .help()
  .argv;
