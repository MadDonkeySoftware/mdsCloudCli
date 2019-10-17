const got = require('got');
const fs = require('fs');
const util = require('util');
const urlJoin = require('url-join');

const utils = require('../../../lib/utils');

const readFile = util.promisify(fs.readFile);

const updateStateMachine = (id, file) => utils.getEnvConfig()
  .then((conf) => urlJoin(conf.smUrl, 'machine', id))
  .then((url) => readFile(file)
    .then((body) => {
      const postOptions = {
        headers: {
          'Content-Type': 'application/json',
        },
        throwHttpErrors: false,
        body,
      };

      return got.post(url, postOptions);
    }));

const printResult = (resp) => {
  const { statusCode, body } = resp;
  if (statusCode === 200) {
    utils.display(`State machine ${JSON.parse(body).uuid} successfully updated.`);
  } else {
    utils.display('An error occurred while updating the state machine.');
    utils.display(`Status: ${statusCode}`);
  }
};

exports.command = 'update <id> <file>';
exports.desc = 'Updates a state machine';
exports.builder = {};
exports.handler = (argv) => updateStateMachine(argv.id, argv.file)
  .then((resp) => printResult(resp));
