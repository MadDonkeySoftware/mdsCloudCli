import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { ArgumentsCamelCase } from 'yargs';
import { display, extendBaseCommandBuilder } from '../../utils';

const handle = async (argv: ArgumentsCamelCase<Params>) => {
  const client = await MdsSdk.getNotificationServiceClient();
  const data: string =
    argv.dataFormat === 'json' ? JSON.parse(argv.data) : argv.data;
  return client
    .emit(argv.topic, data)
    .catch((err) =>
      display(`There was an issue emitting your message: ${err.message}`),
    )
    .finally(() => client.close());
};

interface Params {
  topic: string;
  data?: string;
  dataFormat: string;
  env: string;
}

export const command = 'emit <topic> [data]';
export const describe = 'Emits a notification with the specified body';
export const builder = extendBaseCommandBuilder({
  'data-format': {
    default: 'text',
    choices: ['text', 'json'],
    alias: 'df',
    desc: 'Switches if the data should be emitted as an object or as a string.',
  },
});
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
