---
title: Development Guide
description: Complete development guide for Neutrino Boilerplate customization
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 5
lastUpdated: "2025-09-12"
---

# Development Guide

This comprehensive guide covers all aspects of developing with Neutrino, from setting up your development environment to advanced customization and deployment strategies.

## Quick Navigation

- **[Development Setup](#development-environment-setup)** - Environment and scripts
- **[SCSS Architecture](#scss-architecture)** - Styling system and themes
- **[Shortcodes & Filters](#shortcodes-system)** - Custom functionality
- **[Template System](#template-system)** - Nunjucks templates
- **[Theme Development](#theme-development)** - Creating custom themes
- **[Workflow & Debugging](#development-workflow)** - Daily development process
- **[Testing & QA](#testing-and-quality-assurance)** - Quality assurance
- **[Deployment](#deployment-preparation)** - Publishing your site

## Development Environment Setup

> **Note**: For detailed installation and setup instructions, see the [Installation Guide](./installation.md).

### Quick Start

1. **Clone and install:**
   ```bash
   git clone https://github.com/greenpandastudio/neutrino-Boilerplate.git
   cd neutrino-Boilerplate
   pnpm install
   ```

2. **Start development:**
   ```bash
   pnpm serve
   ```

3. **Open browser:**
   ```bash
   open http://localhost:8080
   ```

## Development Scripts

### Available Commands

Neutrino provides several pnpm scripts for different development tasks:

```json
{
  "scripts": {
    "css:build": "node scripts/build.js",
    "css:watch": "node scripts/watch.js",
    "dev": "eleventy --serve",
    "build": "npm run css:build && eleventy",
    "serve": "concurrently \"npm run css:watch\" \"npx @11ty/eleventy --serve\""
  }
}
```

### Script Descriptions

#### **`pnpm serve`** - Full Development Server
- **Purpose**: Complete development environment with CSS watching
- **What it does**:
  - Starts Eleventy development server
  - Watches SCSS files for changes
  - Automatically recompiles CSS
  - Serves site at `http://localhost:8080`
- **Use case**: Primary development command

#### **`pnpm dev`** - Eleventy Only
- **Purpose**: Eleventy development server without CSS watching
- **What it does**:
  - Starts Eleventy in serve mode
  - Watches for content and template changes
  - No automatic CSS compilation
- **Use case**: When working only on content/templates

#### **`pnpm css:watch`** - CSS Watching Only
- **Purpose**: Watch and compile SCSS files
- **What it does**:
  - Monitors SCSS files for changes
  - Compiles to CSS automatically
  - Uses compressed output for development
- **Use case**: When working only on styles

#### **`pnpm css:build`** - One-time CSS Build
- **Purpose**: Compile SCSS to CSS once
- **What it does**:
  - Compiles all SCSS files to CSS
  - Outputs compressed CSS
  - No watching, single execution
- **Use case**: Production builds or testing CSS compilation

#### **`pnpm gen:ec-css`** - Generate Expressive Code CSS
- **Purpose**: Generate syntax highlighting styles
- **What it does**:
  - Creates CSS for code syntax highlighting
  - Supports light and dark themes
  - Outputs to `src/assets/css/expressive-code.css`
- **Use case**: When updating code highlighting themes

#### **`pnpm dev`** - Eleventy Only
- **Purpose**: Eleventy development server without CSS watching
- **What it does**:
  - Starts Eleventy in serve mode
  - Watches for content and template changes
  - No automatic CSS compilation
- **Use case**: When working only on content/templates

#### **`pnpm build`** - Production Build
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
│ ├── neutrino-Boilerplate-core/
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

> **Note**: For detailed SCSS customization, see the [Theme Development Guide](./themes.md).

### Modern Sass Module System

Neutrino uses the modern `@use` and `@forward` rules instead of the legacy `@import` system. This provides better performance, explicit dependencies, and namespace control.

**Key Benefits:**
- **Explicit Dependencies**: Each file clearly declares what it needs
- **Namespace Control**: Variables and mixins can be namespaced to avoid conflicts
- **Better Performance**: Sass only compiles what's actually used
- **Future-Proof**: `@import` is deprecated and will be removed in future Sass versions

### Core SCSS System

Neutrino uses a modular SCSS architecture with clear separation of concerns:

#### **Core Files** (`src/sass/`)

```scss
// core.scss - Main entry point
@use '_reset';        // CSS reset and normalization
@use '_variables';    // Global variables and color schemes
@use '_mixins';       // Reusable SCSS mixins
@use '_typography';   // Typography system
```

#### **Theme Files** (`src/themes/[theme-name]/`)

```scss
// skin.scss - Theme entry point
@use "variables";
@use "@neutrino/core/sass/_reset";
@use "@neutrino/core/sass/_mixins";
@use "typography";
@use "base";
@use "forms";
@use "header";
@use "page";
@use "home";
@use "blog";
@use "documentation";
@use "responsive";
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

## Shortcodes System

Neutrino includes powerful shortcodes for media handling and content optimization.

> **⚠️ Security Note**: Shortcodes are implemented in the core package (`@neutrino/core`). For production use, avoid modifying core shortcodes directly. Instead, extend functionality through `eleventy.config.js` or create custom shortcodes.

### Image Shortcode

#### **Responsive Images with `{% image %}`**

The image shortcode automatically generates responsive images with multiple formats and sizes.

**Implementation:**
```javascript
// In src/eleventy/shortcodes.js
async function imageShortcode(src, alt, sizes = "100vw") {
  if (!alt) throw new Error(`Missing alt for ${src}`);
  
  const resolved = path.resolve("src/assets/images", 
    src.replace(/^\/?src\/assets\/images\/?/, ""));
  
  const metadata = await Image(resolved, {
    widths: [320, 640, 960, 1280, null],
    formats: ["avif", "webp"],
    outputDir: "./_site/img/",
    urlPath: "/img/"
  });
  
  return `<figure>${Image.generateHTML(metadata, {
    alt, sizes, loading: "lazy", decoding: "async"
  })}</figure>`;
}
```

**Usage in Templates:**
```twig
{% image "hero/cover.jpg", "Site hero image", "(min-width: 768px) 75vw, 100vw" %}
```

**Features:**
- **Format optimization**: Generates AVIF and WebP
- **Size variants**: 320px, 640px, 960px, 1280px, original
- **Lazy loading**: Images load when needed
- **Accessibility**: Alt text required
- **Performance**: Optimized for Core Web Vitals

### SVG Shortcode

#### **Inline SVG with `{% svg %}`**

The SVG shortcode embeds SVG files directly in HTML with custom CSS classes.

**Implementation:**
```javascript
// In src/eleventy/shortcodes.js
function svgShortcode(svgPath, className = "") {
  const fullPath = path.join(process.cwd(), 'src', svgPath);
  const svgContent = fs.readFileSync(fullPath, 'utf8');
  
  if (!className) return svgContent;
  
  // Add or append CSS class to SVG element
  return svgContent.replace(/<svg([^>]*)>/, 
    `<svg$1 class="${className}">`);
}
```

**Usage in Templates:**
```twig
{% svg "assets/icons/github.svg", "w-6 h-6 text-gray-600" %}
```

**Features:**
- **Inline embedding**: No additional HTTP requests
- **CSS classes**: Apply custom styling
- **Scalable**: Perfect for icons and graphics
- **Performance**: Reduces network requests

### Automatic Markdown Processing

Neutrino automatically processes standard Markdown images through the responsive image system.

**Markdown Syntax:**
```markdown
![Alt text](/assets/images/example.jpg)
```

**Automatic Processing:**
- Converts to responsive `<picture>` elements
- Generates multiple formats (AVIF, WebP)
- Applies lazy loading
- Optimizes for performance

**Configuration:**
The system processes images in all content directories:
- `src/content/posts/`
- `src/content/pages/`
- `src/content/projects/`
- `src/content/documentation/`

## Template System

> **Note**: For detailed template customization, see the [Theme Development Guide](./themes.md).

### Nunjucks Templates

Neutrino uses Nunjucks as its template engine with a hierarchical layout system. The project is configured to use Nunjucks for all template processing, including HTML and Markdown files.

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
<!doctype html>
<html lang="en" class="{{ site.defaultVisualTheme }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  
  <!-- Enhanced SEO System -->
  {%- set seoTitle = seoTitle or postTitle or title or site.name -%}
  {%- set seoDescription = postDescription or description or site.description -%}
  {%- set seoImage = postImage or image or site.socialImage -%}
  {%- set pageUrl = site.url + page.url -%}
  
  <title>{{ seoTitle }}</title>
  <meta name="description" content="{{ seoDescription }}">
  
  <!-- CSS -->
  <link rel="stylesheet" href="/assets/css/skin.css">
  <link rel="stylesheet" href="/assets/css/expressive-code.css">
</head>
<body class="{{ postClass or class }}">
  {% include "partials/header.njk" %}
  <div class="layout-wrapper">
    <main>
      {% block content %}{% endblock %}
    </main>
    {% if aside %}
      <aside>{% include "partials/" + aside %}</aside>
    {% endif %}
  </div>
  {% include "partials/footer.njk" %}
  {% include "partials/search.njk" %}
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

// Usage in Nunjucks templates
{{ post.date | date("dd LLLL yyyy") }}
{{ post.date | date("yyyy-MM-dd") }}
```

#### **Slug Generation**

```javascript
eleventyConfig.addFilter("slugify", function(str) {
  return slugify(str, { lower: true, strict: true });
});

// Usage in Nunjucks templates
{{ "My Post Title" | slugify }}
// Output: "my-post-title"
```

#### **Markdown Inclusion**

```javascript
eleventyConfig.addFilter("includeMarkdown", function(filePath) {
  const content = fs.readFileSync(`src/_includes/${filePath}`, 'utf-8');
  return this.markdown.render(content);
});

// Usage in Nunjucks templates
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

> **Note**: For detailed theme customization, see the [Theme Development Guide](./themes.md).

### Creating Custom Themes

#### **1. Theme Directory Structure**

```
src/themes/my-custom-theme/
├── skin.scss # Main theme file
├── _variables.scss # Theme-specific variables
├── _typography.scss # Typography overrides
├── base.scss # Base styles
├── forms.scss # Form styles
├── _header.scss # Header styles
├── page.scss # Page layouts
├── home.scss # Homepage styles
├── blog.scss # Blog styles
├── documentation.scss # Documentation styles
└── responsive.scss # Responsive design
```

#### **2. Theme Entry Point** (`skin.scss`)

```scss
// Core (do not touch in themes)
@use "variables";
@use "@neutrino/core/sass/_reset";
@use "@neutrino/core/sass/_mixins";
@use "typography";
@use "base";
@use "forms";
@use "header";
@use "page";
@use "home";
@use "blog";
@use "documentation";
@use "responsive";
```

#### **3. Theme Variables** (`_variables.scss`)

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

#### **Site Configuration**

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
pnpm serve    # or npm run serve / yarn serve

# Or start components individually
pnpm css:watch    # CSS watching only
pnpm dev          # Eleventy only
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
code src/themes/neutrino-Boilerplate-core/_base.scss

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
pnpm css:build    # or npm run css:build / yarn css:build

# Restart CSS watcher
pnpm css:watch    # or npm run css:watch / yarn css:watch

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
pnpm build
```

#### **Template Errors**

**Symptoms:**
- Template rendering errors
- Missing includes
- Nunjucks syntax errors

**Solutions:**
```bash
# Check Nunjucks template syntax
# Validate include paths
# Check for missing partials

# Enable debug mode
DEBUG=Eleventy* pnpm serve
```

### Debug Tools

#### **Eleventy Debug Mode**

```bash
# Enable detailed logging
DEBUG=Eleventy* pnpm serve

# Show build information
pnpm build -- --verbose
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

# External link checking
npx linkinator _site --recurse --silent

# HTML validation
npx html-validate _site/**/*.html
```

#### **External Testing Tools**

| Tool | Purpose | Installation | Usage |
|------|---------|--------------|-------|
| **linkinator** | Link checking | `pnpm add -D linkinator` | `npx linkinator _site` |
| **html-validate** | HTML validation | `pnpm add -D html-validate` | `npx html-validate _site` |
| **lighthouse** | Performance audit | `pnpm add -D lighthouse` | `npx lighthouse http://localhost:8080` |
| **axe-core** | Accessibility testing | `pnpm add -D @axe-core/cli` | `npx axe _site` |

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
pnpm build

# Check build output
ls -la _site/

# Verify all assets
ls -la _site/assets/
```

### Deployment Platforms

#### **GitHub Pages**
```bash
# Deploy to GitHub Pages
pnpm build
git add _site/
git commit -m "Deploy to GitHub Pages"
git subtree push --prefix _site origin gh-pages
```

#### **Netlify**
```yaml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "_site"

[build.environment]
  NODE_VERSION = "18"
```

#### **Vercel**
```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "_site",
  "installCommand": "pnpm install"
}
```

#### **Traditional Hosting (rsync)**
```bash
# Deploy via rsync
pnpm build
rsync -av _site/ user@server:/path/to/site/
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

## CLI Tools

### New Post Generator

Neutrino includes a powerful CLI tool for creating new blog posts with proper ULID generation and folder structure.

#### **`npx neutrino new post "Title"`**

Creates a new blog post with automatic ULID generation and proper folder structure.

**Usage:**
```bash
# Create a new blog post
npx neutrino new post "Getting Started with Neutrino"

# Example output:
# ℹ️  Creating new post: "Getting Started with Neutrino"
# ℹ️  ULID: 01K6A3V1WHREEEZ2BSEXDS6ZCF
# ℹ️  Slug: getting-started-with-neutrino
# ℹ️  Folder: 01K6A3V1WHREEEZ2BSEXDS6ZCF--getting-started-with-neutrino
# ✅ Post created successfully!
# 📁 Location: /src/content/posts/01K6A3V1WHREEEZ2BSEXDS6ZCF--getting-started-with-neutrino/
# 📝 File: /src/content/posts/01K6A3V1WHREEEZ2BSEXDS6ZCF--getting-started-with-neutrino/index.md
# 🔗 URL: /blog/getting-started-with-neutrino/
```

**Features:**
- **Automatic ULID Generation**: Creates unique 26-character identifiers
- **Slug Generation**: Converts titles to URL-friendly slugs
- **Folder Structure**: Creates `ULID--slug` format directories
- **Complete Front Matter**: Pre-populated with all required fields
- **Current Date**: Automatically sets today's date
- **Error Handling**: Validates input and checks for conflicts

**Generated Structure:**
```
src/content/posts/01K6A3V1WHREEEZ2BSEXDS6ZCF--getting-started-with-neutrino/
└── index.md
```

**Generated Front Matter:**
```yaml
---
id: 01K6A3V1WHREEEZ2BSEXDS6ZCF
title: "Getting Started with Neutrino"
slug: getting-started-with-neutrino
description: ""
date: 2025-01-27T10:30:00.000Z
author: ""
image: ""
tags: []
draft: false
aliases: []
---

# Getting Started with Neutrino

Write your content here...
```

**CLI Options:**
```bash
# Show help
npx neutrino

# Create post with quotes (handles spaces)
npx neutrino new post "My Amazing Post Title"

# Create post without quotes (single word)
npx neutrino new post Tutorial
```

## Utility Scripts

> **Note**: For detailed script usage, see the [Content Management Guide](./content-management.md#content-migration).

Neutrino includes several utility scripts for content management and migration tasks.

### ULID Migration Script

#### **`scripts/migrate-to-ulid-slug.js`**

Migrates content from ULID-only folder structure to ULID--slug format.

**Usage:**
```bash
# Dry run (test mode)
node scripts/migrate-to-ulid-slug.js --dry-run

# Actual migration
node scripts/migrate-to-ulid-slug.js

# Help
node scripts/migrate-to-ulid-slug.js --help
```

**Features:**
- Migrates from `[ULID]/index.md` to `[ULID]--[slug]/index.md`
- Creates automatic backup before migration
- Handles slug conflicts and validation
- Adds aliases for old URLs
- Dry-run mode for testing
- Detailed logging and error reporting

**Migration Process:**
1. Creates backup of content directory
2. Scans all ULID folders
3. Extracts slug from frontmatter
4. Renames folders to `ULID--slug` format
5. Adds aliases for old URLs
6. Removes old folders

### Alias Cleanup Script

#### **`scripts/fix-aliases.js`**

Cleans up empty aliases in migrated posts.

**Usage:**
```bash
node scripts/fix-aliases.js
```

**Features:**
- Removes empty alias entries
- Fixes malformed alias arrays
- Processes all posts in content directory
- Safe operation with error handling

### Script Safety Features

All utility scripts include:
- **Backup creation** before destructive operations
- **Dry-run mode** for testing changes
- **Error handling** with detailed logging
- **Validation** of input data
- **Rollback capability** through backups

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

## Next Steps

After mastering development with Neutrino:

1. **[Content Management](./content-management.md)** - Learn to manage content effectively
2. **[Theme Development](./themes.md)** - Create custom themes and designs
3. **[Configuration](./configuration.md)** - Advanced configuration options
4. **[Deployment](./deployment.md)** - Publish your site

This comprehensive development guide covers all aspects of working with Neutrino, from basic setup to advanced customization and deployment strategies.