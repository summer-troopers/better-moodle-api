#!/bin/bash
# 1 :  chmod +x rebuild.db.sh
# 2 : ./bin/rebuild.db.sh

sequelize db:drop
sequelize db:create
sequelize db:migrate
sequelize db:seed:all
