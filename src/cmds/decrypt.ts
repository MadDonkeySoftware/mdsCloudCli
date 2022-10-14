import { EOL } from 'os';
import { AES, enc } from 'crypto-js';
import { ArgumentsCamelCase } from 'yargs';
import { readFile, writeFile, unlink as deleteFile } from 'fs/promises';
import { display, extendBaseCommandBuilder } from '../utils';
import { fileExists } from '../utils/file-exists';

// TODO: make type for these functions?
async function completeDecryption(inData, pwd, iv) {
  return AES.decrypt(inData, pwd, { iv }).toString(enc.Utf8);
}

async function iniDecryption(inData, pwd, iv) {
  const outLines = [];
  const keys = Object.keys(inData);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const val = inData[key];
    outLines.push(`${key}=${AES.decrypt(val, pwd, { iv }).toString(enc.Utf8)}`);
  }

  // TODO: This should probably match the files EOL, not the system.
  return outLines.join(EOL);
}

const handle = async (argv: ArgumentsCamelCase<Params>) => {
  display(
    'WARNING: Encryption/Decryption is experimental. Use at your own risk.',
  );
  const pwd: string | undefined =
    argv.password || process.env.MDS_CLI_CRYPTO_PWD;

  if (!pwd) {
    display(
      'Password is required. Use password flag or MDS_CLI_CRYPTO_PWD environment variable',
    );
    return;
  }

  if (!argv.inPlace && !argv.outFile) {
    display(
      'Must use in-place flag or provide a out-file name. Cannot perform action.',
    );
    return;
  }

  const fileData = JSON.parse((await readFile(argv.file)).toString());
  const encryptionMap = {
    complete: completeDecryption,
    ini: iniDecryption,
  };
  const method = encryptionMap[fileData.mode];
  if (!method) {
    display(
      `It appears the encryption method (${method}) is not supported. please verify the encryption method and MDS CLI version.`,
    );
    return;
  }

  const pwdUtf = enc.Utf8.parse(pwd);
  const iv = enc.Base64.parse(pwd);
  const data = await method(fileData.data, pwdUtf, iv);

  if (argv.inPlace) {
    await deleteFile(argv.file);
    await writeFile(argv.file, data, { encoding: 'utf-8' });
    return;
  }

  if (await fileExists(argv.outFile)) {
    await deleteFile(argv.outFile);
  }
  await writeFile(argv.outFile, data, { encoding: 'utf-8' });
  display('File decryption complete.');
};

interface Params {
  file: string;
  password: string | undefined;
  inPlace: boolean;
  outFile: string | undefined;
  env: string;
}

export const command = 'decrypt <file>';
export const describe = 'Decrypts the target file';
export const builder = extendBaseCommandBuilder({
  password: {
    type: 'string',
    desc: 'The password to use when decrypting the file.',
  },
  'out-file': {
    type: 'string',
    desc: 'The name of the output file if the "in-place" switch is not used',
  },
  'in-place': {
    type: 'boolean',
    default: false,
    desc: 'If true will replace the file being decrypted',
  },
});
export const handler = (argv: ArgumentsCamelCase<Params>) => handle(argv);
