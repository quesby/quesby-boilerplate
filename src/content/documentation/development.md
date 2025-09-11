---
title: Development Guide
description: Complete development guide for Neutrino Electron customization
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 5
---

# Development Guide

This comprehensive guide covers all aspects of developing with Neutrino, from setting up your development environment to advanced customization and deployment strategies.

## Development Environment Setup

### Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)
- **Code Editor** (VS Code recommended)

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/greenpandastudio/neutrino-electron.git
   cd neutrino-electron
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   # Create .env file
   echo "NEUTRINO_CONTENT_PATH=./content" > .env
   echo "THEME=neutrino-electron-core" >> .env
   ```

## Development Scripts

### Available Commands

Neutrino provides several npm scripts for different development tasks:

```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy",
    "watch:css": "node scripts/watch.js",
    "build:css": "node scripts/build.js",
    "gen:ec-css": "node scripts/gen-ec-css.js",
    "serve": "concurrently \"npm run watch:css\" \"npx @11ty/eleventy --serve\"",
    "serve:no-watch": "npx @11ty/eleventy --watch"
  }
}
```

### Script Descriptions

#### **`npm run serve`** - Full Development Server
- **Purpose**: Complete development environment with CSS watching
- **What it does**:
  - Starts Eleventy development server
  - Watches SCSS files for changes
  - Automatically recompiles CSS
  - Serves site at `http://localhost:8080`
- **Use case**: Primary development command

#### **`npm run dev`** - Eleventy Only
- **Purpose**: Eleventy development server without CSS watching
- **What it does**:
  - Starts Eleventy in serve mode
  - Watches for content and template changes
  - No automatic CSS compilation
- **Use case**: When working only on content/templates

#### **`npm run watch:css`** - CSS Watching Only
- **Purpose**: Watch and compile SCSS files
- **What it does**:
  - Monitors SCSS files for changes
  - Compiles to CSS automatically
  - Uses compressed output for development
- **Use case**: When working only on styles

#### **`npm run build:css`** - One-time CSS Build
- **Purpose**: Compile SCSS to CSS once
- **What it does**:
  - Compiles all SCSS files to CSS
  - Outputs compressed CSS
  - No watching, single execution
- **Use case**: Production builds or testing CSS compilation

#### **`npm run gen:ec-css`** - Generate Expressive Code CSS
- **Purpose**: Generate syntax highlighting styles
- **What it does**:
  - Creates CSS for code syntax highlighting
  - Supports light and dark themes
  - Outputs to `src/assets/css/expressive-code.css`
- **Use case**: When updating code highlighting themes

#### **`npm run build`** - Production Build
- **Purpose**: Create production-ready static site
- **What it does**:
  - Compiles all SCSS to optimized CSS
  - Processes all templates and content
  - Generates static site in `_site` directory
  - Optimizes assets and images
- **Use case**: Preparing for deployment

## Project Structure

### Directory Organization

```
neutrino-project/
├── src/ # Source files
│ ├── data/ # Global data files
│ │ └── site.json # Site configuration
│ ├── includes/ # Template includes
│ │ ├── layouts/ # Page layouts
│ │ └── partials/ # Reusable components
│ ├── admin/ # Decap CMS configuration
│ ├── assets/ # Static assets
│ │ ├── css/ # Compiled CSS
│ │ ├── fonts/ # Font files
│ │ ├── images/ # Images
│ │ └── js/ # JavaScript files
│ ├── content/ # Content files
│ │ ├── documentation/ # Documentation pages
│ │ ├── news/ # News articles
│ │ ├── pages/ # Static pages
│ │ ├── posts/ # Blog posts
│ │ └── projects/ # Project showcases
│ ├── sass/ # SCSS source files
│ │ ├── mixins.scss # SCSS mixins
│ │ ├── reset.scss # CSS reset
│ │ ├── typography.scss # Typography styles
│ │ ├── variables.scss # Global variables
│ │ └── core.scss # Core styles
│ └── themes/ # Theme-specific styles
│ ├── neutrino-electron-core/
│ └── neutrino-brand-website/
├── scripts/ # Build scripts
│ ├── build.js # CSS build script
│ ├── watch.js # CSS watch script
│ └── gen-ec-css.js # Expressive Code CSS generator
├── site/ # Built site (generated)
├── eleventy.config.js # Eleventy configuration
├── package.json # Dependencies and scripts
└── .env # Environment variables
```

