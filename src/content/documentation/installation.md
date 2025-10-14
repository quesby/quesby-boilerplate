---
title: Installation Guide
description: Complete installation and setup guide for Neutrino Boilerplate
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 2
lastUpdated: "2025-09-12"
---

# Installation Guide

This guide will help you install and set up Neutrino, a privacy-first static site boilerplate built with Eleventy and Decap CMS.

## Quick Start

For experienced developers who want to get started immediately:

```bash
# 1. Clone and install
git clone https://github.com/greenpandastudio/neutrino-boilerplate.git your-project
cd your-project
pnpm install

# 2. Start development
pnpm serve

# 3. Open browser
open http://localhost:8080

# 4. Create your first blog post
npx neutrino new post "Welcome to Neutrino"
```

> **New to static sites?** Follow the detailed guide below for step-by-step instructions.

## Prerequisites

Before installing Neutrino, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **pnpm** (recommended) or **npm** (comes with Node.js)
- **Git** (for version control)

### Package Manager Options

Neutrino supports multiple package managers. Choose the one that best fits your workflow:

| Package Manager | Speed | Disk Usage | Lock File | Recommended For |
|----------------|-------|------------|-----------|-----------------|
| **pnpm** | ⚡ Fast | 💾 Efficient | `pnpm-lock.yaml` | New projects, teams |
| **npm** | 🐌 Slower | 📦 Standard | `package-lock.json` | Node.js defaults |
| **yarn** | ⚡ Fast | 📦 Standard | `yarn.lock` | Existing yarn projects |

#### Using Corepack (Recommended)

Corepack is the easiest way to manage package managers automatically:

```bash
# Enable corepack (comes with Node.js 16.10+)
corepack enable

# The project will automatically use pnpm based on package.json configuration
```

#### Manual Installation

If you prefer to install pnpm manually:

```bash
# Install pnpm globally
npm install -g pnpm

# Or using corepack
corepack prepare pnpm@latest --activate
```

### Checking Prerequisites

Verify your installations:

```bash
node --version
pnpm --version  # or npm --version
git --version
```

## Installation Methods

Choose the method that best fits your workflow:

| Method | Best For | Git History | Updates |
|--------|----------|-------------|---------|
| **Clone** | Development, contributions | ✅ Full history | `git pull` |
| **Download** | Quick setup, production | ❌ No history | Manual download |

### Method 1: Clone from Repository (Recommended)

**Best for**: Developers, contributors, and anyone who wants to stay updated

1. **Clone the repository:**
   ```bash
   git clone https://github.com/greenpandastudio/neutrino-boilerplate.git
   cd neutrino-boilerplate
   ```

2. **Install dependencies:**
   ```bash
   pnpm install    # Recommended: fast and efficient
   # npm install   # Alternative: standard Node.js
   # yarn install  # Alternative: yarn projects
   ```

> **Note**: All examples in this guide show pnpm commands. Replace `pnpm` with `npm` or `yarn` if using a different package manager.


3. **Set up your own Git repository (optional)**
   ```bash
   # Remove the original remote
   git remote remove origin

   # Add your own repository
   git remote add origin https://github.com/your-user/your-repo.git

   # Push the initial commit
   git push -u origin main
   ```

### Method 2: Download and Extract

**Best for**: Quick setup, production deployments, or when you don't need git history

