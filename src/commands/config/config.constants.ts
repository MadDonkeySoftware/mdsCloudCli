export type EnvConfig = Record<string, string | boolean | undefined | null>;

const defaultTextSaveConverter = (value: string) => value;
const defaultTextDisplayConverter = (value: string) => value;

const defaultUrlSaveConverter = (value: string) => {
  try {
    new URL(value); // Validate the URL format
    return value;
  } catch {
    throw new Error(
      `"${value}" is not a valid URL. Please provide a valid URL.`,
    );
  }
};

export type EnvConfigElementMetadata = {
  key: string;
  display: string;
  promptType: 'text' | 'password';
  isUrl: boolean;
  displayOrder: number;
  saveConverter: (value: string) => string;
  displayConverter: (value: string) => string;
  queryPrompt: string;
} | {
  key: string;
  display: string;
  promptType: 'confirm';
  isUrl: boolean;
  displayOrder: number;
  saveConverter: (value: string | boolean) => boolean;
  displayConverter: (value: boolean) => string;
  queryPrompt: string;
};

export const ENV_CONFIG_ELEMENTS: EnvConfigElementMetadata[] = [
  {
    key: 'account',
    display: 'Account',
    promptType: 'text',
    isUrl: false,
    displayOrder: 1,
    saveConverter: defaultTextSaveConverter,
    displayConverter: defaultTextDisplayConverter,
    queryPrompt: `Enter your account identifier`,
  },
  {
    key: 'userId',
    display: 'User id',
    promptType: 'text',
    isUrl: false,
    displayOrder: 2,
    saveConverter: defaultTextSaveConverter,
    displayConverter: defaultTextDisplayConverter,
    queryPrompt: `Enter your user id`,
  },
  {
    key: 'password',
    display: 'Password',
    promptType: 'password',
    isUrl: false,
    displayOrder: 3,
    saveConverter: defaultTextSaveConverter,
    displayConverter: () => '***',
    queryPrompt: `Enter your password`,
  },
  {
    key: 'identityUrl',
    display: 'Identity service',
    promptType: 'text',
    isUrl: true,
    displayOrder: 4,
    saveConverter: defaultUrlSaveConverter,
    displayConverter: defaultTextDisplayConverter,
    queryPrompt: `Enter the identity service URL`,
  },
  {
    key: 'allowSelfSignCert',
    display: 'Allow self signed certificates',
    promptType: 'confirm',
    isUrl: false,
    displayOrder: 5,
    saveConverter: (value) =>
      ['true', 'yes', '1', 'on'].includes(value.toString().toLowerCase()),
    displayConverter: (value) => value ? 'Yes' : 'No',
    queryPrompt: `Allow self signed certificates?`,
  },
  {
    key: 'nsUrl',
    display: 'Notification service',
    promptType: 'text',
    isUrl: true,
    displayOrder: 6,
    saveConverter: defaultUrlSaveConverter,
    displayConverter: defaultTextDisplayConverter,
    queryPrompt: `Enter the notification service URL`,
  },
  {
    key: 'qsUrl',
    display: 'Queue service',
    promptType: 'text',
    isUrl: true,
    displayOrder: 7,
    saveConverter: defaultUrlSaveConverter,
    displayConverter: defaultTextDisplayConverter,
    queryPrompt: `Enter the queue service URL`,
  },
  {
    key: 'fsUrl',
    display: 'File service',
    promptType: 'text',
    isUrl: true,
    displayOrder: 8,
    saveConverter: defaultUrlSaveConverter,
    displayConverter: defaultTextDisplayConverter,
    queryPrompt: `Enter the file service URL`,
  },
  {
    key: 'sfUrl',
    display: 'Serverless function service',
    promptType: 'text',
    isUrl: true,
    displayOrder: 9,
    saveConverter: defaultUrlSaveConverter,
    displayConverter: defaultTextDisplayConverter,
    queryPrompt: `Enter the serverless function service URL`,
  },
  {
    key: 'smUrl',
    display: 'State machine service',
    promptType: 'text',
    isUrl: true,
    displayOrder: 10,
    saveConverter: defaultUrlSaveConverter,
    displayConverter: defaultTextDisplayConverter,
    queryPrompt: `Enter the state machine service URL`,
  },
];
