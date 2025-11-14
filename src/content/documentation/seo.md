---
title: SEO System
description: Complete guide to the advanced SEO system implemented in Quesby Boilerplate
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 8
lastUpdated: "2025-09-12"
---

# SEO System

Quesby Boilerplate includes a comprehensive SEO system inspired by modern best practices, providing automatic meta tag generation, social media optimization, and search engine optimization features.

## Overview

The SEO system automatically generates:
- Dynamic page titles with fallback system
- Meta descriptions with intelligent fallbacks
- Open Graph tags for social media sharing
- Twitter Cards for enhanced social presence
- Canonical URLs to prevent duplicate content
- Meta robots tags for indexing control

## Configuration

### Site Configuration

Configure your site's SEO settings in `src/_data/site.json`:

```json
{
  "name": "Your Site Name",
  "url": "https://yourdomain.com",
  "description": "Your site description",
  "socialImage": "/assets/images/og-image.jpg",
  "twitter": "@yourhandle",
  "language": "en-US"
}
```

### SEO Fields

The system supports the following frontmatter fields:

| Field | Type | Description | Fallback |
|-------|------|-------------|----------|
| `seoTitle` | String | Custom SEO title | `title` → `site.name` |
| `description` | String | Page description | `site.description` |
| `image` | String | Social sharing image | `site.socialImage` |
| `noindex` | Boolean | Exclude from search engines | `false` |
| `postType` | String | Open Graph type (article, website) | `website` |