### Key Files Explained

#### **`eleventy.config.js`** - Main Configuration
- **Purpose**: Configures Eleventy build process
- **Key features**:
  - Content directory setup
  - Template engine configuration
  - Custom filters and shortcodes
  - Markdown processing
  - Asset handling

#### **`src/_data/site.json`** - Site Configuration
- **Purpose**: Global site settings and metadata
- **Contains**:
  - Site name, URL, description
  - Theme selection
  - Content path configuration
  - Default visual theme

#### **`src/sass/core.scss`** - Core Styles
- **Purpose**: Base SCSS compilation entry point
- **Imports**:
  - CSS reset
  - Global variables
  - Typography styles
  - Mixins

## SCSS Architecture

### Core SCSS System

Neutrino uses a modular SCSS architecture with clear separation of concerns:

#### **Core Files** (`src/sass/`)

```scss
// core.scss - Main entry point
@import '_reset';        // CSS reset and normalization
@import '_variables';    // Global variables and color schemes
@import '_mixins';       // Reusable SCSS mixins
@import '_typography';   // Typography system
```

#### **Theme Files** (`src/themes/[theme-name]/`)

```scss
// skin.scss - Theme entry point
@import '../../sass/core';           // Import core styles
@import "_theme-variables";          // Theme-specific variables
@import "_theme-typography";         // Theme typography
@import "_base";                     // Base theme styles
@import "_forms";                    // Form styles
@import "_theme-header";             // Header styles
@import "_page";                     // Page layouts
@import "_home";                     // Homepage styles
@import "_blog";                     // Blog styles
@import "_documentation";            // Documentation styles
@import "_responsive";               // Responsive design
```

### Variable System

#### **Global Variables** (`_variables.scss`)

```scss
// Typography
$font-text: 'Geist', sans-serif;
$font-headers: 'Geist', sans-serif;
$font-mono: 'Geist Mono', monospace;

// Color Themes
$theme-light: (
  text-fg: oklch(31.85% 0.018 18.1),
  site-bg: oklch(99% 0.000 89.9),
  button-bg: oklch(15% 0 0),
  // ... more colors
);

$theme-dark: (
  text-fg: white,
  site-bg: black,
  button-bg: oklch(39.00% 0.012 320.6),
  // ... more colors
);
```

#### **Theme Variables** (`_theme-variables.scss`)

```scss
// Theme-specific overrides
$custom-primary-color: #your-color;
$custom-font-size: 16px;
$custom-spacing: 1.5rem;
```

### Mixin System

#### **Available Mixins** (`_mixins.scss`)

```scss
// Font properties mixin
@mixin font($properties) {
  font-style: map.get($properties, style);
  font-weight: map.get($properties, weight);
  font-size: map.get($properties, size);
  line-height: map.get($properties, lineHeight);
  font-family: map.get($properties, family);
}

// Flexbox container mixin
@mixin flex-container(
  $direction: row,
  $justify: flex-start,
  $items: stretch,
  $content: stretch,
  $wrap: nowrap
) {
  display: flex;
  flex-direction: $direction;
  justify-content: $justify;
  align-items: $items;
  align-content: $content;
  flex-wrap: $wrap;
}

// Sliding background effect
@mixin sliding-background($color, $duration: 0.3s) {
  display: inline-block;
  position: relative;
  overflow: hidden;
  // ... implementation
}
```

## Build System

### CSS Compilation Process

#### **Development Build** (`scripts/watch.js`)

```javascript
import { execSync } from 'child_process'
import fs from 'fs'

const siteData = JSON.parse(fs.readFileSync('./src/_data/site.json', 'utf-8'))
const theme = siteData.theme || 'default'
const command = `sass --watch src/sass:src/assets/css src/themes/${theme}:src/assets/css --style=compressed`

execSync(command, { stdio: 'inherit' })
```

