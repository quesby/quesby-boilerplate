---
title: Configuration Guide
description: Complete configuration guide for Neutrino Electron site settings
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 3
---

# Configuration Guide

This guide covers all configuration options available in Neutrino, from basic site settings to advanced theme customization and content management.

## Site Configuration

### Basic Site Settings

Configure your site's basic information in `src/_data/site.json`:

```json
{
  "name": "Your Site Name",
  "url": "https://yourdomain.com",
  "description": "Your site description",
  "logo": "/assets/images/your-logo.svg",
  "favicon": "/assets/images/your-favicon.png",
  "theme": "neutrino-electron-core",
  "defaultVisualTheme": "dark",
  "contentPath": "${NEUTRINO_CONTENT_PATH}"
}
```

#### Configuration Options

- **`name`**: Your site's display name
- **`url`**: Your site's base URL (used for absolute links)
- **`description`**: Meta description for SEO
- **`logo`**: Path to your logo image (relative to site root)
- **`favicon`**: Path to your favicon image
- **`theme`**: Active theme name (see [Theme Configuration](#theme-configuration))
- **`defaultVisualTheme`**: Default color theme (`light`, `dark`, or `sepia`)
- **`contentPath`**: Path to external content directory (supports environment variables)

## Environment Variables

### Content Management

Set up external content management using environment variables:

```bash
# .env file
NEUTRINO_CONTENT_PATH=/path/to/your/content/directory
THEME=neutrino-electron-core
```

#### Available Environment Variables

- **`NEUTRINO_CONTENT_PATH`**: Absolute or relative path to your content directory
- **`THEME`**: Override the theme specified in `site.json`

### Environment Variable Expansion

Neutrino supports environment variable expansion in configuration files using `${VARIABLE_NAME}` syntax:

```json
{
  "contentPath": "${NEUTRINO_CONTENT_PATH}"
}
```

## Theme Configuration

### Available Themes

Neutrino comes with two built-in themes:

- **`neutrino-electron-core`**: Modern, minimalist theme with dark/light modes
- **`neutrino-brand-website`**: Brand-focused theme with enhanced visual elements

### Setting the Theme

Configure your active theme in `src/_data/site.json`:

```json
{
  "name": "Neutrino - Electron",
  "url": "https://theoddape.it",
  "description": "An Eleventy boilerplate with Decap CMS",
  "logo": "/assets/images/neutrino-logo.svg",
  "favicon": "/assets/images/neutrino-logo.png",
  "theme": "neutrino-brand-website",
  "defaultVisualTheme": "dark",
  "contentPath": "${NEUTRINO_CONTENT_PATH}"
}
```

### Visual Themes

Each theme supports multiple visual themes:

- **`light`**: Clean, bright appearance
- **`dark`**: Dark mode with high contrast
- **`sepia`**: Warm, vintage appearance

Set the default visual theme in `site.json`:
```json
{
  "defaultVisualTheme": "sepia"
}
```

## CSS and Styling Configuration

### SCSS Variables

Customize your theme by modifying SCSS variables in `src/sass/_variables.scss`:

#### Typography
```scss
$font-text: 'Your Font', sans-serif;
$font-headers: 'Your Header Font', sans-serif;
$font-mono: 'Your Mono Font', monospace;
```

#### Color Palettes
```scss
// Light theme colors
$theme-light: (
  text-fg: oklch(31.85% 0.018 18.1),
  site-bg: oklch(99% 0.000 89.9),
  button-bg: oklch(15% 0 0),
  // ... more color definitions
);

// Dark theme colors
$theme-dark: (
  text-fg: white,
  site-bg: black,
  button-bg: oklch(39.00% 0.012 320.6),
  // ... more color definitions
);
```

#### Layout Variables
```scss
// Breakpoints
$breakpoints: (
  smartphone: 650px,
  tablet: 1024px,
  laptop: 1440px,
  desktop: 1920px
);

// Container max-widths
$container-max-widths: (
  smartphone: 630px,
  tablet: 1002px,
  laptop: 1280px,
  desktop: 1440px
);

// Border radius
$borderRadius-large: 50px;
$borderRadius-normal: 25px;
$borderRadius-small: 7px;
```

### Theme-Specific Variables

Each theme has its own variable file at `src/themes/[theme-name]/_theme-variables.scss`:

```scss
// Override theme-specific variables
$custom-color: #your-color;
$custom-font: 'Your Custom Font', sans-serif;
```

## Content Management Configuration

### Decap CMS Configuration

Configure Decap CMS in `src/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main

# For local development
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
      - {label: "Body", name: "body", widget: "markdown"}
      - {label: "Slug", name: "slug", widget: "string", required: false}
```

#### Backend Options

- **`git-gateway`**: For GitHub/GitLab integration
- **`test-repo`**: For local development
- **`proxy`**: For custom backend integration

#### Collection Configuration

Configure content collections with custom fields:

```yaml
collections:
  - name: "projects"
    label: "Projects"
    folder: "src/content/projects"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Image", name: "image", widget: "image"}
      - {label: "Content", name: "body", widget: "markdown"}
      - {label: "Tags", name: "tags", widget: "list"}
```

## Eleventy Configuration

### Custom Filters

Neutrino includes several custom filters:

#### Date Formatting
```javascript
// In templates
{{ post.date | date("dd LLLL yyyy") }}
{{ post.date | date("yyyy-MM-dd") }}
```

#### Slug Generation
```javascript
// In templates
{{ "My Post Title" | slugify }}
// Output: "my-post-title"
```

#### Markdown Inclusion
```javascript
// In templates
{{ "partials/documentation/example.md" | includeMarkdown }}
```

### Collections

Neutrino automatically creates collections:

- **`posts`**: All blog posts from `src/content/posts/`
- **`projects`**: All projects from `src/content/projects/`
- **`pages`**: All pages from `src/content/pages/`

### URL Structure

Custom URL patterns are configured in `eleventy.config.js`:

- **Posts**: `/blog/[slug]/`
- **Documentation**: `/documentation/[slug]/`
- **Pages**: Custom permalinks from frontmatter

## Build Configuration

### Scripts

Available npm scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "eleventy --serve",
    "build": "eleventy",
    "watch:css": "node scripts/watch.js",
    "build:css": "node scripts/build.js",
    "serve": "concurrently \"npm run watch:css\" \"npx @11ty/eleventy --serve\""
  }
}
```

### Build Process

1. **CSS Compilation**: SCSS files are compiled to CSS
2. **Template Processing**: Nunjucks templates are rendered
3. **Content Processing**: Markdown files are converted to HTML
4. **Asset Copying**: Static assets are copied to output directory

## Advanced Configuration

### Custom Markdown Processing

Neutrino uses a custom markdown processor with:

- **GitHub Flavored Markdown** support
- **Expressive Code** syntax highlighting
- **Automatic link attributes** (target="_blank", rel="noopener")

### Content Directory Structure

```
src/content/
├── posts/ # Blog posts
├── pages/ # Static pages
├── projects/ # Project showcases
├── documentation/ # Documentation pages
├── news/ # News articles
└── media/ # Media files
```


### File Naming Conventions

- **Posts**: Use ULID-based directories for unique URLs
- **Pages**: Use descriptive directory names
- **Media**: Store in `src/content/media/` for CMS access

## Performance Configuration

### Image Optimization

Configure image processing in `eleventy.config.js`:

```javascript
// Image shortcode configuration
eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt, sizes) {
  // Custom image processing logic
});
```

### CSS Optimization

- **Source Maps**: Generated in development mode
- **Minification**: Applied in production builds
- **Critical CSS**: Can be extracted for above-the-fold content

## Troubleshooting Configuration

### Common Issues

1. **Theme not loading**: Check theme name in `site.json` or environment variable
2. **Content not found**: Verify `contentPath` configuration
3. **CSS not compiling**: Check SCSS syntax and file paths
4. **CMS not working**: Verify `config.yml` syntax and backend configuration

### Debug Mode

Enable debug output by setting:
```bash
DEBUG=Eleventy* npm run serve
```

### Configuration Validation

Use the built-in validation:
```bash
npm run build
```

This will show any configuration errors during the build process.

## Best Practices

### Environment Management

- Use `.env` files for sensitive configuration
- Keep production and development configs separate
- Document all custom environment variables

### Theme Development

- Create theme-specific variable files
- Use CSS custom properties for runtime theming
- Test all visual themes (light, dark, sepia)

### Content Organization

- Use consistent naming conventions
- Organize content by type and purpose
- Keep media files in dedicated directories

### Performance

- Optimize images before adding to content
- Use appropriate image formats (WebP for photos, SVG for icons)
- Minimize custom CSS and JavaScript

## Configuration Examples

### Multi-language Site
```json
{
  "name": "My Multilingual Site",
  "url": "https://example.com",
  "languages": ["en", "it", "es"],
  "defaultLanguage": "en"
}
```

### E-commerce Integration
```yaml
# In config.yml
collections:
  - name: "products"
    label: "Products"
    folder: "src/content/products"
    fields:
      - {label: "Name", name: "name", widget: "string"}
      - {label: "Price", name: "price", widget: "number"}
      - {label: "Description", name: "description", widget: "markdown"}

{% include "partials/documentation-nav-footer.njk" %}
```

### Custom Domain Setup
```json
{
  "url": "https://blog.yourdomain.com",
  "canonical": "https://yourdomain.com"
}
```

This configuration guide covers all aspects of setting up and customizing Neutrino for your specific needs.