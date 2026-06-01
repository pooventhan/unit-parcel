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

# Get absolute directory of the script and add its bin folder to PATH
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PATH="$SCRIPT_DIR/bin:$PATH"

if [ -f "$SCRIPT_DIR/bin/bun" ]; then
  chmod +x "$SCRIPT_DIR/bin/bun"
  echo "Using bundled Bun runtime, version: $(bun --version)"
else
  echo "Error: Bundled Bun binary not found at $SCRIPT_DIR/bin/bun!"
  exit 1
fi

# Navigate to API directory
cd "$SCRIPT_DIR/apps/api"

echo "Starting API server..."
# Use PORT environment variable provided by Azure (default to 3000 if not set)
PORT=${PORT:-3000}
exec bun src/index.ts
