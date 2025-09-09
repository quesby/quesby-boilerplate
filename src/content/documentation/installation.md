---
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
class: documentation
---

# Installation Guide

This guide will help you install and set up Neutrino, a privacy-first static site boilerplate built with Eleventy and Decap CMS.

## Prerequisites

Before installing Neutrino, ensure you have the following installed on your system:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for version control)

### Checking Prerequisites

Verify your installations:

```bash
node --version
npm --version
git --version
```

## Installation Methods

### Method 1: Clone from Repository

1. **Clone the repository:**
   ```bash
   git clone https://github.com/greenpandastudio/neutrino-electron.git
   cd neutrino-electron
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Method 2: Download and Extract

1. Download the latest release from the GitHub repository
2. Extract the archive to your desired location
3. Navigate to the project directory
4. Run `npm install`

## Environment Configuration

### Setting Up Content Directory

Neutrino supports external content management through environment variables:

1. **Create a `.env` file** in the project root:
   ```bash
   touch .env
   ```

2. **Configure the content path** in your `.env` file:
   ```env
   NEUTRINO_CONTENT_PATH=/path/to/your/content/directory
   ```

   If you don't set this variable, Neutrino will use the default `content` directory.

3. **Alternative: Edit site.json**
   
   You can also configure the content path directly in `src/_data/site.json`:
   ```json
   {
     "contentPath": "/absolute/path/to/your/content"
   }
   ```

### Theme Configuration

Set your preferred theme using the `THEME` environment variable:

```env
THEME=neutrino-electron-core
```

Available themes:
- `neutrino-electron-core` (default)
- `neutrino-brand-website`

## Development Setup

### 1. Start Development Server

Run the development server with CSS watching:

```bash
npm run serve
```

This command will:
- Start Eleventy in serve mode
- Watch for CSS changes and recompile automatically
- Serve your site at `http://localhost:8080`

### 2. Alternative Development Commands

- **Development without CSS watching:**
  ```bash
  npm run dev
  ```

- **CSS-only watching:**
  ```bash
  npm run watch:css
  ```

- **Build CSS only:**
  ```bash
  npm run build:css
  ```

## Building for Production

### Build the Site

Generate the production build:

```bash
npm run build
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
   - Posts: `src/content/posts/`
   - Pages: `src/content/pages/`
   - Projects: `src/content/projects/`
   - Documentation: `src/content/documentation/`

### Manual Content Management

You can also manage content manually by editing Markdown files in the appropriate directories.

## Troubleshooting

### Common Issues

1. **Content directory not found:**
   - Verify the path in your `.env` file or `site.json`
   - Ensure the directory exists and is accessible

2. **CSS not compiling:**
   - Check that all SCSS files are valid
   - Ensure the theme directory exists

3. **Port already in use:**
   - Eleventy will automatically find an available port
   - Check the terminal output for the actual URL

### Getting Help

- Check the [troubleshooting guide](./troubleshooting.md)
- Review the [configuration documentation](./configuration.md)
- Open an issue on the GitHub repository

## Next Steps

After successful installation:

1. Read the [configuration guide](./configuration.md)
2. Explore the [theme system](./themes.md)
3. Set up [content management](./content-management.md)
4. Learn about [deployment options](./deployment.md)

## System Requirements

- **Node.js:** 18.0.0 or higher
- **npm:** 8.0.0 or higher
- **Memory:** 512MB RAM minimum
- **Disk Space:** 100MB for the project, additional space for content

## Supported Platforms

- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+, CentOS 7+)