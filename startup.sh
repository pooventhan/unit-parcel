#!/bin/bash

# Azure App Service startup script for unit-parcel

set -e

echo "Starting unit-parcel application..."

# Install Bun if not already installed
if ! command -v bun &> /dev/null; then
  echo "Installing Bun runtime..."
  curl -fsSL https://bun.sh/install | bash
  export PATH="$PATH:$HOME/.bun/bin"
fi

# Install root dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing root dependencies..."
  bun install
fi

# Navigate to API directory
cd apps/api

# Install API dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing API dependencies..."
  bun install --production
fi

echo "Starting API server..."
# Use PORT environment variable provided by Azure (default to 3000 if not set)
PORT=${PORT:-3000}
exec bun src/index.ts
