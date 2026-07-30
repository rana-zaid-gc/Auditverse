#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "$0")" && pwd)"
echo "Starting API server..."
node --env-file "$DIR/server/.env" "$DIR/server/index.js" &
API_PID=$!
echo "Starting Astro dev server..."
npx astro dev --host --port 4321 &
ASTRO_PID=$!
trap "kill $API_PID $ASTRO_PID 2>/dev/null" EXIT
echo "API: http://localhost:3001   |   Site: http://localhost:4321"
wait
