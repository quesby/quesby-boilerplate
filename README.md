# Quesby - Privacy-First Static Site Boilerplate

A modern Eleventy boilerplate with Decap CMS, built with content creators in mind.

## ✨ Features

- **Static Site Generation** with Eleventy 3.0
- **Quesby Core** - Built on `@quesby/core` npm package for Eleventy configuration and core functionality
- **Headless CMS** with Decap CMS
- **Project Scaffolder** (`npx create-quesby`) - Create new projects instantly
- **CLI Tools** for content creation (`npx quesby new post`)
- **Modular Theme System** with 2 included themes
- **Privacy-First** approach
- **SEO Optimized** with automatic sitemaps
- **Responsive Design** out of the box
- **Search Functionality** built-in
- **Documentation System** with TOC generation
- **Migration Tools** for easy content import

## 🚀 Quick Start

The easiest way to create a new Quesby project is using the official scaffolder:

```bash
# Create a new Quesby project
npx create-quesby my-site
cd my-site

# Install dependencies
pnpm install

# Start development server
pnpm serve
```

Visit `http://localhost:8080` to see your site.

### Alternative: Clone from Repository

If you prefer to clone the repository directly:

```bash
# Clone the repository
git clone https://github.com/quesby/quesby-boilerplate.git
cd quesby-boilerplate

# Install dependencies
pnpm install

# Start development server
pnpm serve
```

**Note:** This project uses PNPM as package manager. If you don't have pnpm installed, you can use Corepack (comes with Node.js 16.10+):

```bash
corepack enable
corepack prepare pnpm@9 --activate
```

## 🛠️ CLI Tools

Quesby includes a powerful CLI tool for creating new blog posts:

```bash
# Create a new blog post
npx quesby new post "My Amazing Post Title"

# The tool will:
# - Generate a unique ULID
# - Create proper folder structure (ULID--slug)
# - Generate complete front matter
# - Set current date automatically
```

## 📚 Documentation

Complete documentation is available at [quesby.dev/documentation](https://quesby.dev/documentation/) including:

- [Installation Guide](https://quesby.dev/documentation/installation/)
- [Configuration](https://quesby.dev/documentation/configuration/)
- [Theme System](https://quesby.dev/documentation/themes/)
- [Content Management](https://quesby.dev/documentation/content-management/)
- [Migration Tools](https://quesby.dev/documentation/migration-tools/)
- [Deployment](https://quesby.dev/documentation/deployment/)

## 🎨 Themes

- **quesby-core** (default) - Clean, modern design
- **quesby-brand-website** - Brand-focused layout

## 🛠️ Available Scripts

- `pnpm serve` - Start development server with CSS watching
- `pnpm dev` - Start development server without CSS watching
- `pnpm build` - Build for production
- `pnpm run css:watch` - Watch CSS changes only

### Migration Tools

- `pnpm run tools:import:dry` - Test content import (dry run)
- `pnpm run tools:import:config:dry` - Test import with config file
- `pnpm run tools:import:config` - Import content with config file

## 📁 Project Structure

```bash
src/
├── content/           # Content files (posts, pages, projects)
├── themes/           # Theme system
├── _includes/        # Nunjucks templates
├── assets/           # Static assets (CSS, JS, images)
└── admin/            # Decap CMS configuration

tools/
├── legacy-content-importer/  # Migration tool for legacy content
└── README.md                 # Tools documentation
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Eleventy](https://www.11ty.dev/)
- CMS powered by [Decap CMS](https://decapcms.org/)
- Icons by [Material Symbols](https://fonts.google.com/icons)

---

**Made with ❤️ for the open source community**

## 💖 Support the Project

If you find Quesby useful, please consider supporting its development:

- [GitHub Sponsors](https://github.com/sponsors/greenpandastudio)
- [Buy Me a Coffee](https://buymeacoffee.com/greenpandastudio)
- [Patreon](https://patreon.com/greenpandastudio)

## 🎨 Premium Themes

- **Corporate Pro** - Professional business theme
- **E-commerce** - Online store template
- **Portfolio** - Creative portfolio theme

[View all premium themes →](https://greenpandastudio.com/themes)
