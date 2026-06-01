#!/bin/bash

# Azure App Service startup script for unit-parcel with bundled Bun
set -e

echo "Starting unit-parcel application..."

# Ensure libatomic is installed (required by Bun)
if [ -f /etc/debian_version ]; then

export BUN_INSTALL=/home/site/wwwroot/.bun
export PATH="$BUN_INSTALL/bin:/home/site/wwwroot/node_modules/.bin:$PATH"
export NODE_PATH="/home/site/wwwroot/node_modules"
if [ ! -f "$BUN_INSTALL/bin/bun" ]; then
  echo "Bun not found. Installing..."
  curl -fsSL https://bun.sh/install | bash
else
  echo "Bun already installed at $BUN_INSTALL"
fi
echo "Using Bun version:"
bun --version
echo "Running bun install ..."
bun install

# Navigate to API directory
cd "$SCRIPT_DIR/apps/api"

echo "Starting API server..."
# Use PORT environment variable provided by Azure (default to 3000 if not set)
PORT=${PORT:-3000}
exec bun src/index.ts
