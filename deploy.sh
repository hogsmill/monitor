#!/bin/bash

FORCE=false
OUTDATED=true
while [ $1 ]
do
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  if [ "$1" == "-o" ]; then
    OUTDATED=false
  fi
  shift
done

PORT=3012
PWD=`pwd`
APP=`basename $PWD`
git stash
GIT=`git pull`
echo $GIT
if [ "$FORCE" != "true" -a "$GIT" == "Already up to date." ]; then
  exit 0
fi

npm install
npm run build
rm /var/www/html/$APP/css/*
rm /var/www/html/$APP/js/*
cp -R dist/* /var/www/html/$APP
if [ -f "src/server.js" ]; then
  SERVER=`ps -ef | grep server.js | grep $PORT | awk {'print $2'}`
  if [ "$SERVER" != "" ]; then
    kill $SERVER
  fi
fi

if [ "$OUTDATED" == "true" ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi
