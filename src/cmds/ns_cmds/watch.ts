import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { forEach } from 'lodash';
import { ArgumentsCamelCase } from 'yargs';
import {
  display,
  extendBaseCommandBuilder,
  stringifyForDisplay,
} from '../../utils';

const handle = async (argv: ArgumentsCamelCase<Params>) => {
  const client = await MdsSdk.getNotificationServiceClient();

  display(`Watching for events on topics: ${argv.topics.join(', ')}`);
  forEach(argv.topics, (topic) => {
    client.on(topic, (data) => {
      display(stringifyForDisplay(data));
    });
  });

  process.on('SIGINT', () => {
    client.close();
    process.exit();
  });
};

interface Params {
  topics: string[];
  env: string;
}

export const command = 'watch [topics..]';
export const describe =
  'Watches a list of topics for events and displays them to the console';
export const builder = extendBaseCommandBuilder();
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