1. Download the latest release from the [GitHub repository](https://github.com/greenpandastudio/neutrino-boilerplate/releases)
2. Extract the archive to your desired location
3. Navigate to the project directory
4. Run `pnpm install` (or `npm install` / `yarn install`)

## Environment Configuration

### Setting Up Content Directory

Neutrino supports external content management through multiple configuration methods:

#### Configuration Priority

The system checks configurations in this order (first found wins):

1. **Environment variable** (`.env` file) - Highest priority
2. **site.json** configuration - Fallback
3. **Default** (`src/content`) - If neither is set

#### Method 1: Environment Variable (Recommended)

1. **Create a `.env` file** in the project root:
   ```bash
   touch .env
   ```

2. **Configure the content path**:
   ```bash
   NEUTRINO_CONTENT_PATH=/path/to/your/content/directory
   ```

#### Method 2: site.json Configuration

Edit `src/_data/site.json`:
   ```json
   {
     "contentPath": "/absolute/path/to/your/content"
   }
   ```

> **Tip**: Environment variables are ideal when working across different machines or environments (dev/staging/prod), while site.json defines project-wide defaults.

### Theme Configuration

Neutrino comes with built-in themes and supports custom themes:

#### Built-in Themes

| Theme | Description | Location |
|-------|-------------|----------|
| `neutrino-boilerplate-core` | Modern, minimalist design | `src/themes/neutrino-boilerplate-core/` |
| `neutrino-brand-website` | Brand-focused with enhanced visuals | `src/themes/neutrino-brand-website/` |

#### Setting the Theme

**Configuration in src/_data/site.json**
```json
{
  "theme": "neutrino-boilerplate-core"
}
```

#### Creating Custom Themes

1. **Copy an existing theme**:
   ```bash
   cp -r src/themes/neutrino-boilerplate-core src/themes/my-custom-theme
   ```

2. **Modify theme files** in `src/themes/my-custom-theme/`

3. **Set your theme**:
```json
{
  "theme": "my-custom-theme"
}
```

> **Learn more**: See [Theme Development Guide](/documentation/themes/) for detailed customization instructions.

## Development Setup

### 1. Start Development Server

Run the development server with CSS watching:

```bash
pnpm serve
```

This command will:
- Start Eleventy in serve mode
- Watch for CSS changes and recompile automatically
- Serve your site at `http://localhost:8080`

### 2. Alternative Development Commands

- **Development without CSS watching:**
  ```bash
  pnpm dev
  ```

- **CSS-only watching:**
  ```bash
  pnpm css:watch
  ```

- **Build CSS only:**
  ```bash
  pnpm css:build
  ```

## Building for Production

### Build the Site

Generate the production build:

```bash
pnpm build
```

This will:
- Compile all SCSS to CSS
- Process all templates and content
- Generate the static site in the `_site` directory

### Build Output

The built site will be available in the `_site` directory, ready for deployment to any static hosting service.

## Content Management

### Using Decap CMS

1. **Access the admin panel:**
   Navigate to `http://localhost:8080/admin` in your browser

2. **Configure authentication:**
   Follow the [Decap CMS documentation](https://decapcms.org/docs/authentication-backends/) to set up authentication for your chosen backend

3. **Content structure:**
   
   Neutrino automatically creates collections based on your content structure:

   | Collection | Directory | Required | Description |
   |------------|-----------|----------|-------------|
   | **Posts** | `src/content/posts/` | ✅ Yes | Blog articles and news |
   | **Documentation** | `src/content/documentation/` | ✅ Yes | Help and guides |
   | **Pages** | `src/content/pages/` | ❌ Optional | Static pages (About, Contact) |
   | **Projects** | `src/content/projects/` | ❌ Optional | Portfolio showcases |
   | **News** | `src/content/news/` | ❌ Optional | News articles |

   > **Note**: Only `posts` and `documentation` are required. Other collections are optional and can be added as needed.

### Manual Content Management

You can also manage content manually by editing Markdown files in the appropriate directories.

## Troubleshooting

### Common Issues

#### 1. Content Directory Not Found
**Error**: `❌ Content path not found`

**Solutions**:
```bash
# Check your configuration
cat .env | grep NEUTRINO_CONTENT_PATH
cat src/_data/site.json | grep contentPath

# Verify directory exists
ls -la /path/to/your/content/directory
```

#### 2. CSS Not Compiling
**Error**: Styles not updating or SCSS errors

**Solutions**:
```bash
# Check SCSS syntax
pnpm css:build

# Verify theme exists
ls -la src/themes/

# Restart CSS watcher
pnpm css:watch
```

#### 3. Port Already in Use
**Error**: Port 8080 is already in use

**Solutions**:
- Eleventy automatically finds an available port
- Check terminal output for the actual URL
- Or specify a different port: `pnpm dev --port 3000`

#### 4. Package Manager Issues
**Error**: Command not found (pnpm/npm/yarn)

**Solutions**:
```bash
# Enable corepack
corepack enable

# Or install manually
npm install -g pnpm
```

### Getting Help

- **Documentation**: [Troubleshooting Guide](./troubleshooting.md) | [Configuration Guide](./configuration.md)
- **GitHub Issues**: [Report bugs or request features](https://github.com/greenpandastudio/neutrino-boilerplate/issues)
- **Discussions**: [Community support](https://github.com/greenpandastudio/neutrino-boilerplate/discussions)
- **Quick Fixes**: Check the [Common Issues](./troubleshooting.md#common-issues) section below

## Next Steps

After successful installation, here's what to do next:

### Immediate Actions
1. **Verify installation**: Check that `http://localhost:8080` loads correctly
2. **Create your first post**: Use the CLI tool to create a new blog post
   ```bash
   npx neutrino new post "My First Post"
   ```
3. **Explore the admin**: Visit `http://localhost:8080/admin` to see the CMS
4. **Check content**: Browse the sample posts and documentation

### Learning Path
1. **[Configuration Guide](./configuration.md)** - Customize your site settings
2. **[Theme System](./themes.md)** - Customize appearance and create themes
3. **[Content Management](./content-management.md)** - Learn to manage content
4. **[Development Guide](./development.md)** - Advanced customization
5. **[Deployment Guide](./deployment.md)** - Publish your site

### Quick Wins
- **Change site name**: Edit `src/_data/site.json`
- **Add your content**: Create posts in `src/content/posts/`
- **Customize theme**: Modify files in `src/themes/neutrino-boilerplate-core/`
- **Set up CMS**: Configure authentication in `src/admin/config.yml`

## System Requirements

### Minimum Requirements
- **Node.js:** 18.0.0 or higher (includes corepack)
- **Package Manager:** pnpm (recommended), npm, or yarn
- **Memory:** 512MB RAM minimum
- **Disk Space:** 100MB for the project, additional space for content

### Recommended Setup
- **Node.js:** 20.0.0 or higher (latest LTS)
- **Package Manager:** pnpm with corepack
- **Memory:** 1GB RAM or more
- **Disk Space:** 500MB+ for development with dependencies

### Corepack Requirements

- **Node.js:** 16.10.0 or higher (corepack included)
- **Corepack:** Automatically manages package managers
- **No additional installation required** for pnpm, npm, or yarn

## Key Dependencies

Neutrino uses modern, well-maintained dependencies:

| Dependency | Version | Purpose |
|------------|---------|---------|
| **Eleventy** | 3.0+ | Static site generator |
| **Decap CMS** | Latest | Headless content management |
| **Sass** | 1.77+ | CSS preprocessor |
| **Expressive Code** | 0.41+ | Syntax highlighting |
| **Markdown-it** | 14.0+ | Markdown processor |
| **Corepack** | Built-in | Package manager management |

## Supported Platforms

| Platform | Node.js | Corepack | Package Managers |
|----------|---------|----------|------------------|
| **Windows 10/11** | ✅ 18.0+ | ✅ 16.10+ | pnpm, npm, yarn |
| **macOS 10.15+** | ✅ 18.0+ | ✅ 16.10+ | pnpm, npm, yarn |
| **Linux (any distro)** | ✅ 18.0+ | ✅ 16.10+ | pnpm, npm, yarn |

### Corepack Support

Corepack is supported on all platforms where Node.js 16.10+ is available:

- **Windows:** Full support with PowerShell and Command Prompt
- **macOS:** Full support with Terminal and iTerm2
- **Linux:** Full support with bash, zsh, and other shells
