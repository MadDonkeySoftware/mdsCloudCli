import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ContainerPathContents } from '@maddonkeysoftware/mds-cloud-sdk-node/types';
import { ArgumentsCamelCase } from 'yargs';
import { display, displayTable, extendBaseCommandBuilder } from '../../utils';

const getContainerContents = async (containerOrPath) => {
  const client = await MdsSdk.getFileServiceClient();
  return client.listContainerContents(containerOrPath);
};

const printResult = (outputMode: string, metadata: ContainerPathContents) => {
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
          displayTable(rows, headers);
        } else {
          display('Empty');
        }

        break;
      default:
        display(`${JSON.stringify(metadata, null, 2)}`);
        break;
    }
  } else {
    display('An error occurred while requesting the container details.');
  }
};

const handle = (argv) =>
  getContainerContents(argv.container).then((metadata) =>
    printResult(argv.outputMode, metadata),
  );

interface Params {
  container: string;
  outputMode: string;
  env: string;
}

export const command = 'list <container>';
export const describe = 'Get the details of the <container> contents';
export const builder = extendBaseCommandBuilder({
  'output-mode': {
    default: 'pretty',
    choices: ['pretty', 'json'],
    desc: 'Displays results in human readable grids or a JSON block',
  },
});
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
