const _ = require('lodash');
const utils = require('../../../lib/utils');

const handle = (key, env) => {
  if (key !== 'all' && !_.find(utils.CONFIG_ELEMENTS, (e) => e.key === key)) {
    return Promise.resolve(utils.display(
      `"${key}" key not understood. Expected: ${_.map(utils.CONFIG_ELEMENTS, 'key').join(', ')}`));
  }

  return utils.getEnvConfig(env)
    .then((settings) => {
      if (key === 'all') {
        const rows = [];
        const configElements = _.sortBy(utils.CONFIG_ELEMENTS, 'displayOrder');
        configElements.forEach((e) => {
          let value;
          if (e.key === 'password') {
            value = settings[e.key] ? '***' : '';
          } else {
            value = settings[e.key] || '';
          }
          rows.push([e.display, value]);
        });
        utils.displayTable(rows, ['Setting', 'Value']);
      } else {
        utils.display(settings[key] || `It appears "${key}" is not present in the ${env} config.`);
      }
    });
};

exports.command = 'inspect <key>';
exports.desc = `Inspects a config detail. Valid keys: ${[..._.map(utils.CONFIG_ELEMENTS, 'key'), 'all'].join(', ')}`;
exports.builder = utils.extendBaseCommandBuilder();
exports.handler = (argv) => handle(argv.key, argv.env);
