import { MdsSdk } from '@maddonkeysoftware/mds-cloud-sdk-node';
import { EOL } from 'os';
import { ArgumentsCamelCase } from 'yargs';
import {
  display,
  extendBaseCommandBuilder,
  stringifyForDisplay,
} from '../../utils';

const updateFunction = async (argv: ArgumentsCamelCase<Params>) => {
  const client = await MdsSdk.getServerlessFunctionsClient();
  return client.updateFunctionCode(
    argv.id,
    argv.runtime,
    argv.entryPoint,
    argv.source,
    argv.context,
  );
};

const handle = (argv: ArgumentsCamelCase<Params>) =>
  updateFunction(argv)
    .then((resp) =>
      display(
        `Function updated successfully.${EOL}${stringifyForDisplay(resp)}`,
      ),
    )
    .catch((err) =>
      display(
        `An error occurred while updating the function. Message: ${err.message}`,
      ),
    );

interface Params {
  id: string;
  runtime: string;
  entryPoint: string;
  source: string;
  context?: string;
  env: string;
}

export const command = 'update <id>';
export const describe = 'Removes the function with the supplied id';
export const builder = extendBaseCommandBuilder({
  runtime: {
    demand: true,
    desc: 'The runtime to use for the function',
  },
  'entry-point': {
    demand: true,
    desc: 'The path to the source file and method to invoke. Use "foo/bar:method" format.',
  },
  source: {
    demand: true,
    desc: 'Path to an archive (zip) or folder that will be uploaded to the function.',
  },
  context: {
    demand: false,
    desc: 'A string containing whatever context data this function should run with',
  },
});
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
