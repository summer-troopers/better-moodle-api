#!/usr/bin/env node
# To start this script, use this command:
# 1 :  chmod +x deploy.sh
# 2 : ./bin/deploy.sh

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
  'npm ci',
  (err, data, stderr) => {
    console.log('\n\nNpm ci \n');
  },
);
