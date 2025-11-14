#!/usr/bin/env node

/**
 * Quesby CLI: New Post Generator
 * 
 * Creates a new blog post with ULID and proper folder structure
 * Usage: npx quesby new post "My Title"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ULID implementation (copied from ulid-widget.js)
class ULID {
  static encodeTime(time, len = 10) {
    const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    let str = '';
    while (len > 0) {
      str = alphabet[time % 32] + str;
      time = Math.floor(time / 32);
      len--;
    }
    return str;
  }

  static encodeRandom(len = 16) {
    const alphabet = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
    let str = '';
    for (let i = 0; i < len; i++) {
      str += alphabet[Math.floor(Math.random() * 32)];
    }
    return str;
  }

  static generate() {
    const timestamp = Date.now();
    const timePart = this.encodeTime(timestamp);
    const randomPart = this.encodeRandom();
    return timePart + randomPart;
  }
}

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

/**
 * Generate slug from title
 */
function generateSlug(title) {
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
function getCurrentDate() {
  return new Date().toISOString();
}

/**
 * Create front matter template
 */
function createFrontMatter(ulid, title, slug, date) {
  return `---
id: ${ulid}
title: "${title}"
slug: ${slug}
description: ""
date: ${date}
author: ""
image: ""
category: ""
tags: []
draft: false
aliases: []
---

Write your content here...
`;
}

/**
 * Main function to create new post
 */
function createNewPost(title) {
  if (!title || title.trim() === '') {
    logError('Title is required');
    log('Usage: npx quesby new post "My Title"', 'yellow');
    process.exit(1);
  }

  const trimmedTitle = title.trim();
  const ulid = ULID.generate();
  const slug = generateSlug(trimmedTitle);
  const date = getCurrentDate();
  
  // Create folder name in format: ULID--slug
  const folderName = `${ulid}--${slug}`;
  const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');
  const postDir = path.join(postsDir, folderName);
  const indexPath = path.join(postDir, 'index.md');

  logInfo(`Creating new post: "${trimmedTitle}"`);
  logInfo(`ULID: ${ulid}`);
  logInfo(`Slug: ${slug}`);
  logInfo(`Folder: ${folderName}`);

  try {
    // Check if posts directory exists
    if (!fs.existsSync(postsDir)) {
      logError(`Posts directory not found: ${postsDir}`);
      process.exit(1);
    }

    // Check if folder already exists
    if (fs.existsSync(postDir)) {
      logError(`Post folder already exists: ${folderName}`);
      process.exit(1);
    }

    // Create post directory
    fs.mkdirSync(postDir, { recursive: true });

    // Create front matter and content
    const content = createFrontMatter(ulid, trimmedTitle, slug, date);

    // Write index.md file
    fs.writeFileSync(indexPath, content, 'utf8');

    logSuccess(`Post created successfully!`);
    log(`📁 Location: ${postDir}`, 'cyan');
    log(`📝 File: ${indexPath}`, 'cyan');
    log(`🔗 URL: /blog/${slug}/`, 'cyan');

  } catch (error) {
    logError(`Failed to create post: ${error.message}`);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] !== 'new' || args[1] !== 'post') {
  log('Quesby CLI - New Post Generator', 'bright');
  log('\nUsage:');
  log('  npx quesby new post "My Title"');
  log('\nExample:');
  log('  npx quesby new post "Getting Started with Quesby"');
  process.exit(0);
}

if (args.length < 3) {
  logError('Title is required');
  log('Usage: npx quesby new post "My Title"', 'yellow');
  process.exit(1);
}

// Extract title from arguments (handle quotes)
const titleArg = args.slice(2).join(' ');
const title = titleArg.replace(/^["']|["']$/g, ''); // Remove surrounding quotes

createNewPost(title);
