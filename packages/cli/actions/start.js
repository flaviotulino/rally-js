const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

function start() {
  const exe = path.resolve(process.env.PROJECT, 'dist', 'server.js');

  if (!fs.existsSync(exe)) {
    console.error('Executable not found. Build the project first');
    process.exit(-1);
  }

  execSync(`node ${exe}`, {
    stdio: 'inherit',
  });
}

module.exports = start;
