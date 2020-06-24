const path = require('path');
const fs = require('fs');

function config() {
  const project = process.env.PROJECT;

  const configPath = path.resolve(project, 'rally.js');
  /* eslint-disable no-undef */
  const content = fs.existsSync(configPath) ? __non_webpack_require__(configPath) : {};
  /* eslint-enable */
  return content;
}

module.exports = config;
