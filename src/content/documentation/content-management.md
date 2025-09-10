---
title: Content Management Guide
description: Complete guide to content management in Neutrino Electron
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
class: documentation
order: 4
---

# Content Management Guide

This comprehensive guide covers all aspects of content management in Neutrino, from basic content creation to advanced CMS integration and workflow management.

## Content Architecture

### Content Types

Neutrino supports four main content types, each with specific purposes and metadata:

#### **Posts** - Blog Articles
- **Purpose**: News, articles, and blog content
- **Location**: `src/content/posts/`
- **URL Pattern**: `/blog/[slug]/`
- **Features**: Tags, categories, author attribution, publication dates

#### **Pages** - Static Content
- **Purpose**: About pages, contact forms, landing pages
- **Location**: `src/content/pages/`
- **URL Pattern**: Custom permalinks from frontmatter
- **Features**: Menu ordering, custom layouts, SEO metadata

#### **Projects** - Portfolio Items
- **Purpose**: Showcase work, case studies, project documentation
- **Location**: `src/content/projects/`
- **URL Pattern**: `/projects/[slug]/`
- **Features**: Client information, technologies, featured status, external links

#### **Documentation** - Technical Docs
- **Purpose**: API references, guides, tutorials
- **Location**: `src/content/documentation/`
- **URL Pattern**: `/documentation/[slug]/`
- **Features**: Hierarchical structure, cross-references, code examples

### Content Structure

Each content item follows a consistent directory structure:
```
src/content/
├── posts/ # Blog posts
│ └── [ulid-id]/ # Unique identifier directory
│ └── index.md # Post content
├── pages/ # Static pages
│ └── [ulid-id]/ # Unique identifier directory
│ └── index.md # Page content
├── projects/ # Portfolio projects
│ └── [ulid-id]/ # Unique identifier directory
│ └── index.md # Project content
├── documentation/ # Technical documentation
│ └── [slug].md # Documentation files
├── news/ # News articles
│ └── [ulid-id]/ # Unique identifier directory
│ └── index.md # News content
└── media/ # Media files
├── images/ # Images
├── documents/ # PDFs, etc.
└── videos/ # Video files
```


## ULID System

### What is ULID?

Neutrino uses **ULID (Universally Unique Lexicographically Sortable Identifier)** for content identification:

- **26 characters**: Compact and URL-friendly
- **Chronologically sortable**: Newer content has higher ULIDs
- **URL-safe**: No special characters
- **Collision-resistant**: Extremely low probability of duplicates

### ULID Benefits

```javascript
// Example ULID: 01J4QW0Z9K6QH8E6Z2GQW7C1ZR
// Breakdown:
// 01J4QW0Z9K6QH8E6Z2GQW7C1ZR
// ^^^^^^^^^^^^ ^^^^^^^^^^^^^^
// Timestamp    Randomness
// (48 bits)    (80 bits)
```

**Advantages:**
- **Sortable**: Natural chronological ordering
- **Unique**: Globally unique identifiers
- **Readable**: Human-friendly format
- **Database-friendly**: Efficient indexing and querying

### ULID Generation

ULIDs are automatically generated when creating new content:

```bash
# Automatic generation in Decap CMS
# Manual generation using Node.js
import { ulid } from 'ulid';
const newId = ulid(); // 01J4QW0Z9K6QH8E6Z2GQW7C1ZR
```

## Frontmatter Schema

### Common Fields

All content types share these standard frontmatter fields:

```yaml
---
id: 01J4QW0Z9K6QH8E6Z2GQW7C1ZR    # ULID identifier
title: "Content Title"              # Display title
slug: "content-title"               # URL-friendly slug
description: "Brief description"    # Meta description
date: '2025-08-22'                  # Publication date
author: "Author Name"               # Content author
type: "post"                        # Content type
createdAt: 2025-08-22T10:15:00Z    # Creation timestamp
aliases: []                         # URL aliases
tags: ['tag1', 'tag2']             # Content tags
draft: false                        # Publication status
---
```

### Content-Specific Fields

