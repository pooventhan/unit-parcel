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

if [ ! -f "$BUN_INSTALL/bin/bun" ]; then
  echo "Bun not found. Installing..."
  curl -fsSL https://bun.sh/install | bash
else
  echo "Bun already installed at $BUN_INSTALL"
fi

echo "Using Bun version:"
bun --version

# Clean up any pre-existing or corrupted node_modules to avoid symlink/hardlink mismatch across environments
echo "Cleaning existing node_modules to ensure a fresh, clean installation..."
rm -rf node_modules apps/api/node_modules apps/web/node_modules

# Remove root package.json and bun.lock inside the container to prevent Bun from treating this as a workspace
echo "Bypassing workspace configuration inside the container..."
rm -f package.json bun.lock

# Navigate to API directory
cd "$SCRIPT_DIR/apps/api"

echo "Running clean, standalone bun install with copyfile backend..."
bun install --production --backend copyfile

echo "Starting API server..."
# Use PORT environment variable provided by Azure (default to 3000 if not set)
PORT=${PORT:-3000}
exec bun src/index.ts
