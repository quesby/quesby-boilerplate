---
title: API Cheats Reference
description: Quick reference for Neutrino Electron shortcodes, filters, and common functions
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 10
lastUpdated: "2025-09-26"
---

# API Cheats Reference

Quick reference for the most commonly used shortcodes, filters, and functions in Neutrino Electron.

## Shortcodes

### Image Shortcode
```twig
{% image "path/to/image.jpg", "Alt text", "css-class" %}
{% image "/assets/images/hero.jpg", "Hero image", "hero-image" %}
```

**Parameters:**
- `src` (string): Image path (relative to `/assets/images/`)
- `alt` (string): Alt text for accessibility
- `class` (string, optional): CSS class name

**Output:**
```html
<img src="/assets/images/path/to/image.jpg" alt="Alt text" class="css-class" loading="lazy">
```

### SVG Shortcode
```twig
{% svg "path/to/icon.svg", "css-class" %}
{% svg "/assets/images/logo.svg", "site-logo" %}
```

**Parameters:**
- `src` (string): SVG path (relative to `/assets/images/`)
- `class` (string, optional): CSS class name

**Output:**
```html
<svg class="css-class" role="img" aria-label="SVG icon">
  <!-- SVG content -->
</svg>
```

### Code Shortcode
```twig
{% code "javascript" %}
function hello() {
  console.log("Hello World!");
}
{% endcode %}
```

**Parameters:**
- `language` (string): Programming language for syntax highlighting

## Filters

### SEO Filters

#### `seoTitle`
```twig
{{ title | seoTitle: site.name }}
{{ "My Post" | seoTitle: "My Site" }}
```
**Output:** `"My Post | My Site"`

#### `canonical`
```twig
{{ page.url | canonical: site.url }}
{{ "/blog/post" | canonical: "https://example.com" }}
```
**Output:** `"https://example.com/blog/post/"`

#### `absoluteUrl`
```twig
{{ "/assets/image.jpg" | absoluteUrl: site.url }}
{{ content | absoluteUrl: site.url }}
```
**Output:** `"https://example.com/assets/image.jpg"`

### Date Filters

#### `formatDate`
```twig
{{ date | formatDate: "YYYY-MM-DD" }}
{{ date | formatDate: "MMMM Do, YYYY" }}
{{ date | formatDate: "relative" }}
```
**Output:** `"2024-01-15"`, `"January 15th, 2024"`, `"2 days ago"`

### Content Filters

#### `excerpt`
```twig
{{ content | excerpt: 160 }}
{{ content | excerpt: 300 }}
```
**Output:** First 160/300 characters of content

#### `stripHtml`
```twig
{{ content | stripHtml }}
{{ "<p>Hello <strong>World</strong></p>" | stripHtml }}
```
**Output:** `"Hello World"`

#### `slugify`
```twig
{{ "My Awesome Post!" | slugify }}
{{ "Hello World" | slugify }}
```
**Output:** `"my-awesome-post"`, `"hello-world"`

## Global Data

### Site Data
```twig
{{ site.name }}              // "Neutrino - Electron"
{{ site.url }}               // "https://example.com"
{{ site.description }}       // "Site description"
{{ site.author }}            // "Author Name"
{{ site.logo }}              // "/assets/images/logo.svg"
{{ site.favicon }}           // "/assets/images/favicon.webp"
{{ site.theme }}             // "neutrino-electron-core"
{{ site.defaultVisualTheme }} // "dark"
{{ site.socialImage }}       // "/assets/images/og-image.jpg"
{{ site.twitter }}           // "@username"
{{ site.language }}          // "en-US"
```

### Collections
```twig
{{ collections.posts }}           // All blog posts
{{ collections.documentation }}   // All documentation pages
{{ collections.pages }}           // All regular pages
{{ collections.projects }}         // All project pages
{{ collections.news }}            // All news items
```

### Page Data
```twig
{{ page.url }}              // Current page URL
{{ page.date }}             // Page creation date
{{ page.inputPath }}        // Source file path
{{ page.outputPath }}       // Output file path
{{ page.fileSlug }}         // URL slug
{{ page.filePathStem }}     // File path without extension
```

## Frontmatter Fields

### Common Fields
```yaml
---
title: "Page Title"
description: "Page description"
date: 2024-01-15
author: "Author Name"
tags: ["tag1", "tag2"]
draft: false
---
```

### SEO Fields
```yaml
---
seoTitle: "Custom SEO Title"
seoDescription: "Custom SEO description"
seoImage: "/custom-image.jpg"
seoKeywords: "keyword1, keyword2"
seoCanonical: "https://example.com/custom-url"
seoNoIndex: false
seoNoFollow: false
---
```

### Content Fields
```yaml
---
image: "/assets/images/featured.jpg"
postType: "article"  # or "website"
noindex: false
class: "custom-page-class"
---
```

## Template Variables

### Layout Variables
```twig
{{ postClass }}             // CSS class for post pages
{{ postType }}              // Open Graph type
{{ class }}                 // Page-specific CSS class
```

### Theme Variables
```twig
{{ theme }}                 // Current theme name
{{ site.theme }}            // Same as above
```

## Environment Variables

### Available Variables
```bash
NEUTRINO_CONTENT_PATH=/path/to/content
THEME=neutrino-electron-core
NODE_ENV=development
```

### Usage in Templates
```twig
{{ env.NEUTRINO_CONTENT_PATH }}
{{ env.THEME }}
{{ env.NODE_ENV }}
```

## Common Patterns

### Blog Post Loop
```twig
{% for post in collections.posts %}
  <article>
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    <p>{{ post.data.description }}</p>
    <time>{{ post.date | formatDate: "MMMM Do, YYYY" }}</time>
  </article>
{% endfor %}
```

### Navigation Menu
```twig
<nav>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/blog/">Blog</a></li>
    <li><a href="/documentation/">Docs</a></li>
  </ul>
</nav>
```

### Social Meta Tags
```twig
<meta property="og:title" content="{{ seoTitle or title }}">
<meta property="og:description" content="{{ description }}">
<meta property="og:image" content="{{ image | absoluteUrl: site.url }}">
<meta property="og:url" content="{{ page.url | canonical: site.url }}">
```

### Conditional Content
```twig
{% if draft %}
  <div class="draft-notice">This is a draft</div>
{% endif %}

{% if tags %}
  <div class="tags">
    {% for tag in tags %}
      <span class="tag">{{ tag }}</span>
    {% endfor %}
  </div>
{% endif %}
```

## Quick Commands

### Development
```bash
pnpm run serve          # Start development server
pnpm run dev            # Eleventy only (no CSS watch)
pnpm run css:watch      # CSS watching only
```

### Build
```bash
pnpm run build          # Production build
pnpm run css:build      # CSS build only
```

### Utilities
```bash
pnpm run gen:ec-css     # Generate Expressive Code CSS
```

## Troubleshooting

### Common Issues
- **Images not loading**: Check path starts with `/assets/`
- **CSS not updating**: Run `pnpm run css:build`
- **Content not showing**: Check `NEUTRINO_CONTENT_PATH`
- **Theme not applied**: Verify `theme` in `site.json`

### Debug Mode
```bash
DEBUG=Eleventy* pnpm run serve
```

---

> **Need more details?** See the complete [API Reference](./api-reference.md) for advanced usage and configuration options.