#### Posts
```yaml
---
# ... common fields ...
featured: true                      # Featured post flag
category: "Technology"              # Post category
readingTime: 5                      # Estimated reading time
excerpt: "Post summary"             # Custom excerpt
---
```

#### Pages
```yaml
---
# ... common fields ...
menu_order: 1                       # Navigation order
layout: "custom-layout"             # Custom template
show_in_menu: true                  # Include in navigation
seo_title: "Custom SEO Title"       # Override page title
---
```

#### Projects
```yaml
---
# ... common fields ...
client: "Client Name"               # Project client
technologies: ['React', 'Node.js']  # Tech stack
url: 'https://project-url.com'      # Live project URL
github: 'https://github.com/...'    # Source code
featured: true                      # Featured project
status: "completed"                 # Project status
---
```

## Decap CMS Integration

### Configuration

Decap CMS is configured in `src/admin/config.yml`:

```yaml
backend:
  name: git-gateway
  branch: main

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
      - {label: "Draft", name: "draft", widget: "boolean"}
      - {label: "Body", name: "body", widget: "markdown"}
```

### Backend Options

#### Git Gateway (Production)
```yaml
backend:
  name: git-gateway
  branch: main
  repo: "username/repository"
  site_domain: "yourdomain.com"
```

#### Test Repository (Development)
```yaml
backend:
  name: test-repo
  branch: main
```

#### Proxy Backend (Custom)
```yaml
backend:
  name: proxy
  proxy_url: "https://your-cms-backend.com/api/v1"
  branch: main
```

### Collection Configuration

#### Posts Collection
```yaml
collections:
  - name: "posts"
    label: "Blog Posts"
    folder: "src/content/posts"
    create: true
    slug: "{{slug}}"
    sortable_fields: ['date', 'title']
    view_filters:
      - {label: "Drafts", field: "draft", pattern: true}
      - {label: "Published", field: "draft", pattern: false}
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Slug", name: "slug", widget: "string", required: false}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Author", name: "author", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Tags", name: "tags", widget: "list"}
      - {label: "Draft", name: "draft", widget: "boolean", default: true}
      - {label: "Featured", name: "featured", widget: "boolean", default: false}
      - {label: "Body", name: "body", widget: "markdown"}
```

#### Projects Collection
```yaml
collections:
  - name: "projects"
    label: "Projects"
    folder: "src/content/projects"
    create: true
    slug: "{{slug}}"
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Client", name: "client", widget: "string"}
      - {label: "Description", name: "description", widget: "text"}
      - {label: "Technologies", name: "technologies", widget: "list"}
      - {label: "Project URL", name: "url", widget: "string", required: false}
      - {label: "GitHub URL", name: "github", widget: "string", required: false}
      - {label: "Featured", name: "featured", widget: "boolean", default: false}
      - {label: "Status", name: "status", widget: "select", options: ["planning", "in-progress", "completed", "on-hold"]}
      - {label: "Body", name: "body", widget: "markdown"}
```

## Content Creation Workflow

### Using Decap CMS

1. **Access Admin Panel**
   ```
   http://localhost:8080/admin
   ```

2. **Select Content Type**
   - Choose from Posts, Pages, Projects, or Documentation

3. **Fill Content Form**
   - Complete all required fields
   - Add markdown content in the body field
   - Set publication status (draft/published)

4. **Save and Publish**
   - Save as draft for later editing
   - Publish immediately to make content live

### Manual Content Creation

#### 1. Create Directory Structure
```bash
# Generate new ULID
node -e "console.log(require('ulid').ulid())"
# Output: 01J4QW0Z9K6QH8E6Z2GQW7C1ZR

# Create directory
mkdir -p src/content/posts/01J4QW0Z9K6QH8E6Z2GQW7C1ZR
```

#### 2. Create Content File
```markdown
---
id: 01J4QW0Z9K6QH8E6Z2GQW7C1ZR
title: "My New Post"
slug: "my-new-post"
description: "A brief description of the post"
date: '2025-08-22'
author: "Your Name"
type: "post"
createdAt: 2025-08-22T10:15:00Z
aliases: []
tags: ['example', 'tutorial']
draft: false
---

# My New Post

This is the content of my new post written in Markdown.

## Features

- Easy to write
- Clean formatting
- SEO-friendly
```

