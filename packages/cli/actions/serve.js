const { execSync } = require('child_process');
const path = require('path');

function serve() {
  const core = path.resolve(__dirname, '..', '..', 'core');
  const bin = path.resolve(core, 'node_modules', '.bin', 'webpack');
  execSync(`${bin} --watch --progress --info-verbosity none`, {
    cwd: core,
    stdio: 'inherit',
  });
}

module.exports = serve;
