const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const handle = (argv) => utils.getEnvConfig(argv.env)
  .then((conf) => {
    mdsSdk.initialize({ nsUrl: conf.nsUrl });
    const client = mdsSdk.getNotificationServiceClient();
    const data = argv.dataFormat === 'json' ? JSON.parse(argv.data) : argv.data;
    client.emit(argv.topic, data)
      .then((err) => {
        if (err) {
          utils.display(`${err}`);
        }
        client.close();
      });
  });

exports.command = 'emit <topic> [data]';
exports.desc = 'Emits a notification with the specified body';
exports.builder = utils.extendBaseCommandBuilder({
  'data-format': {
    default: 'text',
    choices: ['text', 'json'],
    alias: 'df',
    desc: 'Switches if the data should be emitted as an object or as a string.',
  },
});
exports.handler = (argv) => handle(argv);