## Content Organization

### Directory Naming Conventions

#### ULID-Based Directories

```
src/content/posts/01J4QW0Z9K6QH8E6Z2GQW7C1ZR/index.md
src/content/pages/01J4QW0Z9K6QH8E6Z2GQW7C1ZR/index.md
src/content/projects/01J4QW0Z9K6QH8E6Z2GQW7C1ZR/index.md
```

#### Slug-Based Directories (Documentation)

```
src/content/documentation/installation.md
src/content/documentation/configuration.md
src/content/documentation/content-management.md
```

### File Naming Best Practices

- **Use ULIDs** for posts, pages, and projects
- **Use descriptive slugs** for documentation
- **Keep filenames lowercase** with hyphens
- **Avoid special characters** in directory names
- **Use consistent structure** across content types

## Media Management

### Media Directory Structure

```
src/content/media/
├── images/
│ ├── posts/ # Post-specific images
│ ├── projects/ # Project screenshots
│ ├── pages/ # Page banners
│ └── general/ # Shared images
├── documents/ # PDFs, documents
├── videos/ # Video files
└── audio/ # Audio files
```

### Image Optimization

#### Supported Formats
- **WebP**: Recommended for photos
- **SVG**: Best for icons and graphics
- **PNG**: For images with transparency
- **JPG**: For photos without transparency

#### Image Shortcode Usage

```njk
{% raw %}
{% image "/content/media/images/example.jpg", "Alt text", "responsive" %}
{% endraw %}
```

### Media Upload via CMS

1. **Access Media Library**
   - Navigate to Media section in Decap CMS
   - Upload files directly to organized folders

2. **Insert in Content**
   - Use the media picker in markdown editor
   - Images are automatically optimized

## Content Templates

### Post Template
```markdown
---
id: {{ULID}}
title: "{{TITLE}}"
slug: "{{SLUG}}"
description: "{{DESCRIPTION}}"
date: '{{DATE}}'
author: "{{AUTHOR}}"
type: "post"
createdAt: {{TIMESTAMP}}
aliases: []
tags: [{{TAGS}}]
draft: true
featured: false
---

# {{TITLE}}

{{DESCRIPTION}}

## Introduction

Start your post with an engaging introduction...

## Main Content

Develop your main points here...

## Conclusion

Wrap up your post with key takeaways...
```

### Project Template
```markdown
---
id: {{ULID}}
title: "{{PROJECT_NAME}}"
slug: "{{PROJECT_SLUG}}"
description: "{{PROJECT_DESCRIPTION}}"
date: '{{DATE}}'
author: "{{AUTHOR}}"
type: "project"
createdAt: {{TIMESTAMP}}
aliases: []
tags: [{{TAGS}}]
draft: false
client: "{{CLIENT_NAME}}"
technologies: [{{TECH_STACK}}]
url: '{{PROJECT_URL}}'
github: '{{GITHUB_URL}}'
featured: false
status: "completed"
---

# {{PROJECT_NAME}}

## Project Overview

Brief description of the project...

## Technologies Used

- Technology 1
- Technology 2
- Technology 3

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Results

Describe the outcomes and impact...
```

## Content Workflow

### Draft Management

#### Creating Drafts
```yaml
---
draft: true  # Content won't appear in public site
---
```

#### Publishing Content
```yaml
---
draft: false  # Content becomes publicly visible
---
```

### Content Review Process

1. **Create Draft**
   - Set `draft: true` in frontmatter
   - Content remains private

2. **Review and Edit**
   - Make necessary changes
   - Test content formatting

3. **Publish**
   - Set `draft: false`
   - Content becomes live

### Version Control Integration

#### Git Workflow
```bash
# Create new content
git checkout -b feature/new-post
# Edit content files
git add src/content/posts/new-post/
git commit -m "Add new blog post: Post Title"
git push origin feature/new-post
# Create pull request for review
```

## SEO and Metadata

### SEO Fields

#### Basic SEO
```yaml
---
title: "Page Title"                    # H1 and title tag
description: "Meta description"        # Meta description
slug: "url-friendly-slug"             # URL structure
---
```

