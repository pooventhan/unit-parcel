#!/bin/bash

# Azure App Service startup script for unit-parcel with bundled Bun
set -e

echo "Starting unit-parcel application..."

# Ensure libatomic is installed (required by Bun)
if [ -f /etc/debian_version ]; then
  echo "Debian-based container detected. Ensuring libatomic1 is installed..."
  apt-get update && apt-get install -y libatomic1 || true
elif [ -f /etc/alpine-release ]; then
  echo "Alpine-based container detected. Ensuring libatomic is installed..."
  apk add --no-cache libatomic || true
else
  echo "Unknown container OS. Attempting generic package installation for libatomic..."
  apt-get update && apt-get install -y libatomic1 || apk add --no-cache libatomic || true
fi

# Get absolute directory of the script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