**Features:**
- Watches both core and theme SCSS files
- Compiles to compressed CSS
- Automatic recompilation on changes
- Theme-aware compilation

#### **Production Build** (`scripts/build.js`)

```javascript
import { execSync } from 'child_process'
import fs from 'fs'

const siteData = JSON.parse(fs.readFileSync('./src/_data/site.json', 'utf-8'))
const theme = siteData.theme || 'default'
const command = `sass src/sass:src/assets/css src/themes/${theme}:src/assets/css --style=compressed`

execSync(command, { stdio: 'inherit' })
```

**Features:**
- One-time compilation
- Optimized for production
- No watching overhead
- Theme-specific output

### Expressive Code CSS Generation

#### **Syntax Highlighting** (`scripts/gen-ec-css.js`)

```javascript
import { ExpressiveCodeEngine } from '@expressive-code/core';
import { pluginShiki } from '@expressive-code/plugin-shiki';

const engine = new ExpressiveCodeEngine({
  plugins: [
    pluginShiki({
      themes: ['github-light', 'github-dark']
    })
  ]
});

const styles = await engine.getBaseStyles();
const themeStyles = await engine.getThemeStyles();
const fullStyles = styles + '\n' + themeStyles;

fs.writeFileSync(outPath, fullStyles, 'utf8');
```

**Features:**
- Generates syntax highlighting CSS
- Supports multiple themes
- Integrates with Shiki highlighter
- Outputs to `src/assets/css/expressive-code.css`

## Template System

### Nunjucks Templates

Neutrino uses Nunjucks as its template engine with a hierarchical layout system:

#### **Layout Structure**

```
src/includes/
├── layouts/
│ ├── base.njk # Base layout
│ └── single-post.njk # Post-specific layout
└── partials/
├── header.njk # Site header
├── footer.njk # Site footer
├── navigation.njk # Navigation menu
├── aside-documentation.njk # Documentation sidebar
└── toc-documentation.njk # Table of contents
```

#### **Base Layout** (`layouts/base.njk`)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title or site.name }}</title>
  <link rel="stylesheet" href="/assets/css/core.css">
  <link rel="stylesheet" href="/assets/css/skin.css">
</head>
<body class="{{ class or '' }}">
  {% include "partials/header.njk" %}
  
  <main>
    {% block content %}{% endblock %}
  </main>
  
  {% include "partials/footer.njk" %}
</body>
</html>
```

### Custom Filters

#### **Date Formatting**

```javascript
// In eleventy.config.js
eleventyConfig.addFilter("date", function(date, format) {
  return DateTime.fromJSDate(date).toFormat(format);
});

// Usage in templates
{{ post.date | date("dd LLLL yyyy") }}
{{ post.date | date("yyyy-MM-dd") }}
```

#### **Slug Generation**

```javascript
eleventyConfig.addFilter("slugify", function(str) {
  return slugify(str, { lower: true, strict: true });
});

// Usage in templates
{{ "My Post Title" | slugify }}
// Output: "my-post-title"
```

#### **Markdown Inclusion**

```javascript
eleventyConfig.addFilter("includeMarkdown", function(filePath) {
  const content = fs.readFileSync(`src/_includes/${filePath}`, 'utf-8');
  return this.markdown.render(content);
});

// Usage in templates
{{ "partials/documentation/example.md" | includeMarkdown }}
```

## Content Development

### Content Structure

#### **Posts Development**

```markdown
---
id: 01J4QW0Z9K6QH8E6Z2GQW7C1ZR
title: "Development Post"
slug: "development-post"
description: "A post about development"
date: '2025-08-22'
author: "Developer Name"
type: "post"
createdAt: 2025-08-22T10:15:00Z
tags: ['development', 'tutorial']
draft: false
---

# Development Post

Content goes here...
```

#### **Pages Development**

```markdown
---
id: 01J4QW0Z9K6QH8E6Z2GQW7C1ZR
title: "About Page"
slug: "about"
description: "About our company"
date: '2025-08-22'
author: "Company Name"
type: "page"
menu_order: 1
draft: false
---

# About Us

