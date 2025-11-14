---
title: Migration Tools
description: Complete guide to migrating content from other platforms to Quesby
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 5
lastUpdated: "2025-01-20"
---

# Migration Tools

Quesby includes powerful tools to help you migrate content from other platforms and content management systems. These tools are designed to be standalone, configurable, and easy to use.

## 3 Steps in 30 Seconds

1. **Configure** - Set up your migration config
2. **Test** - Run dry-run to preview changes  
3. **Import** - Execute the migration

```bash
# Quick start
cd tools/legacy-content-importer
npm install
cp config.example.yml my-config.yml
node index.js --config my-config.yml --dry-run
node index.js --config my-config.yml
```

> **Supported Platforms**: Jekyll, Hugo, Ghost, WordPress (XML export)

## Available Tools

### Legacy Content Importer

The Legacy Content Importer is a comprehensive tool that converts content from various platforms into Quesby's ULID-based system.

**Features:**
- Automatic ULID generation for all content
- Flexible frontmatter field mapping
- Slug generation from titles
- SEO-friendly alias creation
- Image path handling and conversion
- Backup functionality before import
- Dry-run mode for safe testing
- Support for multiple content sources

> **Note**: For detailed information about ULID system and content structure, see the [Content Management Guide](./content-management.md).

## Quick Start

### 1. Install Dependencies

```bash
cd tools/legacy-content-importer
npm install
```

### 2. Configure the Tool

Copy the example configuration and customize it for your needs:

```bash
cp config.example.yml my-config.yml
```

### 3. Test the Import

Always test with dry-run mode first:

```bash
node index.js --config my-config.yml --dry-run
```

### 4. Run the Import

When you're satisfied with the test results:

```bash
node index.js --config my-config.yml
```

