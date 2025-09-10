---
title: SEO System
description: Complete guide to the advanced SEO system implemented in Neutrino Electron
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
class: documentation
---

# SEO System

Neutrino Electron includes a comprehensive SEO system inspired by modern best practices, providing automatic meta tag generation, social media optimization, and search engine optimization features.

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

## Advanced Features

### Fallback System

The SEO system uses an intelligent fallback hierarchy:

1. **Title**: `seoTitle` → `postTitle` → `title` → `site.name`
2. **Description**: `postDescription` → `description` → `site.description`
3. **Image**: `postImage` → `image` → `site.socialImage`

### Image Handling

Images are automatically processed:
- Relative URLs are converted to absolute URLs
- Social images default to 1200x630px for optimal sharing
- Alt text is automatically generated from the page title

### Robots Control

Control search engine indexing:
- `noindex: true` - Excludes page from search engines
- `noindex: false` or omitted - Allows indexing (default)

## SEO Filters

The system provides several Nunjucks filters for advanced usage:

### `canonical`
Generate canonical URLs:
{% raw %}
```njk
<link rel="canonical" href="{{ page.url | canonical: site.url }}">
```

### `seoTitle`
Build SEO titles with site name:
```njk
<title>{{ title | seoTitle: site.name }}</title>
```

### `absoluteUrl`
Convert relative URLs to absolute:
```njk
<meta property="og:image" content="{{ image | absoluteUrl: site.url }}">
```

### `seoDescription`
Handle description fallbacks:
```njk
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

## Future Enhancements

Planned improvements include:
- JSON-LD structured data support
- Automatic sitemap generation
- Advanced social media optimization
- SEO analytics integration
- A/B testing for meta descriptions

---

For more information about content management and site configuration, see the [Content Management](/documentation/content-management/) and [Configuration](/documentation/configuration/) sections.
