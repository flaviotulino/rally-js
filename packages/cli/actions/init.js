const fs = require('fs-extra');
const klaw = require('klaw-sync');
const path = require('path');
const ejs = require('ejs');
const { execSync } = require('child_process');

function init(name, { force, skipInstall }) {
  const project = path.join(process.env.PROJECT, name);

  if (!force && fs.existsSync(project)) {
    console.log(`A folder called ${name} already exists. Provide --force or -f to override`);
    process.exit(-1);
  }

  if (force) {
    console.log('Using --force.');
  }

  fs.ensureDirSync(project);

  const app = path.resolve(__dirname, '..', 'templates', 'app');

  const files = klaw(app, { nodir: true });
  files.forEach((file) => {
    const content = ejs.render(fs.readFileSync(file.path, 'utf-8'), { name });

    const destinationTemplate = path.join(project, path.relative(app, file.path));
    const destination = path.resolve(process.env.PROJECT, destinationTemplate.replace(/\.ejs$/, ''));

    fs.ensureFileSync(destination);
    fs.writeFileSync(destination, content);
  });

  if (!skipInstall) {
    console.log('Adding dependencies');

    execSync('npm install @rally-js/core', { cwd: project, stdio: 'inherit' });
    // execSync('npm install @rally-js/cli --save-dev', { cwd: project, stdio: 'inherit' });
  }

  console.log(`Project created! Run cd ${name} and enjoy!`);
}

module.exports = init;
