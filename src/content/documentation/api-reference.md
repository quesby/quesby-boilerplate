---
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
class: documentation
---

# API Reference

This comprehensive API reference covers all available functions, filters, shortcodes, and configuration options in Neutrino.

## Table of Contents

- [Eleventy Configuration](#eleventy-configuration)
- [Custom Filters](#custom-filters)
- [Global Data](#global-data)
- [Collections](#collections)
- [Template Functions](#template-functions)
- [Decap CMS API](#decap-cms-api)
- [Build Scripts](#build-scripts)
- [Environment Variables](#environment-variables)
- [SCSS API](#scss-api)
- [JavaScript API](#javascript-api)

## Eleventy Configuration

### Core Configuration

#### **`eleventy.config.js`**

Main configuration file that sets up all Eleventy functionality.

```javascript
export default function(eleventyConfig) {
  // Configuration options
  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true
  };
}
```

#### **Configuration Options**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dir.input` | String | `"src"` | Source directory |
| `dir.output` | String | `"_site"` | Output directory |
| `dir.includes` | String | `"_includes"` | Template includes directory |
| `dir.data` | String | `"_data"` | Global data directory |
| `markdownTemplateEngine` | String | `"njk"` | Markdown template engine |
| `htmlTemplateEngine` | String | `"njk"` | HTML template engine |
| `passthroughFileCopy` | Boolean | `true` | Enable file copying |

### Watch Targets

#### **`addWatchTarget(path)`**

Adds directories to watch for changes during development.

```javascript
eleventyConfig.addWatchTarget("src/_data");
eleventyConfig.addWatchTarget("src/sass");
eleventyConfig.addWatchTarget(`themes/${activeTheme}`);
eleventyConfig.addWatchTarget(localContentPath);
```

**Parameters:**
- `path` (String): Directory path to watch

### Pass-through Copy

#### **`addPassthroughCopy(source, destination)`**

Copies static files to the output directory.

```javascript
// Copy assets
eleventyConfig.addPassthroughCopy({ "src/assets": "/assets" });

// Copy admin interface
eleventyConfig.addPassthroughCopy({ "src/admin": "/admin" });

// Copy content media
eleventyConfig.addPassthroughCopy({ "src/content/posts": "/content/posts" });
```

**Parameters:**
- `source` (String|Object): Source path or mapping object
- `destination` (String): Destination path (optional)

## Custom Filters

### Date Filter

#### **`date(dateObj, format)`**

Formats dates using Luxon with Italian locale support.

```javascript
// In templates
{{ post.date | date("dd LLLL yyyy") }}
{{ post.date | date("yyyy-MM-dd") }}
{{ post.date | date("dd/MM/yyyy") }}
```

**Parameters:**
- `dateObj` (Date|String): Date object or ISO string
- `format` (String): Luxon format string (default: "dd LLLL yyyy")

**Supported Formats:**
- `"dd LLLL yyyy"` → "22 agosto 2025"
- `"yyyy-MM-dd"` → "2025-08-22"
- `"dd/MM/yyyy"` → "22/08/2025"
- `"LLLL yyyy"` → "agosto 2025"

**Example:**
```html
<time datetime="{{ post.date | date('yyyy-MM-dd') }}">
  {{ post.date | date("dd LLLL yyyy") }}
</time>
```

### Slugify Filter

#### **`slugify(str)`**

Converts strings to URL-friendly slugs.

```javascript
// In templates
{{ "My Post Title" | slugify }}
// Output: "my-post-title"

{{ "Hello World!" | slugify }}
// Output: "hello-world"
```

**Parameters:**
- `str` (String): String to convert to slug

**Options:**
- `lower: true` - Convert to lowercase
- `strict: true` - Remove special characters

### Include Markdown Filter

#### **`includeMarkdown(markdownPath)`**

Includes and renders markdown files with Expressive Code support.

```javascript
// In templates
{{ "partials/documentation/example.md" | includeMarkdown }}
```

**Parameters:**
- `markdownPath` (String): Path to markdown file relative to `src/_includes/`

**Features:**
- GitHub Flavored Markdown support
- Syntax highlighting with Expressive Code
- Automatic link attributes
- Error handling with fallback content

**Example:**
```html
<div class="documentation-section">
  {{ "partials/documentation/intro.md" | includeMarkdown }}
</div>
```

## Global Data

### Site Configuration

#### **`site` Object**

Global site configuration from `src/_data/site.json`.

```javascript
// Available in all templates
{{ site.name }}           // "Neutrino - Electron"
{{ site.url }}            // "https://theoddape.it"
{{ site.description }}    // "An Eleventy boilerplate with Decap CMS"
{{ site.logo }}           // "/assets/images/neutrino-logo.svg"
{{ site.favicon }}        // "/assets/images/neutrino-logo.png"
{{ site.theme }}          // "neutrino-electron-core"
{{ site.defaultVisualTheme }} // "dark"
{{ site.contentPath }}    // "${NEUTRINO_CONTENT_PATH}"
```

### Theme Data

#### **`theme` Variable**

Current active theme name.

```javascript
// Available in all templates
{{ theme }} // "neutrino-electron-core" or "neutrino-brand-website"
```

### Computed Data

#### **`eleventyComputed` Object**

Automatically computed data for each page.

```javascript
// Permalink computation
eleventyComputed: {
  permalink: (data) => {
    const input = (data.page?.inputPath || "").replace(/\\/g, "/");
    if (input.includes("/content/posts/")) {
      const slug = data.slug || data.page.fileSlug;
      return `/blog/${slug}/`;
    }
    if (input.includes("/content/documentation/")) {
      const slug = data.slug || data.page.fileSlug;
      return `/documentation/${slug}/`;
    }
    return data.permalink;
  }
}
```

## Collections

### Posts Collection

#### **`collections.posts`**

All blog posts from `src/content/posts/`.

```javascript
// In templates
{% for post in collections.posts %}
  <article>
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    <time>{{ post.data.date | date("dd LLLL yyyy") }}</time>
    <p>{{ post.data.description }}</p>
  </article>
{% endfor %}
```

**Collection Properties:**
- `data.title` - Post title
- `data.date` - Publication date
- `data.author` - Author name
- `data.description` - Post description
- `data.tags` - Array of tags
- `data.draft` - Draft status
- `url` - Post URL
- `fileSlug` - File slug

### Automatic Collections

Neutrino automatically creates collections for:

- **`collections.posts`** - Blog posts
- **`collections.pages`** - Static pages
- **`collections.projects`** - Project showcases
- **`collections.documentation`** - Documentation pages
- **`collections.news`** - News articles

## Template Functions

### Layout System

#### **Base Layout**

```html
<!-- layouts/base.njk -->
 {% raw %}
<!doctype html>
<html lang="en" class="{{ site.defaultVisualTheme }}">
<head>
  <title>{{ postTitle or title }}</title>
  <meta name="description" content="{{ postDescription or description | safe }}">
  <!-- SEO and social meta tags -->
</head>
<body class="{{ postClass or class }}">
  <div class="layout-wrapper">
    <main>
      {% block content %}{% endblock %}
    </main>
    {% if aside %}
      <aside>{% include "partials/" + aside %}</aside>
    {% endif %}
  </div>
</body>
</html>
{% endraw %}
```

#### **Single Post Layout**

```html
{% raw %}
<!-- layouts/single-post.njk -->
{% extends "layouts/base.njk" %}
{% set postTitle = "Neutrino - Electron | " + title %}
{% set postClass = "single-post" %}
{% set postType = "article" %}

{% block content %}
<div class="single-post container">
  <article class="post">
    <header class="boxed">
      <div class="post-date">{{ date | date("dd LLLL yyyy") }}</div>
      <h1 class="page-title">{{ title }}</h1>
      <p class="post-excerpt">{{ description }}</p>
    </header>
    <div class="boxed">{{ content | safe }}</div>
  </article>
</div>
{% endblock %}
{% endraw %}
```

### Template Variables

#### **Page Variables**

```javascript
// Available in all templates
{{ page.url }}           // Current page URL
{{ page.inputPath }}     // Source file path
{{ page.fileSlug }}      // File slug
{{ page.filePathStem }}  // File path without extension
{{ page.date }}          // Page date
{{ page.outputPath }}    // Output file path
```

#### **Content Variables**

```javascript
// Available in content templates
{{ title }}              // Page title
{{ description }}        // Page description
{{ date }}               // Publication date
{{ author }}             // Author name
{{ tags }}               // Array of tags
{{ draft }}              // Draft status
{{ content }}            // Rendered content
```

## Decap CMS API

### Configuration

#### **`src/admin/config.yml`**

Main CMS configuration file.

```yaml
backend:
  name: git-gateway
  branch: main
  repo: "username/repository"
  site_domain: "yourdomain.com"

# Local development
local_backend: true

media_folder: "src/content/media"
public_folder: "/content/media"

collections:
  - name: "posts"
    label: "Blog Posts"
    folder: "src/content/posts"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Author", name: "author", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Tags", name: "tags", widget: "list"}
      - {label: "Draft", name: "draft", widget: "boolean", default: true}
      - {label: "Body", name: "body", widget: "markdown"}
```

### Backend Options

#### **Git Gateway**

```yaml
backend:
  name: git-gateway
  branch: main
  repo: "username/repository"
  site_domain: "yourdomain.com"
```

#### **Test Repository (Development)**

```yaml
backend:
  name: test-repo
  branch: main
```

#### **Proxy Backend**

```yaml
backend:
  name: proxy
  proxy_url: "https://your-cms-backend.com/api/v1"
  branch: main
```

### Widget Types

#### **String Widget**

```yaml
- {label: "Title", name: "title", widget: "string"}
- {label: "Title", name: "title", widget: "string", required: true}
- {label: "Title", name: "title", widget: "string", default: "Default Title"}
```

#### **Text Widget**

```yaml
- {label: "Description", name: "description", widget: "text"}
- {label: "Description", name: "description", widget: "text", hint: "Brief description"}
```

#### **Markdown Widget**

```yaml
- {label: "Body", name: "body", widget: "markdown"}
- {label: "Body", name: "body", widget: "markdown", buttons: ["bold", "italic", "link"]}
```

#### **Datetime Widget**

```yaml
- {label: "Date", name: "date", widget: "datetime"}
- {label: "Date", name: "date", widget: "datetime", format: "YYYY-MM-DD"}
```

#### **Boolean Widget**

```yaml
- {label: "Draft", name: "draft", widget: "boolean"}
- {label: "Draft", name: "draft", widget: "boolean", default: true}
```

#### **List Widget**

```yaml
- {label: "Tags", name: "tags", widget: "list"}
- {label: "Tags", name: "tags", widget: "list", allow_add: true}
```

#### **Image Widget**

```yaml
- {label: "Image", name: "image", widget: "image"}
- {label: "Image", name: "image", widget: "image", media_library: {config: {multiple: false}}}
```

#### **Select Widget**

```yaml
- {label: "Status", name: "status", widget: "select", options: ["draft", "published", "archived"]}
```

#### **Number Widget**

```yaml
- {label: "Price", name: "price", widget: "number"}
- {label: "Price", name: "price", widget: "number", value_type: "float", min: 0}
```

## Build Scripts

### NPM Scripts

#### **Development Scripts**

```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "serve": "concurrently \"npm run watch:css\" \"npx @11ty/eleventy --serve\"",
    "serve:no-watch": "npx @11ty/eleventy --watch"
  }
}
```

#### **Build Scripts**

```json
{
  "scripts": {
    "build": "eleventy",
    "build:css": "node scripts/build.js",
    "build:prod": "NODE_ENV=production npm run build"
  }
}
```

#### **CSS Scripts**

```json
{
  "scripts": {
    "watch:css": "node scripts/watch.js",
    "gen:ec-css": "node scripts/gen-ec-css.js"
  }
}
```

### Build Scripts API

#### **`scripts/build.js`**

CSS compilation script for production.

```javascript
import { execSync } from 'child_process'
import fs from 'fs'

const siteData = JSON.parse(fs.readFileSync('./src/_data/site.json', 'utf-8'))
const theme = siteData.theme || 'default'
const command = `sass src/sass:src/assets/css src/themes/${theme}:src/assets/css --style=compressed`

execSync(command, { stdio: 'inherit' })
```

#### **`scripts/watch.js`**

CSS watching script for development.

```javascript
import { execSync } from 'child_process'
import fs from 'fs'

const siteData = JSON.parse(fs.readFileSync('./src/_data/site.json', 'utf-8'))
const theme = siteData.theme || 'default'
const command = `sass --watch src/sass:src/assets/css src/themes/${theme}:src/assets/css --style=compressed`

execSync(command, { stdio: 'inherit' })
```

#### **`scripts/gen-ec-css.js`**

Expressive Code CSS generation script.

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

## Environment Variables

### Content Management

#### **`NEUTRINO_CONTENT_PATH`**

Path to external content directory.

```bash
# .env file
NEUTRINO_CONTENT_PATH=/path/to/your/content/directory
```

**Usage:**
- Supports absolute and relative paths
- Used in `site.json` with `${NEUTRINO_CONTENT_PATH}` syntax
- Automatically copied to `src/content/` during build

#### **`THEME`**

Override the active theme.

```bash
# .env file
THEME=neutrino-brand-website
```

**Available Themes:**
- `neutrino-electron-core` (default)
- `neutrino-brand-website`

#### **`NODE_ENV`**

Environment mode for build optimization.

```bash
# .env file
NODE_ENV=production
```

**Values:**
- `development` - Development mode with source maps
- `production` - Production mode with optimization

### Environment Variable Expansion

#### **`expandEnv(str)`**

Replaces `${VARIABLE_NAME}` with environment variable values.

```javascript
// In eleventy.config.js
function expandEnv(str) {
  if (typeof str !== "string") return str;
  return str.replace(/\$\{([^}]+)\}/g, (_, key) => process.env[key] ?? "");
}

// Usage
const contentPath = expandEnv("${NEUTRINO_CONTENT_PATH}");
// Result: "/path/to/content" or fallback value
```

## SCSS API

### Core SCSS System

#### **Core Files**

```scss
// src/sass/core.scss
@import '_reset';        // CSS reset and normalization
@import '_variables';    // Global variables and color schemes
@import '_mixins';       // Reusable SCSS mixins
@import '_typography';   // Typography system
```

#### **Theme Files**

```scss
// src/themes/[theme-name]/skin.scss
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

#### **Global Variables**

```scss
// src/sass/_variables.scss
$font-text: 'Geist', sans-serif;
$font-headers: 'Geist', sans-serif;
$font-mono: 'Geist Mono', monospace;

// Color themes
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

#### **Theme Variables**

```scss
// src/themes/[theme-name]/_theme-variables.scss
$custom-primary-color: #your-color;
$custom-font-size: 16px;
$custom-spacing: 1.5rem;
```

### Mixin System

#### **Font Mixin**

```scss
@mixin font($properties) {
  font-style: map.get($properties, style);
  font-variant: map.get($properties, variant);
  font-weight: map.get($properties, weight);
  font-size: map.get($properties, size);
  line-height: map.get($properties, lineHeight);
  font-family: map.get($properties, family);
  text-transform: map.get($properties, transform);
}
```

#### **Flexbox Mixin**

```scss
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
```

#### **Sliding Background Mixin**

```scss
@mixin sliding-background($color, $duration: 0.3s) {
  display: inline-block;
  position: relative;
  overflow: hidden;
  color: #fff;
  
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $color;
    z-index: -1;
    transition: transform $duration;
    transform-origin: left;
    transform: scaleX(0);
  }
  
  &:hover:before {
    transform: scaleX(1);
  }
}
```

## JavaScript API

### Template JavaScript

#### **Theme Toggle**

```javascript
// In base.njk template
<script>
  (function(){
    var ls = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var root = document.documentElement;
    if (ls === 'dark' || (!ls && prefersDark)) root.classList.add('dark');
    else if (ls === 'sepia') root.classList.add('sepia');
  })();
</script>
```

#### **Mobile Menu**

```javascript
// src/assets/js/mobile-menu.js
// Mobile navigation functionality
```

#### **Header Scroll**

```javascript
// src/assets/js/headerscroll.js
// Header scroll behavior
```

#### **Toggle Mode**

```javascript
// src/assets/js/togglemode.js
// Theme toggle functionality
```

### Build JavaScript

#### **Content Directory Setup**

```javascript
// In eleventy.config.js
function setupContentDirectory() {
  const raw = expandEnv(site.contentPath);
  const resolvedRaw = raw && raw.trim().length ? raw : "content";
  
  const contentPath = path.isAbsolute(resolvedRaw)
    ? resolvedRaw
    : path.resolve(process.cwd(), resolvedRaw);
    
  if (!fs.existsSync(contentPath)) {
    throw new Error(`Content path not found: ${contentPath}`);
  }
  
  const localContentDir = path.join(process.cwd(), "src", "content");
  
  if (!fs.existsSync(localContentDir) || fs.readdirSync(localContentDir).length === 0) {
    copyDirectoryRecursive(contentPath, localContentDir);
  }
  
  return localContentDir;
}
```

#### **Directory Copy**

```javascript
// In eleventy.config.js
function copyDirectoryRecursive(source, destination) {
  try {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }
    
    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        copyDirectoryRecursive(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    }
  } catch (error) {
    console.error(`Error during copy: ${error.message}`);
    throw error;
  }
}
```

## Markdown Processing

### Unified Processor

#### **Markdown Configuration**

```javascript
// In eleventy.config.js
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeExpressiveCode, {
    themes: ['github-light', 'github-dark'],
    defaultProps: {
      wrap: true
    }
  })
  .use(rehypeStringify);

eleventyConfig.setLibrary("md", {
  async render(str) {
    const result = await processor.process(str);
    return result.toString();
  }
});
```

### Markdown-it Configuration

#### **Link Attributes**

```javascript
// In eleventy.config.js
const md = new MarkdownIt({
  html: true,
  breaks: true,
  linkify: true
}).use(MarkdownItLinkAttributes, {
  pattern: /^https?:/,
  attrs: {
    target: '_blank',
    rel: 'noopener'
  }
});
```

## Transform API

### Heading IDs and TOC

#### **`addHeadingIdsAndTOC` Transform**

Automatically adds IDs to headings and generates table of contents for documentation pages.

```javascript
// In eleventy.config.js
eleventyConfig.addTransform("addHeadingIdsAndTOC", function(content, outputPath) {
  if (outputPath && outputPath.endsWith('.html') && outputPath.includes('/documentation/')) {
    // Find all h2 elements and add IDs
    const h2Regex = /<h2([^>]*)>(.*?)<\/h2>/gi;
    const headings = [];
    
    content = content.replace(h2Regex, (match, attributes, title) => {
      const cleanTitle = title.replace(/<[^>]*>/g, '').trim();
      const anchor = cleanTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      const hasId = attributes.includes('id=');
      if (!hasId) {
        headings.push({
          title: cleanTitle,
          anchor: anchor
        });
        return `<h2${attributes} id="${anchor}">${title}</h2>`;
      }
      return match;
    });
    
    // Generate TOC HTML
    if (headings.length > 0) {
      let tocHTML = '<nav class="documentation-toc">\n';
      tocHTML += '  <h3>On this page</h3>\n';
      tocHTML += '  <ul>\n';
      
      headings.forEach(heading => {
        tocHTML += `    <li>\n`;
        tocHTML += `      <a href="#${heading.anchor}">${heading.title}</a>\n`;
        tocHTML += `    </li>\n`;
      });
      
      tocHTML += '  </ul>\n';
      tocHTML += '</nav>';
      
      const tocPlaceholderRegex = /<nav class="documentation-toc">[\s\S]*?<\/nav>/gi;
      content = content.replace(tocPlaceholderRegex, tocHTML);
    }
  }
  
  return content;
});
```

## Error Handling

### Build Errors

#### **Content Path Validation**

```javascript
// In eleventy.config.js
if (!fs.existsSync(contentPath)) {
  throw new Error(
    `❌ Content path not found:\n${contentPath}\n\n` +
    `Check your contentPath in site.json or the .env variable NEUTRINO_CONTENT_PATH`
  );
}
```

#### **Markdown Include Errors**

```javascript
// In includeMarkdown filter
try {
  const fullPath = path.join(process.cwd(), 'src', '_includes', markdownPath);
  
  if (fs.existsSync(fullPath)) {
    const markdownContent = fs.readFileSync(fullPath, 'utf-8');
    const result = await processor.process(markdownContent);
    return result.toString();
  } else {
    console.warn(`⚠️  Markdown file not found: ${fullPath}`);
    return `<p>⚠️ Content not found: ${markdownPath}</p>`;
  }
} catch (error) {
  console.error(`❌ Error loading ${markdownPath}:`, error);
  return `<p>❌ Error loading content</p>`;
}
```

## Performance Optimization

### Build Optimization

#### **CSS Compilation**

```javascript
// Production CSS compilation
const command = `sass --no-source-map --style=compressed src/sass:src/assets/css src/themes/${theme}:src/assets/css`;
```

#### **Asset Optimization**

```javascript
// Image optimization (commented out in current config)
// eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt, sizes) {
//   let stats = await Image(src, {
//     widths: [300, 600, 900],
//     formats: ["webp", "jpeg"],
//     outputDir: "./_site/assets/images/"
//   });
//   return `<img src="${stats.webp[0].url}" alt="${alt}" sizes="${sizes}">`;
// });
```

## Best Practices

### Template Development

- Use semantic HTML structure
- Implement proper error handling
- Optimize for performance
- Follow accessibility guidelines

### Content Management

- Validate frontmatter structure
- Use consistent naming conventions
- Implement proper draft management
- Optimize media assets

### Build Process

- Use environment variables for configuration
- Implement proper error handling
- Optimize build performance
- Test across different environments

This comprehensive API reference covers all available functions, filters, and configuration options in Neutrino, providing developers with complete documentation for extending and customizing the system.