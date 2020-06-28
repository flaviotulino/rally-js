#!/usr/bin/env node
const { program } = require('commander');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const serve = require('./actions/serve');
const build = require('./actions/build');
const start = require('./actions/start');
const init = require('./actions/init');

process.env.PROJECT = process.cwd();

program
  .command('serve')
  .action(serve);

program
  .command('build')
  .action(build);

program
  .command('start')
  .action(start);

program
  .command('init <name>')
  .option('-f, --force')
  .option('-s, --skipInstall')
  .action(init);

program
  .command('new <type> <name>')
  .alias('n')
  .action((type, name) => {
    switch (type) {
      case 'controller': {
        const file = fs.readFileSync(path.resolve(__dirname, 'templates', `${type}.ejs`), 'utf-8');
        const content = ejs.render(file, { name });
        const destination = path.resolve(process.env.PROJECT, 'src', 'controllers', `${name}.js`);
        fs.writeFileSync(destination, content);
        break;
      }

      default: break;
    }
  });

program.parse(process.argv);