Page content...
```

### Content Collections

Eleventy automatically creates collections based on content structure:

```javascript
// Automatic collections
collections.posts      // All posts from src/content/posts/
collections.pages      // All pages from src/content/pages/
collections.projects   // All projects from src/content/projects/
collections.documentation // All docs from src/content/documentation/
```

## Theme Development

### Creating Custom Themes

#### **1. Theme Directory Structure**

```
src/themes/my-custom-theme/
├── skin.scss # Main theme file
├── theme-variables.scss # Theme-specific variables
├── theme-typography.scss # Typography overrides
├── base.scss # Base styles
├── forms.scss # Form styles
├── theme-header.scss # Header styles
├── page.scss # Page layouts
├── home.scss # Homepage styles
├── blog.scss # Blog styles
├── documentation.scss # Documentation styles
└── responsive.scss # Responsive design
```

#### **2. Theme Entry Point** (`skin.scss`)

```scss
// Core (do not touch in themes)
@use 'sass:map';
@use 'sass:color';
@import '../../sass/core';

// Theme-specific imports
@import "_theme-variables";
@import "_theme-typography";
@import "_base";
@import "_forms";
@import "_theme-header";
@import "_page";
@import "_home";
@import "_blog";
@import "_documentation";
@import "_responsive";
```

#### **3. Theme Variables** (`_theme-variables.scss`)

```scss
// Override global variables
$custom-primary: #your-brand-color;
$custom-font-size: 18px;
$custom-spacing: 2rem;

// Theme-specific color overrides
:root {
  --custom-accent: #{$custom-primary};
  --custom-text-size: #{$custom-font-size};
}
```

### Theme Switching

#### **Environment Variable Method**

```bash
# Set theme via environment variable
THEME=my-custom-theme npm run serve
```

#### **Site Configuration Method**

```json
{
  "name": "My Site",
  "theme": "my-custom-theme",
  "defaultVisualTheme": "dark"
}
```

## Development Workflow

### Daily Development Process

#### **1. Start Development**

```bash
# Start full development environment
npm run serve

# Or start components individually
npm run watch:css    # CSS watching only
npm run dev          # Eleventy only
```

#### **2. Content Development**

```bash
# Create new content
mkdir -p src/content/posts/$(node -e "console.log(require('ulid').ulid())")
# Edit content files
code src/content/posts/[ulid]/index.md
```

#### **3. Style Development**

```scss
// Edit theme files
code src/themes/neutrino-electron-core/_base.scss

// Or core files
code src/sass/_variables.scss
```

#### **4. Template Development**

```html
<!-- Edit templates -->
code src/_includes/layouts/base.njk
code src/_includes/partials/header.njk
```

### Git Workflow

#### **Feature Development**

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature: description"

# Push and create PR
git push origin feature/new-feature
```

#### **Content Updates**

```bash
# Create content branch
git checkout -b content/new-post

# Add content
git add src/content/posts/new-post/
git commit -m "Add new blog post: Post Title"

# Push and merge
git push origin content/new-post
```

## Debugging and Troubleshooting

### Common Development Issues

#### **CSS Not Compiling**

**Symptoms:**
- Styles not updating
- SCSS errors in console
- Missing CSS files

**Solutions:**
```bash
# Check SCSS syntax
npm run build:css

# Restart CSS watcher
npm run watch:css

# Check theme configuration
cat src/_data/site.json | grep theme
```

#### **Content Not Appearing**

**Symptoms:**
- New content not showing
- 404 errors for content
- Build errors

**Solutions:**
```bash
# Check content structure
ls -la src/content/posts/

# Validate frontmatter
# Check YAML syntax in content files

# Rebuild site
npm run build
```

#### **Template Errors**

**Symptoms:**
- Template rendering errors
- Missing includes
- Nunjucks syntax errors

**Solutions:**
```bash
# Check template syntax
# Validate include paths
# Check for missing partials

# Enable debug mode
DEBUG=Eleventy* npm run serve
```

### Debug Tools

#### **Eleventy Debug Mode**

```bash
# Enable detailed logging
DEBUG=Eleventy* npm run serve

# Show build information
npm run build -- --verbose
```

