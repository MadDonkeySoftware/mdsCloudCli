const util = require('util');
const os = require('os');
const fs = require('fs');
const path = require('path');
const Table = require('cli-table');
const _ = require('lodash');

const envFileName = 'selectedEnv';

const CONFIG_KEYS = ['account', 'identity', 'qsUrl', 'smUrl', 'fsUrl', 'nsUrl', 'sfUrl'];
const CONFIG_KEY_DESCRIPTIONS = {
  account: 'account',
  identity: 'identity service',
  qsUrl: 'queue service',
  smUrl: 'state machine service',
  fsUrl: 'file service',
  nsUrl: 'notification service',
  sfUrl: 'serverless function service',
};

const inProcCache = {};

const settingDir = path.join(os.homedir(), '.mds');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readdir = util.promisify(fs.readdir);

const display = (msg, suppressEol) => {
  process.stdout.write(`${msg}`);

  if (!suppressEol) {
    process.stdout.write(os.EOL);
  }
};

const getEnvConfigSync = (name) => {
  const cacheKey = `getEnvConfig-${name}`;
  const cacheVal = inProcCache[cacheKey];
  if (cacheVal) {
    return cacheVal;
  }

  const file = path.join(settingDir, `${name}.json`);
  if (name && fs.existsSync(file)) {
    const body = fs.readFileSync(file);
    inProcCache[cacheKey] = JSON.parse(body);
    return inProcCache[cacheKey];
  }

  return null;
};

const getEnvConfig = (name) => {
  const cacheKey = `getEnvConfig-${name}`;
  const cacheVal = inProcCache[cacheKey];
  if (cacheVal) {
    return Promise.resolve(cacheVal);
  }

  return new Promise((resolve) => {
    const config = getEnvConfigSync(name);
    resolve(config);
  });
};

const mergeSetting = (target, source) => {
  const result = { ...target };

  CONFIG_KEYS.forEach((key) => {
    if (source[key]) {
      result[key] = source[key];
    }
  });

  return result;
};

const saveEnvConfig = (name, settings = { qsUrl: null, smUrl: null }) => {
  const file = path.join(settingDir, `${name}.json`);

  return mkdir(settingDir, { recursive: true })
    .then(() => getEnvConfig(name, false))
    .then((conf) => mergeSetting(conf, settings))
    .then((newSettings) => writeFile(file, JSON.stringify(newSettings, null, '\t')));
};

const setDefaultEnv = (name) => {
  const file = path.join(settingDir, envFileName);

  return mkdir(settingDir, { recursive: true })
    .then(() => writeFile(file, name));
};

const listEnvs = () => readdir(settingDir)
  .then((files) => files.filter((file) => path.extname(file).toLowerCase() === '.json'))
  .then((files) => _.map(files, (file) => file.split('.')[0]))
  .then((envs) => envs || ['default']);

const getDefaultEnv = () => {
  const cacheKey = 'getDefaultEnv';
  const cacheVal = inProcCache[cacheKey];
  if (cacheVal) {
    return cacheVal;
  }

  const file = path.join(settingDir, envFileName);
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file);
    if (data) {
      // Trim just in case the file was edited by the user.
      inProcCache[cacheKey] = data.toString().trim();
      return inProcCache[cacheKey];
    }
  }

  return 'default';
};

const getDefaultAccount = () => {
  const cacheKey = 'getDefaultAccount';
  const cacheVal = inProcCache[cacheKey];
  if (cacheVal) {
    return cacheVal;
  }

  const conf = getEnvConfigSync(getDefaultEnv());
  inProcCache[cacheKey] = conf.account || '-1';
  return inProcCache[cacheKey];
};

const extendBaseCommandBuilder = (options) => {
  const base = {
    env: {
      default: getDefaultEnv(),
      desc: 'The environment to write this value to',
    },
    account: {
      default: getDefaultAccount(),
      desc: 'The account to use when making requests',
    },
  };
  return _.assign({}, base, options);
};

const stringifyForDisplay = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value, null, 2);
  }

  return value;
};

const displayTable = (rows, headers = []) => {
  const table = new Table({
    head: headers,
    chars: {
      top: '',
      'top-mid': '',
      'top-left': '',
      'top-right': '',
      bottom: '',
      'bottom-mid': '',
      'bottom-left': '',
      'bottom-right': '',
      left: '',
      'left-mid': '',
      mid: '',
      'mid-mid': '',
      right: '',
      'right-mid': '',
      middle: ' ',
    },
    style: { 'padding-left': 0, 'padding-right': 0 },
  });

  rows.forEach((e) => table.push(e));

  display(table.toString());
};

module.exports = {
  CONFIG_KEYS,
  CONFIG_KEY_DESCRIPTIONS,
  display,
  saveEnvConfig,
  getEnvConfig,
  setDefaultEnv,
  listEnvs,
  displayTable,
  stringifyForDisplay,
  extendBaseCommandBuilder,
};
