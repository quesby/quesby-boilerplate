---
title: API Reference
description: Complete API reference for Neutrino Boilerplate functions and filters
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 11
lastUpdated: "2025-11-13"
---

# API Reference

This comprehensive API reference covers all available functions, filters, shortcodes, and configuration options in Neutrino.

> **Note**: This is a complete developer reference. For quick access, see the [API Cheat Sheet](#api-cheat-sheet) below.

## API Cheat Sheet

### Quick Reference - Most Used Functions

**Filters:**
- `{{ title | seoTitle: site.name }}` - SEO title with site name
- `{{ page.url | canonical: site.url }}` - Canonical URL
- `{{ content | absoluteUrl: site.url }}` - Convert relative to absolute URLs
- `{{ date | formatDate: "YYYY-MM-DD" }}` - Format dates
- `{{ content | excerpt: 160 }}` - Generate excerpts

**Shortcodes:**
- `{% image "path", "alt", "class" %}` - Responsive image
- `{% svg "path", "class" %}` - Inline SVG
- `{% code "language" %}...{% endcode %}` - Code block with syntax highlighting

**Global Data:**
- `{{ site.name }}` - Site name
- `{{ site.url }}` - Site URL
- `{{ site.theme }}` - Current theme
- `{{ collections.posts }}` - All blog posts
- `{{ collections.documentation }}` - All documentation pages

**Environment Variables:**
- `NEUTRINO_CONTENT_PATH` - Content directory path
- `THEME` - Active theme name
- `NODE_ENV` - Environment (development/production)

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

Formats dates using Luxon with English locale support.

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
- `"dd LLLL yyyy"` → "22 August 2025"
- `"yyyy-MM-dd"` → "2025-08-22"
- `"dd/MM/yyyy"` → "22/08/2025"
- `"LLLL yyyy"` → "August 2025"

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

### Array Manipulation Filters

#### **`sortBy(arr, attr, direction)`**

Sorts an array by a specified attribute with support for nested properties and flexible direction.

```javascript
// In templates
{{ collections.posts | sortBy("date", "desc") }}
{{ collections.posts | sortBy("data.title", "asc") }}
{{ projects | sortBy("featured", "desc") }}
```

**Parameters:**
- `arr` (Array): Array to sort
- `attr` (String): Attribute to sort by (supports nested properties like "data.date")
- `direction` (String): Sort direction - "asc" (default) or "desc"

**Features:**
- **Nested Property Support**: Access `obj.date` or `obj.data.date` automatically
- **Flexible Direction**: Sort ascending or descending
- **Safe Fallback**: Handles missing properties gracefully
- **Data Object Aware**: Works with Eleventy's data structure

**Examples:**
```twig
<!-- Sort posts by date (newest first) -->
{% for post in collections.posts | sortBy("date", "desc") %}
  <article>{{ post.data.title }}</article>
{% endfor %}

<!-- Sort by title alphabetically -->
{% for page in collections.documentation | sortBy("data.title", "asc") %}
  <h3>{{ page.data.title }}</h3>
{% endfor %}

<!-- Sort by custom field -->
{% for project in collections.projects | sortBy("data.featured", "desc") %}
  <div>{{ project.data.name }}</div>
{% endfor %}
```

#### **`limit(arr, n)`**

Limits an array to the first n elements.

```javascript
// In templates
{{ collections.posts | limit(5) }}
{{ recentPosts | limit(3) }}
```

**Parameters:**
- `arr` (Array): Array to limit
- `n` (Number): Number of elements to keep

**Example:**
```twig
<!-- Show only the 5 most recent posts -->
{% for post in collections.posts | sortBy("date", "desc") | limit(5) %}
  <article>{{ post.data.title }}</article>
{% endfor %}
```

#### **`offset(arr, n)`**

Skips the first n elements of an array.

```javascript
// In templates
{{ collections.posts | offset(3) }}
{{ allItems | offset(10) }}
```

**Parameters:**
- `arr` (Array): Array to process
- `n` (Number): Number of elements to skip

**Example:**
```twig
<!-- Skip the first 3 posts (for pagination) -->
{% for post in collections.posts | sortBy("date", "desc") | offset(3) %}
  <article>{{ post.data.title }}</article>
{% endfor %}
```

#### **Combined Usage**

These filters can be chained together for powerful data manipulation:

```twig
<!-- Sort by date, skip first 5, then show next 10 -->
{% for post in collections.posts | sortBy("date", "desc") | offset(5) | limit(10) %}
  <article>
    <h3>{{ post.data.title }}</h3>
    <time>{{ post.date | date("dd LLLL yyyy") }}</time>
  </article>
{% endfor %}

<!-- Featured projects first, then limit to 6 -->
{% for project in collections.projects | sortBy("data.featured", "desc") | limit(6) %}
  <div class="project">{{ project.data.name }}</div>
{% endfor %}

<!-- Pagination example -->
{% set pageSize = 10 %}
{% set currentPage = 1 %}
{% set offset = (currentPage - 1) * pageSize %}
{% for post in collections.posts | sortBy("date", "desc") | offset(offset) | limit(pageSize) %}
  <article>{{ post.data.title }}</article>
{% endfor %}
```


## Global Data

### Site Configuration

#### **`site` Object**

Global site configuration from `src/_data/site.json`.

```javascript
// Available in all templates
{{ site.name }}           // "Neutrino - Boilerplate"
{{ site.url }}            // "https://theoddape.it"
{{ site.description }}    // "An Eleventy boilerplate with Decap CMS"
{{ site.logo }}           // "/assets/images/neutrino-logo.svg"
{{ site.favicon }}        // "/assets/images/neutrino-logo.png"
{{ site.theme }}          // "neutrino-Boilerplate-core"
{{ site.defaultVisualTheme }} // "dark"
{{ site.contentPath }}    // "${NEUTRINO_CONTENT_PATH}"
```

> **Note**: For detailed configuration options, see the [Configuration Guide](./configuration.md#site-configuration).

### Theme Data

#### **`theme` Variable**

Current active theme name.

```javascript
// Available in all templates
{{ theme }} // "neutrino-Boilerplate-core" or "neutrino-brand-website"
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
{% raw %}
{% for post in collections.posts %}
  <article>
    <h1><a href="{{ post.url }}">{{ post.data.title }}</a></h1>
    <time>{{ post.data.date | date("dd LLLL yyyy") }}</time>
    <p>{{ post.data.description }}</p>
  </article>
{% endfor %}
{% endraw %}
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

## Shortcodes

### Image Shortcode

#### **`{% image %}`** - Responsive Image

Generates responsive images with multiple formats and sizes.

**Syntax:**
```twig
{% image "path/to/image.jpg", "Alt text", "sizes" %}
```

**Parameters:**
- `src` (String): Path to image relative to `src/assets/images/`
- `alt` (String): Alt text for accessibility (required)
- `sizes` (String): CSS sizes attribute (optional, defaults to "100vw")

**Features:**
- Generates AVIF and WebP formats
- Creates multiple sizes: 320px, 640px, 960px, 1280px, original
- Applies lazy loading and async decoding
- Wraps in `<figure>` element

**Example:**
```twig
{% image "hero/cover.jpg", "Site hero image", "(min-width: 768px) 75vw, 100vw" %}
```

### SVG Shortcode

#### **`{% svg %}`** - Inline SVG

Embeds SVG files directly in HTML with optional CSS classes.

**Syntax:**
```twig
{% svg "path/to/icon.svg", "css-classes" %}
```

**Parameters:**
- `svgPath` (String): Path to SVG file relative to `src/`
- `className` (String): CSS classes to apply (optional)

**Features:**
- Inlines SVG content directly
- Applies custom CSS classes
- No additional HTTP requests
- Perfect for icons and graphics

**Example:**
```twig
{% svg "assets/icons/github.svg", "w-6 h-6 text-gray-600" %}
```

## Template Functions

### Layout System

#### **Base Layout**

```html
<!-- layouts/base.njk -->
 {% raw %}
<!doctype html>
<html lang="en" class="{{ site.defaultVisualTheme }}">
<head>
  <title>{{ seoTitle or title }}</title>
  <meta name="description" content="{{ description | safe }}">
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
{% set seoTitle = "Neutrino - Boilerplate | " + title %}
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

### Custom Widgets

#### **ULID Widget**

Custom widget for generating ULID identifiers:

```yaml
# In src/admin/config.yml
collections:
  - name: "posts"
    fields:
      - {label: "ULID", name: "ulid", widget: "ulid"}
```

**Widget Implementation:**
```javascript
// src/admin/ulid-widget.js
CMS.registerWidget({
  name: 'ulid',
  controlComponent: ULIDControl,
  previewComponent: ULIDPreview,
});
```

> **Note**: For complete Decap CMS configuration, see the [Configuration Guide](./configuration.md#decap-cms-configuration).

## Build Scripts

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

#### **ULID Widget (Custom)**

```yaml
- {label: "ID", name: "id", widget: "ulid"}
```

**Features:**
- Automatically generates unique ULID identifiers
- Read-only field to prevent manual editing
- Regeneration capability for new ULIDs
- Custom styling with monospace font
- Integration with Decap CMS widget system

**Usage:**
```yaml
collections:
  - name: "posts"
    fields:
      - {label: "ID", name: "id", widget: "ulid"}
      - {label: "Title", name: "title", widget: "string"}
      # ... other fields
```

## Build Scripts

### NPM Scripts

#### **Development Scripts**

```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "serve": "concurrently \"pnpm run css:watch\" \"npx @11ty/eleventy --serve\"",
    "serve:no-watch": "npx @11ty/eleventy --watch"
  }
}
```

**Script Descriptions:**
- `dev`: Eleventy development server without CSS watching
- `serve`: Full development environment with CSS watching
- `serve:no-watch`: Eleventy development server without CSS watching

#### **Build Scripts**

```json
{
  "scripts": {
    "build": "eleventy",
    "build:css": "node scripts/build.js",
    "build:prod": "NODE_ENV=production pnpm run build"
  }
}
```

#### **CSS Scripts**

```json
{
  "scripts": {
    "watch:css": "node scripts/watch.js",
    "build:css": "node scripts/build.js",
    "gen:ec-css": "node scripts/gen-ec-css.js"
  }
}
```

**Script Descriptions:**
- `watch:css`: Watch and compile SCSS files during development
- `build:css`: One-time CSS compilation for production
- `gen:ec-css`: Generate Expressive Code CSS for syntax highlighting

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
- `neutrino-Boilerplate-core` (default)
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

Automatically adds IDs to headings and generates table of contents for documentation pages using Cheerio for robust HTML parsing.

**Features:**
- **Robust HTML Parsing**: Uses Cheerio instead of regex for accurate HTML processing
- **Code Block Safe**: Automatically excludes code blocks from TOC generation
- **Smart ID Generation**: Creates URL-friendly anchors from heading text
- **Duplicate Prevention**: Skips headings that already have IDs
- **Clean Text Extraction**: Properly handles HTML tags in heading content

```javascript
// In eleventy.config.js
import * as cheerio from 'cheerio';

eleventyConfig.addTransform("addHeadingIdsAndTOC", function(content, outputPath) {
  // Only process HTML files in documentation
  if (outputPath && outputPath.endsWith('.html') && outputPath.includes('/documentation/')) {
    console.log(`Adding heading IDs and TOC for: ${outputPath}`);
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(content);
    const headings = [];
    let headingCount = 0;
    
    // Find all h2 elements and add IDs
    $('h2').each(function() {
      const $heading = $(this);
      const title = $heading.text().trim();
      
      // Skip if already has an ID
      if ($heading.attr('id')) {
        return;
      }
      
      // Generate anchor from title
      const anchor = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      
      // Add ID to heading
      $heading.attr('id', anchor);
      headingCount++;
      
      // Add to headings array for TOC
      headings.push({
        title: title,
        anchor: anchor
      });
    });
    
    // Generate TOC HTML if we have headings
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
      
      // Replace the TOC placeholder in the aside
      $('nav.documentation-toc').replaceWith(tocHTML);
      
      console.log(`Added IDs to ${headingCount} headings and inserted TOC for ${outputPath}`);
    }
    
    return $.html();
  }
  
  return content;
});
```

**Advantages over Regex-based approach:**
- **Accurate Parsing**: Handles complex HTML structures correctly
- **Code Block Exclusion**: Automatically skips content inside `<code>` blocks
- **Better Performance**: More efficient for large HTML documents
- **Error Prevention**: Avoids regex edge cases and special characters
- **Maintainable**: Easier to extend and modify

**Dependencies:**
- `cheerio`: Server-side jQuery implementation for HTML parsing

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
// Image optimization (available but not enabled by default)
// To enable, uncomment and install @11ty/eleventy-img
eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt, sizes) {
  let stats = await Image(src, {
    widths: [300, 600, 900],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/assets/images/"
  });
  return `<img src="${stats.webp[0].url}" alt="${alt}" sizes="${sizes}">`;
});
```

> **Note**: Image optimization is available but requires `@11ty/eleventy-img` package. See [Development Guide](./development.md#image-optimization) for setup.

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

{% include "partials/documentation-nav-footer.njk" %}
- Optimize media assets

### Build Process

- Use environment variables for configuration
- Implement proper error handling
- Optimize build performance
- Test across different environments

This comprehensive API reference covers all available functions, filters, and configuration options in Neutrino, providing developers with complete documentation for extending and customizing the system.