> **Advanced**: For npm script integration, see [Advanced Usage](#advanced-usage) section.

## Supported Platforms

### Jekyll

```yaml
# config.yml
source: "./_posts"
target: "./src/content/posts"
author: "Your Name"
fieldMappings:
  title: ["title"]
  description: ["excerpt"]
  date: "date"
  tags: "tags"
  category: "categories"
```

### Hugo

```yaml
# config.yml
source: "./content/posts"
target: "./src/content/posts"
author: "Your Name"
fieldMappings:
  title: ["title"]
  description: ["description"]
  date: "date"
  tags: "tags"
  category: "categories"
```

### Ghost

```yaml
# config.yml
source: "./ghost-export/posts"
target: "./src/content/posts"
author: "Your Name"
fieldMappings:
  title: ["title"]
  description: ["excerpt"]
  date: "published_at"
  tags: "tags"
```

### WordPress

**Option 1: Using wordpress-export-to-markdown (Recommended)**
```bash
# First, convert WordPress XML to Markdown
npm install wordpress-export-to-markdown
npx wordpress-export-to-markdown export.xml wordpress-export/
```

**Option 2: Using WP Markdown Exporter Plugin**
Install the "WP Markdown Exporter" plugin in WordPress and export your content.

**Configuration:**
```yaml
# config.yml
source: "./wordpress-export"
target: "./src/content/posts"
author: "Your Name"
fieldMappings:
  title: ["post_title"]
  description: ["post_excerpt"]
  date: "post_date"
  tags: "post_tags"
  category: "post_category"
```

## Configuration Options

### Basic Configuration

```yaml
# Source and target directories
source: "./old-blog"
target: "./src/content/posts"

# Default values
author: "Your Name"
imagePath: "/img/"

# Field mappings
fieldMappings:
  title: ["page-title", "seoTitle", "title"]
  description: ["descrizione", "description", "excerpt"]
  date: "date"
  tags: "tags"
  category: "category"
  image: "image"
  author: "author"
  draft: "draft"
  featured: "featured"
  type: "type"

# Content processing
content:
  addCategoryToTags: true
  createAliases: true
  aliasPattern: "/blog/{slug}/"

# Backup settings
backup:
  enabled: true
  directory: "backup-before-import"
```

### Advanced Configuration

#### Custom Field Mappings

You can map any legacy field to any Quesby field:

```yaml
fieldMappings:
  title: ["post_title", "title", "headline"]
  description: ["meta_description", "excerpt", "summary"]
  customField: "legacy_custom_field"
```

#### Multiple Title Sources

The tool will try each field in order until it finds a value:

```yaml
fieldMappings:
  title: ["page-title", "seoTitle", "title", "headline"]
  description: ["descrizione", "description", "excerpt", "summary"]
```

#### Custom Alias Patterns

Create custom URL patterns for aliases:

```yaml
content:
  aliasPattern: "/old-blog/{slug}/"  # Custom pattern
  # or
  aliasPattern: "/archive/{year}/{month}/{slug}/"  # Date-based pattern
```

## Command Line Usage

### Basic Commands

```bash
# Show help
node index.js --help

# Dry run with parameters
node index.js --source ./old-blog --target ./src/content/posts --dry-run

# Real import with parameters
node index.js --source ./old-blog --target ./src/content/posts

# Use configuration file
node index.js --config my-config.yml --dry-run
node index.js --config my-config.yml
```

### Advanced Options

```bash
# Custom author and image path
node index.js \
  --source ./old-blog \
  --target ./src/content/posts \
  --author "Your Name" \
  --image-path "/assets/images/" \
  --verbose

# Disable backup
node index.js \
  --source ./old-blog \
  --target ./src/content/posts \
  --no-backup
```

## Best Practices

### 1. Always Test First

```bash
# Always run dry-run first
npm run tools:import:config:dry
```

### 2. Backup Your Data

The tool creates automatic backups, but you should also:

```bash
# Create your own backup
cp -r src/content/posts src/content/posts-backup
```

### 3. Review the Results

After import, check:

- [ ] All content was imported correctly
- [ ] ULIDs were generated properly
- [ ] Slugs are URL-friendly
- [ ] Images are accessible
- [ ] Aliases work for old URLs

### 4. Test Your Site

```bash
# Build and test your site
npm run build
npm run dev
```

### 5. Update Internal Links

After migration, you may need to update internal links in your content to use the new ULID-based URLs.

## Troubleshooting

### Common Issues

#### "Source directory not found"

Make sure the source path is correct and accessible:

```bash
# Check if directory exists
ls -la ./old-blog

# Use absolute path if needed
node index.js --source "/full/path/to/old-blog" --target ./src/content/posts
```

#### "No markdown files found"

Ensure your source directory contains `.md` files:

```bash
# Check for markdown files
find ./old-blog -name "*.md" | head -10
```

#### "Target directory already exists"

The tool won't overwrite existing content. Either:

1. Use a different target directory
2. Remove existing content first
3. Use the `--force` flag to overwrite existing files

> **Note**: The `--force` flag is implemented and will overwrite existing content files. Use with caution and always backup first.

#### "Field mapping errors"

Check your configuration file for typos in field names:

```yaml
# Make sure field names match exactly
fieldMappings:
  title: ["title"]  # Not "Title" or "TITLE"
```

### Getting Help

1. Check the tool's README: `tools/legacy-content-importer/README.md`
2. Run with `--help` flag: `node index.js --help`
3. Use verbose mode: `node index.js --verbose`
4. Check the project's GitHub issues

## Advanced Usage

### NPM Scripts Integration

For projects that prefer npm scripts, you can add these to your `package.json`:

```json
{
  "scripts": {
    "tools:import:config": "cd tools/legacy-content-importer && node index.js --config",
    "tools:import:config:dry": "cd tools/legacy-content-importer && node index.js --config --dry-run"
  }
}
```

**Usage:**
```bash
# Dry run
npm run tools:import:config:dry my-config.yml

# Import
npm run tools:import:config my-config.yml
```

### Custom Field Processors

You can extend the tool with custom field processors:

```javascript
// tools/legacy-content-importer/processors/custom.js
module.exports = {
  processCustomField: (value) => {
    // Your custom processing logic
    return value.toUpperCase();
  }
};
```

## Contributing

To contribute to migration tools:

1. Fork the repository
2. Create a feature branch
3. Add your tool to the `tools/` directory
4. Follow the tool requirements in `tools/README.md`
5. Submit a pull request

### Tool Requirements

When contributing new migration tools:

- **Language**: JavaScript/Node.js preferred
- **Structure**: Follow existing tool structure in `tools/legacy-content-importer/`
- **Documentation**: Include README.md with usage examples
- **Testing**: Add test cases for your tool
- **Configuration**: Use YAML configuration files
- **Error Handling**: Implement proper error messages and logging
- **CLI**: Support standard flags (`--help`, `--verbose`, `--dry-run`)

### Example Tool Structure

```
tools/my-migration-tool/
├── index.js              # Main tool file
├── config.example.yml    # Example configuration
├── README.md            # Tool documentation
├── package.json         # Dependencies
└── test/                # Test files
    └── test.js
```

## License

Migration tools are licensed under the same MIT license as Quesby.
