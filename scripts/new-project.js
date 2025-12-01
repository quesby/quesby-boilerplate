#!/usr/bin/env node

/**
 * Quesby CLI: Project Generator
 *
 * Creates new projects with ULID and proper folder structure.
 *
 * Usage:
 *   - npx quesby new project "My Project"
 *   - npx quesby project "My Project"
 *   - npx quesby create project "My Project"
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

/**
 * Create front matter template for projects
 * All strings are properly quoted and YAML-safe
 */
function createProjectFrontMatter(options) {
  const {
    ulid,
    title,
    slug,
    date,
    projecttype = '',
    subtitle = '',
    description = '',
    category = '',
    client = '',
    image = '',
    draft = false,
    tags = [],
    gallery = [],
    technologies = [],
    features = [],
    overview = '',
    technical = '',
    completedOn = '',
    demoUrl = '',
    sourceUrl = '',
    link = ''
  } = options;

  return `---
id: ${ulid}
projecttype: ${escapeYamlString(projecttype)}
draft: ${draft}

title: ${escapeYamlString(title)}
subtitle: ${escapeYamlString(subtitle)}
slug: ${escapeYamlString(slug)}

description: ${escapeYamlString(description)} # fill manually

date: ${escapeYamlString(date)}

image: ${escapeYamlString(image)} # fill manually
gallery: ${JSON.stringify(gallery)}

category: ${escapeYamlString(category)}
tags: ${JSON.stringify(tags)}

client: ${escapeYamlString(client)}

technologies: ${JSON.stringify(technologies)}

features: ${JSON.stringify(features)}

overview: >
  ${overview || 'Write your project overview here.'}

technical: >
  ${technical || 'Write technical details here.'}

completedOn: ${escapeYamlString(completedOn || date)}

demoUrl: ${escapeYamlString(demoUrl)}
sourceUrl: ${escapeYamlString(sourceUrl)}
link: ${escapeYamlString(link)}
---

Write your content here...
`;
}

/**
 * Main function to create new project
 */
export function createNewProject(title, flags = {}, config = {}) {
  if (!title || title.trim() === '') {
    logError('Title is required');
    log('\nUsage:', 'yellow');
    log('  npx quesby new project "My Project"');
    log('  npx quesby project "My Project"');
    log('  npx quesby create project "My Project"');
    process.exit(1);
  }

  const projectRoot = findProjectRoot();
  const trimmedTitle = title.trim();
  const ulid = ULID.generate();
  const slug = generateSlug(trimmedTitle);

  // Use date from flag, config, or current date
  const date = flags.date ? parseDate(flags.date) : getCurrentDate();
  const completedOn = flags.completedOn ? parseDate(flags.completedOn) : date;
  const projecttype = flags.projecttype || '';
  const category = flags.category || config.defaultCategory || '';
  const draft = flags.draft === true || flags.draft === 'true' || config.defaultDraft || false;

  // Build paths based on config
  const contentDir = path.join(projectRoot, config.contentDir || 'src/content');
  const projectsDir = path.join(contentDir, 'projects');
  const folderName = `${ulid}--${slug}`;
  const projectDir = path.join(projectsDir, folderName);
  const indexPath = path.join(projectDir, 'index.md');

  logInfo(`Creating new project: "${trimmedTitle}"`);
  logInfo(`ULID: ${ulid}`);
  logInfo(`Slug: ${slug}`);

  try {
    // Ensure directories exist (create if missing)
    const created = ensureDir(projectsDir);
    if (created) {
      logInfo(`Created projects directory: ${projectsDir}`);
    }

    // Check if folder already exists
    if (fs.existsSync(projectDir)) {
      logError(`Project folder already exists: ${folderName}`);
      log(`Location: ${projectDir}`, 'yellow');
      process.exit(1);
    }

    // Create project directory
    fs.mkdirSync(projectDir, { recursive: true });

    // Create front matter and content
    const content = createProjectFrontMatter({
      ulid,
      title: trimmedTitle,
      slug,
      date,
      completedOn,
      projecttype,
      category,
      draft
    });

    // Write index.md file with UTF-8 encoding
    fs.writeFileSync(indexPath, content, { encoding: 'utf8' });

    logSuccess('Project created successfully!');
    log(`📁 Location: ${projectDir}`, 'cyan');
    log(`📝 File: ${indexPath}`, 'cyan');
    log(`🔗 URL: /projects/${slug}/`, 'cyan');

  } catch (error) {
    logError(`Failed to create project: ${error.message}`);
    // Don't print stack trace for user-friendly errors
    if (error.code === 'ENOENT') {
      log(`Directory not found: ${error.path}`, 'yellow');
    }
    process.exit(1);
  }
}

// Allow running this script directly: node scripts/new-project.js "My Project"
const args = process.argv.slice(2);
if (import.meta.url === `file://${process.argv[1]}`) {
  if (args.length === 0) {
    log('Quesby CLI - Project Generator', 'bright');
    log('\nUsage:');
    log('  npx quesby new project "My Project"');
    log('  npx quesby project "My Project"');
    log('  npx quesby create project "My Project"');
    process.exit(0);
  }

  const titleArg = args.join(' ');
  const title = titleArg.replace(/^["']|["']$/g, '');
  const projectRoot = findProjectRoot();
  const config = loadConfig(projectRoot);
  createNewProject(title, {}, config);
}
