#!/usr/bin/env node

/**
 * CLI argument parser for Quesby commands
 */

/**
 * Parse command line arguments
 * Supports: npx quesby new post "Title", npx quesby post "Title", npx quesby create post "Title"
 */
export function parseArgs(args) {
  const result = {
    command: null,
    subcommand: null,
    title: null,
    flags: {}
  };

  if (args.length === 0) {
    return result;
  }

  // Check for command variants: "new", "create", or direct subcommand
  let idx = 0;
  const first = args[0] ? args[0].toLowerCase() : '';

  if (first === 'new' || first === 'create') {
    result.command = first;
    idx = 1;
    // Next arg should be subcommand
    if (idx < args.length) {
      result.subcommand = args[idx].toLowerCase();
      idx++;
    }
  } else if (first) {
    // Direct subcommand without prefix (e.g., "post", "project")
    result.subcommand = first;
    idx = 1;
  }

  // Parse flags and title
  const remaining = args.slice(idx);
  const titleParts = [];
  let inQuotes = false;
  let quoteChar = '';

  for (const arg of remaining) {
    if (arg.startsWith('--')) {
      // Parse flag: --key=value or --key (boolean)
      const flagMatch = arg.match(/^--([^=]+)(?:=(.+))?$/);
      if (flagMatch) {
        const key = flagMatch[1];
        const value = flagMatch[2];
        
        if (value === undefined) {
          // Boolean flag without value
          result.flags[key] = true;
        } else {
          // Flag with value
          const cleanValue = value.replace(/^["']|["']$/g, '');
          // Convert string booleans
          if (cleanValue === 'true') {
            result.flags[key] = true;
          } else if (cleanValue === 'false') {
            result.flags[key] = false;
          } else {
            result.flags[key] = cleanValue;
          }
        }
      }
    } else {
      // Handle quoted strings
      if ((arg.startsWith('"') || arg.startsWith("'")) && !inQuotes) {
        inQuotes = true;
        quoteChar = arg[0];
        titleParts.push(arg.slice(1));
      } else if (inQuotes && arg.endsWith(quoteChar)) {
        titleParts.push(arg.slice(0, -1));
        inQuotes = false;
        quoteChar = '';
      } else {
        titleParts.push(arg);
      }
    }
  }

  // Join title parts
  if (titleParts.length > 0) {
    result.title = titleParts.join(' ').trim();
  }

  return result;
}

