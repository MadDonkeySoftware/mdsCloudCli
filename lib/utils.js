const util = require('util');
const os = require('os');
const fs = require('fs');
const path = require('path');

const CONFIG_KEYS = ['qsUrl', 'smUrl'];

const settingDir = path.join(os.homedir(), '.mds');
const mkdir = util.promisify(fs.mkdir);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);

const display = (msg) => {
  process.stdout.write(`${msg}${os.EOL}`);
};

const getEnvConfig = (name, defaultIfNotExists = true) => {
  const file = path.join(settingDir, `${name}.json`);
  if (name && fs.existsSync(file)) {
    return readFile(file).then((body) => JSON.parse(body));
  }

  const defaultFile = path.join(settingDir, 'default.json');
  if (defaultIfNotExists && fs.existsSync(defaultFile)) {
    return readFile(defaultFile).then((body) => JSON.parse(body));
  }

  return Promise.resolve(null);
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

module.exports = {
  CONFIG_KEYS,
  display,
  saveEnvConfig,
  getEnvConfig,
};
