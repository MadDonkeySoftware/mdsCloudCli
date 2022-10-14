import { EOL } from 'os';
import { AES, enc, lib } from 'crypto-js';
import { ArgumentsCamelCase } from 'yargs';
import { readFile, writeFile, unlink as deleteFile } from 'fs/promises';
import { display, extendBaseCommandBuilder } from '../utils';
import { fileExists } from '../utils/file-exists';

type EncryptionFunc = (
  data: string,
  password: lib.WordArray,
  initVector: lib.WordArray,
) => Promise<string | Record<string, unknown>>;

async function completeEncryption(
  inData: string,
  pwd: lib.WordArray,
  iv: lib.WordArray,
): Promise<string> {
  return AES.encrypt(inData, pwd, { iv }).toString();
}

async function iniEncryption(
  inData: string,
  pwd: lib.WordArray,
  iv: lib.WordArray,
): Promise<Record<string, unknown>> {
  const inLines = inData.split(EOL);
  const outObj: Record<string, string> = {};

  for (let i = 0; i < inLines.length; i += 1) {
    const line = inLines[i];
    const firstEqual = line.indexOf('=');
    if (firstEqual !== -1) {
      const key = line.substring(0, firstEqual);
      const val = line.substring(firstEqual + 1);
      outObj[key] = AES.encrypt(val, pwd, { iv }).toString();
    } else {
      // TODO: How to handle blank lines, comments, etc.
    }
  }

  return outObj;
}

async function handle(argv: ArgumentsCamelCase<Params>) {
  display(
    'WARNING: Encryption/Decryption is experimental. Use at your own risk.',
  );
  const pwd = argv.password || process.env.MDS_CLI_CRYPTO_PWD;

  if (!pwd) {
    display(
      'Password is required. Use password flag or MDS_CLI_CRYPTO_PWD environment variable',
    );
    return;
  }

  if (!argv.inPlace && !argv.outFile) {
    display(
      'Muse use in-place flag or provide a out-file name. Cannot perform action.',
    );
    return;
  }

  const fileData = (await readFile(argv.file)).toString();
  const encryptionMap: Record<string, EncryptionFunc> = {
    complete: completeEncryption,
    ini: iniEncryption,
  };
  const method = await encryptionMap[argv.format];
  if (!method) {
    display(
      `It appears the encryption method (${method}) is not supported. Please verify the encryption method and MDS CLI version.`,
    );
    return;
  }

  const pwdUtf = enc.Utf8.parse(pwd);
  const iv = enc.Base64.parse(pwd);
  const data = await method(fileData, pwdUtf, iv);

  const outData = JSON.stringify(
    {
      agent: 'mds cli',
      mode: argv.format,
      data,
    },
    null,
    2,
  );

  if (argv.inPlace) {
    await deleteFile(argv.file);
    await writeFile(argv.file, outData, { encoding: 'utf-8' });
    return;
  }

  if (await fileExists(argv.outFile)) {
    await deleteFile(argv.outFile);
  }
  await writeFile(argv.outFile, outData, { encoding: 'utf-8' });
  display('File encryption complete.');
}

interface Params {
  file: string;
  password: string | undefined;
  outFile: string | undefined;
  inPlace: boolean;
  format: string;
  env: string;
}

export const command = 'encrypt <file>';
export const describe = 'Encrypts the target file';
export const builder = extendBaseCommandBuilder({
  password: {
    type: 'string',
    desc: 'The password to use when encrypting the file.',
  },
  'out-file': {
    type: 'string',
    desc: 'The name of the output file if the "in-place" switch is not used',
  },
  'in-place': {
    type: 'boolean',
    default: false,
    desc: 'If true will replace the file being encrypted',
  },
  format: {
    default: 'complete',
    choices: ['complete', 'ini'],
    desc: `What file format the input is in. Determines how the file is decrypted.
    complete - encrypts the file as a single secure string. No processing is performed.
    ini - encrypts the file so ini keys are visible. Everything after the first equal is encrypted.`,
  },
});
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
