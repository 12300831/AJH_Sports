#!/bin/bash
# Script to kill process using port 5001 (or specified port)

PORT=${1:-5001}
PID=$(lsof -ti:$PORT)

if [ -z "$PID" ]; then
  echo "✅ No process found using port $PORT"
else
  echo "🔍 Found process $PID using port $PORT"
  kill -9 $PID
  echo "✅ Killed process $PID"
fi


