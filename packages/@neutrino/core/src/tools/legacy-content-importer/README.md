# tools/legacy-content-importer/README.md
# Neutrino Legacy Content Importer

A standalone tool to import legacy markdown content into the Neutrino ULID system. This tool can be used independently to migrate content from any markdown-based blog/CMS to Neutrino's ULID-based content structure.

## Installation

```bash
# Install globally
npm install -g neutrino-legacy-content-importer

# Or use with npx (recommended)
npx neutrino-legacy-content-importer --help
```

## Usage

### Basic Usage

```bash
# Import from old blog to Neutrino posts
npx neutrino-legacy-content-importer \
  --source ./old-blog \
  --target ./src/content/posts

# Dry run (test without making changes)
npx neutrino-legacy-content-importer \
  --source ./old-blog \
  --target ./src/content/posts \
  --dry-run
```

### Advanced Usage

```bash
# Custom author and image path
npx neutrino-legacy-content-importer \
  --source ./old-blog \
  --target ./src/content/posts \
  --author "Your Name" \
  --image-path "/assets/images/" \
  --verbose
```

## Options

- `--source, -s`: Source directory containing legacy markdown files
- `--target, -t`: Target directory for Neutrino content (e.g., src/content/posts)
- `--author, -a`: Default author name for imported content (default: "Author")
- `--image-path, -i`: Base path for images (default: "/img/")
- `--backup, -b`: Create backup before import (default: true)
- `--dry-run, -d`: Show what would be imported without making changes
- `--verbose, -v`: Verbose output
- `--help`: Show help
- `--version`: Show version

## Supported Frontmatter Fields

The importer automatically maps common frontmatter fields:

### Input Fields (Legacy)
- `page-title`, `seoTitle`, `title` → `title`
- `descrizione`, `description`, `excerpt`, `summary` → `description`
- `date` → `date`
- `tags` → `tags`
- `category` → added to `tags`
- `image` → `image` (with custom path)
- `author` → `author` (or use --author flag)
- `draft` → `draft`
- `featured` → `featured`
- `type` → `type`

### Output Fields (Neutrino)
- `id`: Generated ULID
- `title`: Mapped from legacy title fields
- `slug`: Generated from title
- `description`: Mapped from legacy description fields
- `date`: Mapped from legacy date
- `author`: Mapped from legacy author or --author flag
- `tags`: Mapped from legacy tags + category
- `draft`: Mapped from legacy draft field
- `aliases`: Generated for old URL structure
- `image`: Mapped with custom path
- `featured`: Mapped from legacy featured field
- `type`: Mapped from legacy type field

## Directory Structure

The importer creates the Neutrino ULID directory structure:
src/content/posts/
├── 01J4QW0Z9K6QH8E6Z2GQW7C1ZR--my-first-post/
│ └── index.md
├── 01J4QW0Z9K6QH8E6Z2GQW7C1ZR--another-post/
│ └── index.md
└── ...


## Examples

### Migrate from Jekyll
```bash
npx neutrino-legacy-content-importer \
  --source ./_posts \
  --target ./src/content/posts \
  --author "Your Name"
```

### Migrate from Hugo
```bash
npx neutrino-legacy-content-importer \
  --source ./content/posts \
  --target ./src/content/posts \
  --image-path "/images/"
```

### Migrate from Ghost
```bash
npx neutrino-legacy-content-importer \
  --source ./ghost-export/posts \
  --target ./src/content/posts \
  --author "Your Name"
```

## License

MIT