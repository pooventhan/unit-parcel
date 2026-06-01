#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const webDistDir = path.join(rootDir, 'apps/web/dist');
const apiPublicDir = path.join(rootDir, 'apps/api/public');

// Remove existing public directory
if (fs.existsSync(apiPublicDir)) {
  fs.rmSync(apiPublicDir, { recursive: true });
  console.log('Removed existing public directory');
}

// Copy web dist to api public
fs.cpSync(webDistDir, apiPublicDir, { recursive: true });
console.log('✓ Copied web dist to api/public');