#### **SCSS Debug Mode**

```scss
// Add debug information to SCSS
@debug "Current theme: #{$theme}";
@warn "This is a warning message";
@error "This is an error message";
```

## Performance Optimization

### Development Performance

#### **CSS Compilation Optimization**

```javascript
// Optimize SCSS compilation
const command = `sass --no-source-map --style=compressed src/sass:src/assets/css src/themes/${theme}:src/assets/css`;
```

#### **Eleventy Performance**

```javascript
// In eleventy.config.js
module.exports = function(eleventyConfig) {
  // Enable incremental builds
  eleventyConfig.setUseGitIgnore(false);
  
  // Optimize collections
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/content/posts/**/*.md");
  });
};
```

### Build Optimization

#### **Asset Optimization**

```javascript
// Image optimization
eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt, sizes) {
  let stats = await Image(src, {
    widths: [300, 600, 900],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/assets/images/"
  });
  
  return `<img src="${stats.webp[0].url}" alt="${alt}" sizes="${sizes}">`;
});
```

#### **CSS Optimization**

```scss
// Use CSS custom properties for runtime theming
:root {
  --text-color: #{map.get($theme-light, text-fg)};
  --bg-color: #{map.get($theme-light, site-bg)};
}

[data-theme="dark"] {
  --text-color: #{map.get($theme-dark, text-fg)};
  --bg-color: #{map.get($theme-dark, site-bg)};
}
```

## Testing and Quality Assurance

### Content Testing

#### **Frontmatter Validation**

```javascript
// Validate frontmatter structure
function validateFrontmatter(data) {
  const required = ['title', 'date', 'type'];
  const missing = required.filter(field => !data[field]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}
```

#### **Link Validation**

```bash
# Check for broken links
npx eleventy --dryrun
```

### Style Testing

#### **Cross-browser Testing**

```scss
// Use progressive enhancement
.button {
  background: #fallback-color;
  background: var(--button-bg, #fallback-color);
}
```

#### **Responsive Testing**

```scss
// Test all breakpoints
@media (max-width: 650px) { /* smartphone */ }
@media (max-width: 1024px) { /* tablet */ }
@media (max-width: 1440px) { /* laptop */ }
@media (min-width: 1441px) { /* desktop */ }
```

## Deployment Preparation

### Pre-deployment Checklist

#### **1. Build Verification**

```bash
# Test production build
npm run build

# Check build output
ls -la _site/

# Verify all assets
ls -la _site/assets/
```

#### **2. Content Validation**

```bash
# Check all content files
find src/content -name "*.md" -exec echo "Checking: {}" \;

# Validate frontmatter
# Check for draft content
grep -r "draft: true" src/content/
```

#### **3. Performance Check**

```bash
# Check CSS file sizes
ls -lh _site/assets/css/

# Verify image optimization
ls -lh _site/assets/images/
```

### Environment Configuration

#### **Production Environment**

```bash
# .env.production
NEUTRINO_CONTENT_PATH=/path/to/production/content
THEME=neutrino-electron-core
NODE_ENV=production
```

#### **Build Scripts**

```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production npm run build",
    "deploy": "npm run build:prod && rsync -av _site/ user@server:/path/to/site/"
  }
}
```

## Best Practices

### Code Organization

- **Keep SCSS modular** with clear file separation
- **Use semantic naming** for classes and variables
- **Document complex logic** with comments
- **Follow consistent indentation** and formatting

### Performance

- **Optimize images** before adding to content
- **Minimize CSS** by removing unused styles
- **Use efficient selectors** in SCSS
- **Enable compression** for production builds

### Content Management

- **Use consistent frontmatter** across all content
- **Validate content structure** before committing
- **Keep content organized** in appropriate directories
- **Use descriptive slugs** for better SEO

### Collaboration

- **Use meaningful commit messages** that describe changes
- **Create feature branches** for new development
- **Document breaking changes** in commit messages
- **Keep dependencies updated** regularly

This comprehensive development guide covers all aspects of working with Neutrino, from basic setup to advanced customization and deployment strategies.