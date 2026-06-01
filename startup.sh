#!/bin/bash

# Azure App Service startup script for unit-parcel

set -e

echo "Starting unit-parcel application..."

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing root dependencies..."
  bun install
fi

# Navigate to API directory
cd apps/api

# Install API dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing API dependencies..."
  bun install
fi

echo "Starting API server..."
# Use PORT environment variable provided by Azure (default to 3000 if not set)
PORT=${PORT:-3000}
bun src/index.ts
