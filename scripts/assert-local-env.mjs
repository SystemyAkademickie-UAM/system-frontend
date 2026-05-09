/**
 * Run before Vite (dev / build / preview). Exits non-zero if `.env` is missing or required keys are empty.
 * @see ../.env.example
 */
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config as loadDotenv } from 'dotenv';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const FRONTEND_ROOT = resolve(SCRIPT_DIR, '..');
const DOT_ENV_FILE_NAME = '.env';
const envFilePath = join(FRONTEND_ROOT, DOT_ENV_FILE_NAME);

/** Must be set explicitly (no reliance on implicit empty `import.meta.env` at build time). */
const REQUIRED_KEYS = ['VITE_API_BASE_URL'];

function exitWith(message) {
  console.error(`[ENV] ${message}`);
  process.exit(1);
}

if (!existsSync(envFilePath)) {
  exitWith(
    `Missing ${DOT_ENV_FILE_NAME} in ${FRONTEND_ROOT}. Copy .env.example to .env and set VITE_API_BASE_URL (e.g. http://127.0.0.1:8080/api or your proxied origin + /api).`,
  );
}

const outcome = loadDotenv({ path: envFilePath });
if (outcome.error) {
  exitWith(`Cannot parse ${DOT_ENV_FILE_NAME}: ${outcome.error.message}`);
}

for (const key of REQUIRED_KEYS) {
  const value = process.env[key]?.trim() ?? '';
  if (value === '') {
    exitWith(`Missing or empty ${key} in ${DOT_ENV_FILE_NAME}.`);
  }
}
