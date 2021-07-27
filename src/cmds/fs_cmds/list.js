const mdsSdk = require('@maddonkeysoftware/mds-cloud-sdk-node');

const utils = require('../../../lib/utils');

const getContainerContents = (containerOrPath) => {
  const client = mdsSdk.getFileServiceClient();
  return client.listContainerContents(containerOrPath);
};

const printResult = (outputMode, metadata) => {
  const headers = ['Type', 'Name', 'ORID'];
  const rows = [];
  if (metadata) {
    switch (outputMode) {
      case 'pretty':
        metadata.directories.forEach((d) => {
          rows.push(['Directory', d.name, d.orid]);
        });
        metadata.files.forEach((f) => {
          rows.push(['File', f.name, f.orid]);
        });

        if (rows.length > 0) {
          utils.displayTable(rows, headers);
        } else {
          utils.display('Empty');
        }

        break;
      default:
        utils.display(`${JSON.stringify(metadata, null, 2)}`);
        break;
    }
  } else {
    utils.display('An error occurred while requesting the container details.');
  }
};

const handle = (argv) =>
  getContainerContents(argv.container, argv.env).then((metadata) =>
    printResult(argv.outputMode, metadata)
  );

exports.command = 'list <container>';
exports.desc = 'Get the details of the <container> contents';
exports.builder = utils.extendBaseCommandBuilder({
  'output-mode': {
    default: 'pretty',
    choices: ['pretty', 'json'],
    desc: 'Displays results in human readable grids or a JSON block',
  },
});
exports.handler = (argv) => handle(argv);
