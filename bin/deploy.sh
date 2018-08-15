#!/bin/bash
# 1 :  chmod +x deploy.sh
# 2 : ./bin/deploy.sh

  git checkout master
  git stashgit fetch
  git reset --hard origin/master
  npm ci