> **Note**: For detailed frontmatter configuration, see the [Content Management Guide](./content-management.md#frontmatter-schema).

## Usage Examples

### Basic Page

```yaml
---
title: "My Page Title"
description: "This is a great page about something interesting"
---
```

### Blog Post with Custom SEO

```yaml
---
title: "How to Build Amazing Websites"
description: "Learn the secrets of modern web development"
seoTitle: "Complete Guide: Building Amazing Websites in 2024"
image: "/images/amazing-websites.jpg"
postType: "article"
---
```

### Private Page (No Index)

```yaml
---
title: "Draft Content"
description: "This is a work in progress"
noindex: true
---
```

## Complete HTML Output Example

Here's what the generated HTML looks like for a blog post:

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- SEO Meta Tags -->
  <title>Complete Guide: Building Amazing Websites in 2024</title>
  <meta name="description" content="Learn the secrets of modern web development">
  <meta name="keywords" content="web development, websites, programming">
  <link rel="canonical" href="https://yourdomain.com/blog/amazing-websites">
  
  <!-- Open Graph Tags -->
  <meta property="og:title" content="Complete Guide: Building Amazing Websites in 2024">
  <meta property="og:description" content="Learn the secrets of modern web development">
  <meta property="og:image" content="https://yourdomain.com/images/amazing-websites.jpg">
  <meta property="og:url" content="https://yourdomain.com/blog/amazing-websites">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="Your Site Name">
  
  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@yourhandle">
  <meta name="twitter:title" content="Complete Guide: Building Amazing Websites in 2024">
  <meta name="twitter:description" content="Learn the secrets of modern web development">
  <meta name="twitter:image" content="https://yourdomain.com/images/amazing-websites.jpg">
  
  <!-- Additional Meta Tags -->
  <meta name="robots" content="index, follow">
  <meta name="author" content="Your Name">
  <meta name="language" content="en-US">
</head>
<body>
  <!-- Page content -->
</body>
</html>
```
```

## Generated Meta Tags

The system automatically generates the following meta tags:

### Basic SEO
- `<title>` - Dynamic title with fallback
- `<meta name="description">` - Page description
- `<meta name="robots">` - Indexing control
- `<link rel="canonical">` - Canonical URL

### Open Graph
- `og:locale` - Page language
- `og:type` - Content type (website/article)
- `og:site_name` - Site name
- `og:title` - Page title
- `og:description` - Page description
- `og:url` - Page URL
- `og:image` - Social sharing image (if provided)
- `og:image:width` - Image width (1200px)
- `og:image:height` - Image height (630px)
- `og:image:alt` - Image alt text

### Twitter Cards
- `twitter:card` - Card type (summary/summary_large_image)
- `twitter:site` - Twitter handle (if configured)
- `twitter:title` - Page title
- `twitter:description` - Page description
- `twitter:image` - Social sharing image (if provided)

**Twitter Card Types:**
- **`summary`**: Small card with title, description, and small image (120x120px)
- **`summary_large_image`**: Large card with title, description, and large image (1200x630px)

> **Note**: The system uses `summary_large_image` by default for better social media engagement.

## Advanced Features

### Fallback System

The SEO system uses an intelligent fallback hierarchy:

1. **Title**: `seoTitle` → `postTitle` → `title` → `site.name`
2. **Description**: `description` → `site.description`
3. **Image**: `image` → `site.socialImage`

### Image Handling

Images are automatically processed:
- Relative URLs are converted to absolute URLs
- Social images default to 1200x630px for optimal sharing
- Alt text is automatically generated from the page title

### Robots Control

Control search engine indexing:
- `noindex: true` - Excludes page from search engines

### Structured Data (JSON-LD)

The system includes structured data for better search engine understanding:

**Blog Post Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Complete Guide: Building Amazing Websites in 2024",
  "description": "Learn the secrets of modern web development",
  "image": "https://yourdomain.com/images/amazing-websites.jpg",
  "author": {
    "@type": "Person",
    "name": "Your Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Your Site Name",
    "logo": {
      "@type": "ImageObject",
      "url": "https://yourdomain.com/assets/images/logo.png"
    }
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-15"
}
```

**Website Example:**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Your Site Name",
  "url": "https://yourdomain.com",
  "description": "Your site description",
  "publisher": {
    "@type": "Organization",
    "name": "Your Site Name"
  }
}
```

> **Note**: Structured data is automatically generated based on content type and frontmatter fields.
- `noindex: false` or omitted - Allows indexing (default)

## SEO Filters

The system provides several Nunjucks filters for advanced usage:

### `canonical`
Generate canonical URLs with proper handling:

{% raw %}
```twig
<link rel="canonical" href="{{ page.url | canonical: site.url }}">
```
{% endraw %}

**Canonical URL Handling:**
- **Trailing Slash**: Automatically adds trailing slash to URLs
- **Query Parameters**: Removes query parameters for clean canonical URLs
- **Protocol**: Uses HTTPS if `site.url` uses HTTPS
- **Domain**: Converts relative URLs to absolute using `site.url`

**Examples:**
- `page.url = "/blog/post"` → `https://yourdomain.com/blog/post/`
- `page.url = "/about?ref=home"` → `https://yourdomain.com/about/`
- `page.url = "/contact/"` → `https://yourdomain.com/contact/`

### `seoTitle`
Build SEO titles with site name:
```twig
<title>{{ title | seoTitle: site.name }}</title>
```

### `absoluteUrl`
Convert relative URLs to absolute:
```twig
<meta property="og:image" content="{{ image | absoluteUrl: site.url }}">
```

### `seoDescription`
Handle description fallbacks:
```twig
<meta name="description" content="{{ description | seoDescription: site.description }}">
```
{% endraw %}


## Best Practices

### Title Optimization
- Keep titles under 60 characters
- Include your brand name when appropriate
- Use descriptive, keyword-rich titles
- Avoid keyword stuffing

### Description Optimization
- Write compelling descriptions (150-160 characters)
- Include a call-to-action when appropriate
- Make each description unique
- Use active voice and engaging language

### Image Optimization
- Use high-quality images (1200x630px recommended)
- Optimize file sizes for web
- Include descriptive alt text
- Use consistent branding

### Content Structure
- Use proper heading hierarchy (H1, H2, H3)
- Include relevant keywords naturally
- Write for humans first, search engines second
- Keep content fresh and updated

## Troubleshooting

### Common Issues

**Meta tags not appearing:**
- Check that the page uses the `base.njk` layout
- Verify frontmatter fields are correctly formatted
- Ensure `site.json` is properly configured

**Images not displaying in social shares:**
- Verify image URLs are absolute or properly configured
- Check image dimensions (1200x630px recommended)
- Test with social media debugging tools

**Canonical URLs incorrect:**
- Ensure `site.url` is properly set in `site.json`
- Check that URLs don't have trailing slashes issues
- Verify the `canonical` filter is working correctly

### Testing Tools

Use these tools to test your SEO implementation:

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [SEO Meta Tags Checker](https://www.seoptimer.com/meta-tags)

## Migration from Basic SEO

If you're upgrading from the basic SEO system:

1. **Update frontmatter**: Add `seoTitle` and `image` fields where needed
2. **Configure site.json**: Add `socialImage` and `twitter` fields
3. **Test thoroughly**: Verify all meta tags are generating correctly
4. **Update content**: Add descriptions and images to existing content

## Performance Considerations

The SEO system is designed to be lightweight and fast:
- Meta tags are generated at build time
- No runtime JavaScript required
- Minimal impact on page load speed
- Optimized for static site generation

## Additional Features

The SEO system also includes:

- **Automatic Sitemap Generation**: XML sitemap for search engines
- **Robots.txt**: Automatic generation with proper directives
- **Social Media Optimization**: Open Graph and Twitter Cards
- **Performance**: Zero JavaScript overhead - all SEO is static

---

For more information about content management and site configuration, see the [Content Management](/documentation/content-management/) and [Configuration](/documentation/configuration/) sections.
