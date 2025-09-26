import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to posts directory
const postsDir = path.join(__dirname, '..', 'src', 'content', 'posts');

// Function to add quotes to front matter values
function addQuotesToFrontMatter(content) {
  const lines = content.split('\n');
  const frontMatterStart = lines.findIndex(line => line.trim() === '---');
  const frontMatterEnd = lines.findIndex((line, index) => index > frontMatterStart && line.trim() === '---');
  
  if (frontMatterStart === -1 || frontMatterEnd === -1) {
    console.log('No front matter found');
    return content;
  }
  
  const processedLines = [...lines];
  
  // Process front matter lines
  for (let i = frontMatterStart + 1; i < frontMatterEnd; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Skip empty lines and comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    // Check if line contains a key-value pair
    const colonIndex = trimmedLine.indexOf(':');
    if (colonIndex === -1) {
      continue;
    }
    
    const key = trimmedLine.substring(0, colonIndex).trim();
    const value = trimmedLine.substring(colonIndex + 1).trim();
    
    // Skip if value is already quoted or is a list/object
    if (value.startsWith('"') && value.endsWith('"')) {
      continue; // Already quoted
    }
    
    if (value.startsWith('[') || value.startsWith('{')) {
      continue; // Skip arrays and objects
    }
    
    if (value === 'true' || value === 'false' || value === 'null') {
      continue; // Skip booleans and null
    }
    
    // Skip if the line contains a colon in the value (like "description: Learn how to create...")
    if (value.includes(':') && !value.startsWith('"')) {
      continue; // Skip multi-line values that contain colons
    }
    
    // Add quotes around the value
    const newValue = `"${value}"`;
    const newLine = line.replace(value, newValue);
    processedLines[i] = newLine;
  }
  
  return processedLines.join('\n');
}

// Function to process all markdown files in posts directory
function processPostsDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      // Recursively process subdirectories
      processPostsDirectory(itemPath);
    } else if (item.endsWith('.md')) {
      console.log(`Processing: ${itemPath}`);
      
      try {
        const content = fs.readFileSync(itemPath, 'utf8');
        const processedContent = addQuotesToFrontMatter(content);
        
        if (content !== processedContent) {
          fs.writeFileSync(itemPath, processedContent, 'utf8');
          console.log(`✓ Updated: ${itemPath}`);
        } else {
          console.log(`- No changes needed: ${itemPath}`);
        }
      } catch (error) {
        console.error(`Error processing ${itemPath}:`, error.message);
      }
    }
  }
}

// Main execution
console.log('Adding quotes to front matter values in posts...');
console.log(`Posts directory: ${postsDir}`);

if (!fs.existsSync(postsDir)) {
  console.error(`Posts directory not found: ${postsDir}`);
  process.exit(1);
}

processPostsDirectory(postsDir);
console.log('Done!');
