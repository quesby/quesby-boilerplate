#!/usr/bin/env node

/**
 * Quesby CLI: Post Generator
 * 
 * Creates new blog posts with ULID and proper folder structure.
 * 
 * Usage:
 *   - npx quesby new post "My Title"
 *   - npx quesby post "My Title"
 *   - npx quesby create post "My Title"
 * 
 * Flags:
 *   --draft
 *   --category="Category Name"
 *   --author="Author Name"
 *   --date="YYYY-MM-DD"
 */

import fs from 'fs';
import path from 'path';
import {
  ULID,
  generateSlug,
  getCurrentDate,
  parseDate,
  log,
  logInfo,
  logError,
  logSuccess,
  findProjectRoot,
  loadConfig,
  ensureDir,
  escapeYamlString
} from './quesby-cli-utils.js';
import { parseArgs } from './cli-args.js';

/**
 * Create front matter template for blog posts
 * All strings are properly quoted and YAML-safe
 */
function createPostFrontMatter(options) {
  const {
    ulid,
    title,
    slug,
    date,
    author = '',
    category = '',
    description = '',
    image = '',
    draft = false,
    tags = [],
    aliases = []
  } = options;

  return `---
id: ${ulid}
title: ${escapeYamlString(title)}
slug: ${escapeYamlString(slug)}
description: ${escapeYamlString(description)} # fill manually
date: ${escapeYamlString(date)}
author: ${escapeYamlString(author)}
image: ${escapeYamlString(image)} # fill manually
category: ${escapeYamlString(category)}
tags: ${JSON.stringify(tags)}
draft: ${draft}
aliases: ${JSON.stringify(aliases)}
---

Write your content here...
`;
}

/**
 * Main function to create new post
 */
function createNewPost(title, flags = {}, config = {}) {
  if (!title || title.trim() === '') {
    logError('Title is required');
    log('\nUsage:', 'yellow');
    log('  npx quesby new post "My Title"');
    log('  npx quesby post "My Title"');
    log('  npx quesby create post "My Title"');
    log('\nFlags:', 'yellow');
    log('  --draft');
    log('  --category="Category Name"');
    log('  --author="Author Name"');
    log('  --date="YYYY-MM-DD"');
    process.exit(1);
  }

  const projectRoot = findProjectRoot();
  const trimmedTitle = title.trim();
  const ulid = ULID.generate();
  const slug = generateSlug(trimmedTitle);

  // Use date from flag, config, or current date
  const date = flags.date ? parseDate(flags.date) : getCurrentDate();
  const author = flags.author || config.defaultAuthor || '';
  const category = flags.category || config.defaultCategory || '';
  const draft = flags.draft === true || flags.draft === 'true' || config.defaultDraft || false;

  // Build paths based on config
  const contentDir = path.join(projectRoot, config.contentDir || 'src/content');
  const postsDir = path.join(contentDir, config.postsDir || 'posts');
  const folderName = `${ulid}--${slug}`;
  const postDir = path.join(postsDir, folderName);
  const indexPath = path.join(postDir, 'index.md');

  logInfo(`Creating new post: "${trimmedTitle}"`);
  logInfo(`ULID: ${ulid}`);
  logInfo(`Slug: ${slug}`);

  try {
    // Ensure directories exist (create if missing)
    const created = ensureDir(postsDir);
    if (created) {
      logInfo(`Created posts directory: ${postsDir}`);
    }

    // Check if folder already exists
    if (fs.existsSync(postDir)) {
      logError(`Post folder already exists: ${folderName}`);
      log(`Location: ${postDir}`, 'yellow');
      process.exit(1);
    }

    // Create post directory
    fs.mkdirSync(postDir, { recursive: true });

    // Create front matter and content
    const content = createPostFrontMatter({
      ulid,
      title: trimmedTitle,
      slug,
      date,
      author,
      category,
      draft
    });

    // Write index.md file with UTF-8 encoding
    fs.writeFileSync(indexPath, content, { encoding: 'utf8' });

    logSuccess('Post created successfully!');
    log(`📁 Location: ${postDir}`, 'cyan');
    log(`📝 File: ${indexPath}`, 'cyan');
    log(`🔗 URL: /blog/${slug}/`, 'cyan');

  } catch (error) {
    logError(`Failed to create post: ${error.message}`);
    // Don't print stack trace for user-friendly errors
    if (error.code === 'ENOENT') {
      log(`Directory not found: ${error.path}`, 'yellow');
    }
    process.exit(1);
  }
}

// Handle command line arguments
(async () => {
  const args = process.argv.slice(2);
  const parsed = parseArgs(args);

  // Check if this is a post command
  if (parsed.subcommand !== 'post') {
    // Delegate to new-project.js if subcommand is "project"
    if (parsed.subcommand === 'project') {
      try {
        const { createNewProject } = await import('./new-project.js');
        const projectRoot = findProjectRoot();
        const config = loadConfig(projectRoot);
        
        if (!parsed.title) {
          logError('Title is required');
          log('\nUsage:', 'yellow');
          log('  npx quesby new project "My Project"');
          log('  npx quesby project "My Project"');
          log('  npx quesby create project "My Project"');
          process.exit(1);
        }
        
        createNewProject(parsed.title, parsed.flags, config);
        return;
      } catch (error) {
        logError(`Failed to load project generator: ${error.message}`);
        process.exit(1);
      }
    }
    
    // Show help if no valid command
    if (args.length === 0 || (parsed.command && parsed.subcommand !== 'post')) {
      log('Quesby CLI - Content Generator', 'bright');
      log('\nUsage:');
      log('  npx quesby new post "My Title"');
      log('  npx quesby new project "My Project"');
      log('  npx quesby post "My Title"');
      log('  npx quesby project "My Project"');
      log('\nFlags:');
      log('  --draft                    Mark as draft');
      log('  --category="Category"      Set category');
      log('  --author="Author Name"     Set author (posts only)');
      log('  --date="YYYY-MM-DD"        Set publication date');
      log('\nExamples:');
      log('  npx quesby new post "Getting Started" --category="Tutorial"');
      log('  npx quesby new project "My Project" --draft');
      process.exit(0);
    }
    
    // Not a recognized command, exit silently
    process.exit(0);
  }

  // Load config
  const projectRoot = findProjectRoot();
  const config = loadConfig(projectRoot);

  // Validate title
  if (!parsed.title) {
    logError('Title is required');
    log('\nUsage:', 'yellow');
    log('  npx quesby new post "My Title"');
    log('  npx quesby post "My Title"');
    log('  npx quesby create post "My Title"');
    process.exit(1);
  }

  // Create the post
  createNewPost(parsed.title, parsed.flags, config);
})();
