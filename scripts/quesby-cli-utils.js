#!/usr/bin/env node

/**
 * Shared utilities for Quesby CLI scripts.
 */

import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { existsSync } from 'fs';

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

/**
 * Find project root by climbing up until package.json is found
 */
export function findProjectRoot(startDir = __dirname) {
  let current = path.resolve(startDir);
  const root = path.parse(current).root;

  while (current !== root) {
    const packageJsonPath = path.join(current, 'package.json');
    if (existsSync(packageJsonPath)) {
      return current;
    }
    current = path.dirname(current);
  }

  // Fallback to scripts parent if no package.json found
  return path.resolve(__dirname, '..');
}

/**
 * Monotonic ULID implementation (ULID spec compliant)
 * Ensures uniqueness even when called multiple times in the same millisecond
 */
export class ULID {
  static #lastTime = 0;
  static #lastRandom = null;

  static #alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

  static #encodeTime(time, len = 10) {
    let str = '';
    while (len > 0) {
      str = this.#alphabet[time % 32] + str;
      time = Math.floor(time / 32);
      len--;
    }
    return str;
  }

  static #generateRandom() {
    // Generate 16 random bytes (0-31 range for base32)
    const random = new Array(16);
    for (let i = 0; i < 16; i++) {
      random[i] = Math.floor(Math.random() * 32);
    }
    return random;
  }

  static #incrementRandom() {
    // Increment the random part (monotonic within same millisecond)
    for (let i = 15; i >= 0; i--) {
      if (this.#lastRandom[i] < 31) {
        this.#lastRandom[i]++;
        break;
      } else {
        this.#lastRandom[i] = 0;
      }
    }
  }

  static generate() {
    const timestamp = Date.now();

    if (timestamp === this.#lastTime) {
      // Same millisecond: increment random part
      if (this.#lastRandom === null) {
        this.#lastRandom = this.#generateRandom();
      } else {
        this.#incrementRandom();
      }
    } else {
      // New millisecond: generate new random part
      this.#lastTime = timestamp;
      this.#lastRandom = this.#generateRandom();
    }

    const timePart = this.#encodeTime(timestamp);
    const randomPart = this.#lastRandom.map(i => this.#alphabet[i]).join('');

    return timePart + randomPart;
  }
}

/**
 * Color system with auto-disable for pipes and non-TTY terminals
 */
class Colors {
  static #enabled = null;

  static #checkEnabled() {
    if (this.#enabled !== null) return this.#enabled;

    // Check if stdout is TTY and not piped
    const isTTY = process.stdout.isTTY;
    const hasNoColor = process.env.NO_COLOR || process.env.CI === 'true';
    
    this.#enabled = isTTY && !hasNoColor;
    return this.#enabled;
  }

  static reset = '\x1b[0m';
  static bright = '\x1b[1m';
  static red = '\x1b[31m';
  static green = '\x1b[32m';
  static yellow = '\x1b[33m';
  static blue = '\x1b[34m';
  static magenta = '\x1b[35m';
  static cyan = '\x1b[36m';

  static wrap(message, color) {
    if (!this.#checkEnabled()) {
      return message;
    }
    return `${color}${message}${this.reset}`;
  }
}

export function log(message, color = 'reset') {
  const colorCode = Colors[color] || Colors.reset;
  console.log(Colors.wrap(message, colorCode));
}

export function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

export function logError(message) {
  log(`❌ ${message}`, 'red');
}

export function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Generate slug from title
 */
export function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

/**
 * Get current date in ISO format
 */
export function getCurrentDate() {
  return new Date().toISOString();
}

/**
 * Parse date string (YYYY-MM-DD) to ISO format
 */
export function parseDate(dateStr) {
  if (!dateStr) return getCurrentDate();
  
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) {
      return getCurrentDate();
    }
    return date.toISOString();
  } catch {
    return getCurrentDate();
  }
}

/**
 * Load project config from .quesbyrc.json
 */
export function loadConfig(projectRoot) {
  const configPath = path.join(projectRoot, '.quesbyrc.json');
  
  const defaults = {
    contentDir: 'src/content',
    postsDir: 'posts',
    defaultAuthor: '',
    defaultCategory: '',
    defaultDraft: false
  };

  if (!existsSync(configPath)) {
    return defaults;
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    const config = JSON.parse(configContent);
    
    return {
      ...defaults,
      ...config
    };
  } catch (error) {
    // Silently fallback to defaults if config is invalid
    return defaults;
  }
}

/**
 * Ensure directory exists, create if missing
 */
export function ensureDir(dirPath) {
  if (!existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    return true;
  }
  return false;
}

/**
 * Escape YAML string (simple quote wrapper)
 */
export function escapeYamlString(str) {
  if (str === null || str === undefined) return '""';
  return JSON.stringify(String(str));
}
