#!/usr/bin/env node

const { execSync } = require('child_process');

execSync(
  'git checkout master',
  (err, data, stderr) => {
    console.log('Checkout master :\n\n', data);
  },
);

execSync(
  'git stash',
  (err, data, stderr) => {
    console.log('Stash :\n\n', data);
  },
);

execSync(
  'git fetch',
  (err, data, stderr) => {
    console.log('Fetch :\n\n', data);
  },
);

execSync(
  'git reset --hard origin/master',
  (err, data, stderr) => {
    console.log('Reset hard :\n\n', data);
  },
);

execSync(
  'rm -r ./node_modules',
  (err, data, stderr) => {
    console.log('\n\nRemoved node_modules\n');
  },
);

execSync(
  'npm ci',
  (err, data, stderr) => {
    console.log('\n\nNpm ci \n');
  },
);

execSync(
  'sequelize db:create',
  (err, data, stderr) => {
    console.log('\n\nDB create\n');
  },
);

execSync(
  'sequelize db:migrate',
  (err, data, stderr) => {
    console.log('\n\nMigrate db \n');
  },
);

execSync(
  'sequelize db:seed:all',
  (err, data, stderr) => {
    console.log('\n\nSeed for db \n');
  },
);
