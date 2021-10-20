const _ = require('lodash');
const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const handle = async (argv) => {
  const client = await mdsSdk.getNotificationServiceClient();

  utils.display(`Watching for events on topics: ${argv.topics.join(', ')}`);
  _.forEach(argv.topics, (topic) => {
    client.on(topic, (data) => {
      utils.display(utils.stringifyForDisplay(data));
    });
  });

  process.on('SIGINT', () => {
    client.close();
    process.exit();
  });
};

exports.command = 'watch [topics..]';
exports.desc =
  'Watches a list of topics for events and displays them to the console';
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv);
