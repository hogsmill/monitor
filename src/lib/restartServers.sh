#!/bin/sh

ps -ef | grep node | grep server.js | while read SERVER
do
  PID=`echo $SERVER | cut -d' ' -f2`
  kill $PID
done
