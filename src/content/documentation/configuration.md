---
title: Configuration Guide
description: Complete configuration guide for Neutrino Electron site settings
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 3
lastUpdated: "2025-09-12"
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

> **Note**: For detailed environment setup instructions, see the [Installation Guide](./installation.md#environment-configuration).

### Configuration Priority

The system checks configurations in this order (first found wins):

1. **Environment variable** (`.env` file) - Highest priority
2. **site.json** configuration - Fallback  
3. **Default** (`src/content`) - If neither is set

### Available Environment Variables

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

| Theme | Description | Location |
|-------|-------------|----------|
| `neutrino-electron-core` | Modern, minimalist design | `src/themes/neutrino-electron-core/` |
| `neutrino-brand-website` | Brand-focused with enhanced visuals | `src/themes/neutrino-brand-website/` |

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

### Creating Custom Themes

**Quick Start:**
```bash
# 1. Copy an existing theme
cp -r src/themes/neutrino-electron-core src/themes/my-custom-theme

# 2. Set your theme
echo 'THEME=my-custom-theme' >> .env

# 3. Start customizing
code src/themes/my-custom-theme/
```

**Theme Structure:**
```
src/themes/my-custom-theme/
├── skin.scss              # Main theme file
├── _theme-variables.scss  # Override global variables
├── _theme-typography.scss # Typography overrides
├── _base.scss            # Base styles
├── _forms.scss           # Form styles
├── _theme-header.scss    # Header styles
├── _page.scss            # Page layouts
├── _home.scss            # Homepage styles
├── _blog.scss            # Blog styles
├── _documentation.scss   # Documentation styles
└── _responsive.scss      # Responsive design
```

> **Learn more**: See [Theme Development Guide](./themes.md) for detailed customization instructions.

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

#### Configuration Logic

Decap CMS follows this pattern for each collection:
1. **Folder** → Where content files are stored
2. **Slug** → How URLs are generated  
3. **Fields** → What data can be edited

#### Basic Configuration

```yaml
backend:
  name: git-gateway
  branch: main

# For local development
local_backend: true

media_folder: "src/content/media"
public_folder: "/content/media"
```

#### Collection Configuration

```yaml
collections:
  - name: "posts"                    # Collection name
    label: "Blog Posts"              # Display name in CMS
    folder: "src/content/posts"      # Where files are stored
    create: true                     # Allow creating new posts
    slug: "{{slug}}"                 # URL pattern
    fields:                          # Editable fields
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Body", name: "body", widget: "markdown"}
      - {label: "Slug", name: "slug", widget: "string", required: false}
```

#### Field Types Available

| Widget | Description | Use Case |
|--------|-------------|----------|
| `string` | Single line text | Title, slug |
| `text` | Multi-line text | Description, excerpt |
| `markdown` | Rich text editor | Post content |
| `image` | Image upload | Featured images |
| `datetime` | Date/time picker | Publication date |
| `boolean` | Checkbox | Draft status |
| `list` | Array of values | Tags, categories |
| `ulid` | Unique identifier | Post ID |

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

> **Note**: Eleventy configuration is handled by the `@neutrino/core` package. For advanced customization, see the [Development Guide](./development.md#eleventy-configuration).

### Custom Filters

Neutrino includes several custom filters defined in `node_modules/@neutrino/core/src/eleventy/filters.js`:

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

#### Available Filters

| Filter | Description | Example |
|--------|-------------|---------|
| `date` | Format dates | `{{ post.date \| date("dd LLLL yyyy") }}` |
| `slugify` | Create URL slugs | `{{ "My Title" \| slugify }}` |
| `includeMarkdown` | Include markdown files | `{{ "partials/help.md" \| includeMarkdown }}` |
| `formatNumber` | Format numbers | `{{ 1234 \| formatNumber }}` |

### Adding Custom Filters

To add custom filters, extend the Eleventy configuration in `eleventy.config.js`:

```javascript
export default function (eleventyConfig) {
  const coreConfig = neutrino(eleventyConfig);
  
  // Add custom filter
  eleventyConfig.addFilter("myCustomFilter", function(value) {
    return value.toUpperCase();
  });
  
  return {
    ...coreConfig,
    // ... other config
  };
}
```

### Collections

Neutrino automatically creates collections defined in `node_modules/@neutrino/core/src/eleventy/config.js`:

- **`posts`**: All blog posts from `src/content/posts/`
- **`projects`**: All projects from `src/content/projects/`
- **`pages`**: All pages from `src/content/pages/`

#### Collection Configuration Location

Collections are configured in the core package:

```javascript
// In node_modules/@neutrino/core/src/eleventy/config.js
eleventyConfig.addCollection('posts', collection => {
  const posts = collection.getFilteredByGlob([
    'src/content/posts/*/index.md',
    'src/content/posts/*--*/index.md'
  ]);
  return posts;
});
```

> **Note**: To add custom collections, extend the Eleventy configuration in `eleventy.config.js`.

### URL Structure

Custom URL patterns are configured in `node_modules/@neutrino/core/src/eleventy/config.js`:

- **Posts**: `/blog/[slug]/`
- **Documentation**: `/documentation/[slug]/`
- **Pages**: Custom permalinks from frontmatter

#### URL Configuration Location

URL patterns are defined in the core package:

```javascript
// In node_modules/@neutrino/core/src/eleventy/config.js
eleventyConfig.addGlobalData("eleventyComputed", {
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
});
```

> **Note**: To customize URL patterns, extend the Eleventy configuration in `eleventy.config.js`.

## Build Configuration

### Package Manager Configuration

> **Note**: For detailed package manager setup, see the [Installation Guide](./installation.md#package-manager-options).

The project is configured to work with pnpm, npm, or yarn. The `package.json` includes:

```json
{
  "packageManager": "pnpm@8.0.0"
}
```

This ensures consistent package manager usage across different environments.

### Scripts

Available scripts in `package.json` (works with pnpm, npm, or yarn):

```json
{
  "scripts": {
    "css:build": "node scripts/build.js",
    "css:watch": "node scripts/watch.js",
    "dev": "eleventy --serve",
    "build": "pnpm run css:build && eleventy",
    "serve": "concurrently \"pnpm run css:watch\" \"npx @11ty/eleventy --serve\""
  }
}
```

### Build Process

1. **CSS Compilation**: SCSS files are compiled to CSS
2. **Template Processing**: Nunjucks templates are rendered
3. **Content Processing**: Markdown files are converted to HTML using unified processor with Expressive Code
4. **Asset Copying**: Static assets are copied to output directory

## Advanced Configuration

### Custom Markdown Processing

Neutrino uses a unified processor for markdown processing with:

- **GitHub Flavored Markdown** support via remark-gfm
- **Expressive Code** syntax highlighting via rehype-expressive-code
- **Automatic link attributes** (target="_blank", rel="noopener")
- **Automatic image processing** with eleventy-img integration
- **Template engine**: Nunjucks (not Twig)

#### Markdown Configuration Location

The markdown processor is configured in `node_modules/@neutrino/core/src/eleventy/config.js`:

```javascript
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeImages)
  .use(rehypeExpressiveCode, {
    themes: ['github-light', 'github-dark'],
    defaultProps: { wrap: true }
  })
  .use(rehypeStringify);
```

> **Note**: To customize markdown processing, extend the Eleventy configuration in `eleventy.config.js`.

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

#### Critical CSS Extraction

For production optimization, consider extracting critical CSS:

```bash
# Install critical CSS tool
pnpm add -D critical

# Extract critical CSS
npx critical src/index.html --base src --css src/assets/css/skin.css --width 1300 --height 900 --out dist/critical.css
```

> **Learn more**: See [Critical CSS Guide](https://web.dev/extract-critical-css/) for detailed optimization strategies.

## Troubleshooting Configuration

### Common Issues

1. **Theme not loading**: Check theme name in `site.json` or environment variable
2. **Content not found**: Verify `contentPath` configuration
3. **CSS not compiling**: Check SCSS syntax and file paths
4. **CMS not working**: Verify `config.yml` syntax and backend configuration

### Debug Mode

Enable debug output by setting:
```bash
DEBUG=Eleventy* pnpm run serve
```

### Configuration Validation

Use the built-in validation:
```bash
pnpm run build
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

> **⚠️ Note**: Multi-language support is experimental. Requires custom routing and template logic. See [i18n documentation](https://www.11ty.dev/docs/plugins/i18n/) for implementation details.

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
```

> **⚠️ Note**: E-commerce integration requires external payment processing and inventory management. This example shows content structure only.

### Custom Domain Setup
```json
{
  "url": "https://blog.yourdomain.com",
  "canonical": "https://yourdomain.com"
}
```

> **✅ Note**: Custom domain setup is fully supported. Update DNS records to point to your hosting provider.

### Advanced Use Cases

#### Headless CMS with External API
```javascript
// In eleventy.config.js
export default function (eleventyConfig) {
  // Fetch data from external API
  eleventyConfig.addGlobalData("products", async () => {
    const response = await fetch("https://api.example.com/products");
    return response.json();
  });
}
```

#### Custom Build Pipeline
```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production pnpm run build",
    "deploy": "pnpm run build:prod && rsync -av _site/ user@server:/path/to/site/",
    "preview": "pnpm run build:prod && serve _site"
  }
}
```

## Configuration Summary

### Quick Reference

| Configuration Type | File Location | Priority | Use Case |
|-------------------|---------------|----------|----------|
| **Environment Variables** | `.env` | Highest | Development, secrets |
| **Site Settings** | `src/_data/site.json` | Medium | Project defaults |
| **Theme Settings** | `src/themes/[theme]/` | Medium | Visual customization |
| **CMS Settings** | `src/admin/config.yml` | Medium | Content management |
| **Eleventy Config** | `eleventy.config.js` | Low | Advanced customization |

### Next Steps

After configuring your site:

1. **[Content Management](./content-management.md)** - Learn to manage content
2. **[Theme Development](./themes.md)** - Customize appearance
3. **[Development Guide](./development.md)** - Advanced customization
4. **[Deployment Guide](./deployment.md)** - Publish your site

This configuration guide covers all aspects of setting up and customizing Neutrino for your specific needs.