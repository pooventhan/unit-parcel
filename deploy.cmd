@echo off
REM Deployment batch script for unit-parcel
REM Build and dependencies are already handled by GitHub Actions

REM Set working directory
cd /d "%~dp0"

echo Verifying deployment structure...

REM Check if API directory exists and has necessary files
if not exist "apps\api\src\index.ts" (
  echo ERROR: API entry point not found
  exit /b 1
)

if not exist "apps\api\public\index.html" (
  echo ERROR: Web build output not found
  exit /b 1
)

echo Deployment verified successfully.
echo The application will start with: npm start (which runs: cd apps/api && bun src/index.ts)
