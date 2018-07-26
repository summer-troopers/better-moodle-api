#!/usr/bin/env node
# To start this script, use this command:
# 1 :  chmod +x db-rebuild.sh
# 2 : ./bin/db-rebuild.sh

const { execSync } = require('child_process');

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