#### Advanced SEO
```yaml
---
seo_title: "Custom SEO Title"         # Override title tag
seo_description: "Custom meta desc"   # Override meta description
canonical_url: "https://example.com"  # Canonical URL
og_image: "/images/og-image.jpg"      # Social media image
twitter_card: "summary_large_image"   # Twitter card type
---
```

### Structured Data

Neutrino automatically generates structured data for:
- **Blog posts**: Article schema
- **Projects**: CreativeWork schema
- **Pages**: WebPage schema
- **Organization**: Organization schema

## Content Migration

### Importing from Other Systems

#### WordPress Export
```bash
# Convert WordPress XML to Markdown
npm install wordpress-export-to-markdown
npx wordpress-export-to-markdown export.xml output/
```

#### Ghost Export
```bash
# Convert Ghost JSON to Markdown
npm install ghost-to-markdown
npx ghost-to-markdown ghost-export.json output/
```

### Bulk Content Operations

#### Batch ULID Generation
```javascript
// Generate ULIDs for existing content
import { ulid } from 'ulid';
import fs from 'fs';
import path from 'path';

const contentDir = 'src/content/posts';
const posts = fs.readdirSync(contentDir);

posts.forEach(postDir => {
  const indexPath = path.join(contentDir, postDir, 'index.md');
  const content = fs.readFileSync(indexPath, 'utf-8');
  
  // Add ULID to frontmatter
  const newContent = content.replace(
    /^---\n/,
    `---\nid: ${ulid()}\n`
  );
  
  fs.writeFileSync(indexPath, newContent);
});
```

## Performance Optimization

### Content Loading

#### Lazy Loading
- Images are automatically lazy-loaded
- Content is paginated for large collections
- Critical CSS is inlined

#### Caching Strategy
- Static content is cached at CDN level
- Build-time optimization for all content
- Efficient asset bundling

### Content Size Optimization

#### Markdown Optimization
- Remove unnecessary whitespace
- Optimize image references
- Use semantic HTML structure

#### Asset Optimization
- Compress images before upload
- Use appropriate image formats
- Minimize external dependencies

## Troubleshooting

### Common Issues

#### Content Not Appearing
1. **Check draft status**: Ensure `draft: false`
2. **Verify file location**: Check directory structure
3. **Validate frontmatter**: Ensure YAML syntax is correct
4. **Rebuild site**: Run `npm run build`

#### CMS Not Loading
1. **Check configuration**: Verify `config.yml` syntax
2. **Backend connection**: Ensure backend is properly configured
3. **Authentication**: Verify authentication setup
4. **Network issues**: Check firewall and proxy settings

#### Build Errors
1. **Frontmatter syntax**: Validate YAML formatting
2. **Missing fields**: Check required frontmatter fields
3. **File permissions**: Ensure proper file access
4. **Dependencies**: Verify all packages are installed

### Debug Mode

Enable detailed logging:
```bash
DEBUG=Eleventy* npm run serve
```

### Content Validation

Use the built-in validation:
```bash
npm run build
```

This will show any content-related errors during the build process.

## Best Practices

### Content Creation

- **Write clear, engaging titles** that describe the content
- **Use descriptive slugs** for better SEO
- **Add relevant tags** for content organization
- **Include meta descriptions** for search engines
- **Use proper heading hierarchy** (H1, H2, H3)

### Content Organization

- **Group related content** in appropriate directories
- **Use consistent naming conventions** across all content
- **Maintain clean directory structure** for easy navigation
- **Archive old content** rather than deleting it

### Performance

- **Optimize images** before uploading
- **Use appropriate content types** for different purposes
- **Minimize external dependencies** in content
- **Test content on different devices** and browsers

### SEO

- **Write unique, descriptive titles** for each piece of content
- **Include relevant keywords** naturally in content
- **Add alt text** to all images
- **Use internal linking** to connect related content

{% include "partials/documentation-nav-footer.njk" %}
- **Keep content fresh** with regular updates

This comprehensive content management guide covers all aspects of working with content in Neutrino, from basic creation to advanced optimization and troubleshooting.