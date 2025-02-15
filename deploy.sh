#!/bin/bash

FORCE=false
NEW=false
while [ $1 ]
do
  echo $1
  if [ "$1" == "-f" ]; then
    FORCE=true
  fi
  shift
done

rm package-lock.json
rm -rf node_modules

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
if [ ! -d /var/www/html/agilesimulations/$APP/ ]; then
  mkdir /var/www/html/agilesimulations/$APP
fi
if [ -d /var/www/html/agilesimulations/$APP/css ]; then
  rm /var/www/html/agilesimulations/$APP/css/*
else
  mkdir /var/www/html/agilesimulations/$APP/css
fi
if [ -d /var/www/html/agilesimulations/$APP/js ]; then
  rm /var/www/html/agilesimulations/$APP/js/*
else
  mkdir /var/www/html/agilesimulations/$APP/js
fi

cp -R dist/* /var/www/html/agilesimulations/$APP
if [ -f "src/server.js" ]; then
  SERVER=`ps -ef | grep server.js | grep $PORT | awk {'print $2'}`
  if [ "$SERVER" != "" ]; then
    kill $SERVER
  fi
fi

rm -rf node_modules/.cache
rm -rf dist

ps -ef | grep php | grep outdated
if [ $? -eq 1 ]; then
  php /usr/apps/monitor/src/lib/outdated.php &
fi

exit 0
