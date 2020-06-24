const { execSync } = require('child_process');
const path = require('path');

function build() {
  const core = path.resolve(__dirname, '..', '..', 'core');
  const bin = path.resolve(core, 'node_modules', '.bin', 'webpack');
  process.env.NODE_ENV = 'production';
  execSync(`${bin} -p --progress`, {
    cwd: core,
    stdio: 'inherit',
  });
}

module.exports = build;
