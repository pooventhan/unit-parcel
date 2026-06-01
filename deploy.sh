#!/bin/bash
# Kudu custom deployment script for Azure App Service (Linux)
# The build is already done by GitHub Actions before this ZIP is deployed.
# This script just ensures Kudu doesn't attempt its own build.

set -e

echo "Deployment complete — build was handled by GitHub Actions."
echo "API entry point: apps/api/src/index.ts"
echo "Web build:       apps/api/public/"
