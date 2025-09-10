---
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
class: documentation
---

# Troubleshooting Guide

This comprehensive troubleshooting guide covers common issues, error messages, and solutions for Neutrino projects.

## Quick Diagnostic Checklist

Before diving into specific issues, run through this quick checklist:

```bash
# 1. Check Node.js version
node --version  # Should be 18 or higher

# 2. Verify dependencies
npm list --depth=0

# 3. Check environment variables
echo $NEUTRINO_CONTENT_PATH

# 4. Validate configuration
cat src/_data/site.json

# 5. Test build process
npm run build
```

## Installation Issues

### Node.js Version Problems

#### **Error: "Node.js version not supported"**

**Symptoms:**
- Build fails with version error
- Dependencies won't install
- Runtime errors

**Solutions:**
```bash
# Check current version
node --version

# Update Node.js (using nvm)
nvm install 18
nvm use 18

# Or download from nodejs.org
# https://nodejs.org/en/download/
```

**Minimum Requirements:**
- Node.js: 18.0.0 or higher
- npm: 8.0.0 or higher

### Dependency Installation Issues

#### **Error: "npm install fails"**

**Symptoms:**
- Package installation errors
- Permission denied errors
- Network timeout errors

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall with verbose output
npm install --verbose

# Alternative: Use yarn
npm install -g yarn
yarn install
```

#### **Error: "Permission denied"**

**Solutions:**
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm

# Or use nvm to avoid permission issues
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

## Build Issues

### Eleventy Build Failures

#### **Error: "Content path not found"**

**Symptoms:**
```
❌ Content path not found:
/path/to/content

Check your contentPath in site.json or the .env variable NEUTRINO_CONTENT_PATH
```

**Solutions:**
```bash
# 1. Check environment variable
echo $NEUTRINO_CONTENT_PATH

# 2. Verify .env file
cat .env

# 3. Check site.json
cat src/_data/site.json | grep contentPath

# 4. Create content directory if missing
mkdir -p content
mkdir -p src/content

# 5. Set correct path
export NEUTRINO_CONTENT_PATH=./content
```

#### **Error: "Template not found"**

**Symptoms:**
- Template rendering errors
- Missing layout files
- 404 errors for pages

**Solutions:**
```bash
# 1. Check template structure
ls -la src/_includes/layouts/
ls -la src/_includes/partials/

# 2. Verify template references
grep -r "layout:" src/content/

# 3. Check for typos in template names
# Should be: layout: layouts/base.njk
# Not: layout: layout/base.njk
```

#### **Error: "Collection not found"**

**Symptoms:**
- Collections are empty
- Content not appearing in templates
- Build warnings about collections

**Solutions:**
```bash
# 1. Check content structure
ls -la src/content/posts/
ls -la src/content/pages/
ls -la src/content/projects/

# 2. Verify file naming
# Posts should be: src/content/posts/[ulid]/index.md
# Pages should be: src/content/pages/[ulid]/index.md

# 3. Check frontmatter
head -20 src/content/posts/*/index.md
```

### SCSS Compilation Issues

#### **Error: "SCSS compilation failed"**

**Symptoms:**
- CSS not updating
- SCSS syntax errors
- Missing CSS files

**Solutions:**
```bash
# 1. Check SCSS syntax
sass --check src/sass/core.scss

# 2. Validate theme files
sass --check src/themes/neutrino-electron-core/skin.scss

# 3. Check for missing imports
grep -r "@import" src/sass/
grep -r "@import" src/themes/

# 4. Rebuild CSS
npm run build:css

# 5. Check for circular imports
# Look for files importing each other
```

#### **Error: "Theme not found"**

**Symptoms:**
- Theme styles not loading
- Default styles appearing
- Build warnings about theme

**Solutions:**
```bash
# 1. Check theme configuration
cat src/_data/site.json | grep theme

# 2. Verify theme directory exists
ls -la src/themes/

# 3. Check theme structure
ls -la src/themes/neutrino-electron-core/

# 4. Ensure skin.scss exists
ls -la src/themes/neutrino-electron-core/skin.scss

# 5. Set theme via environment variable
export THEME=neutrino-electron-core
```

### Markdown Processing Issues

#### **Error: "Markdown processing failed"**

**Symptoms:**
- Content not rendering
- Markdown syntax errors
- Expressive Code not working

**Solutions:**
```bash
# 1. Check markdown syntax
# Look for unclosed code blocks, lists, etc.

# 2. Validate frontmatter YAML
# Check for proper indentation and quotes

# 3. Test with simple markdown
echo "# Test" > test.md
# Process and check output

# 4. Check for special characters
# Some characters might need escaping
```

#### **Error: "Expressive Code CSS not found"**

**Symptoms:**
- Code blocks not styled
- Syntax highlighting missing
- CSS file not found

**Solutions:**
```bash
# 1. Generate Expressive Code CSS
npm run gen:ec-css

# 2. Check if file was created
ls -la src/assets/css/expressive-code.css

# 3. Verify CSS is included in templates
grep -r "expressive-code.css" src/_includes/

# 4. Check build process
npm run build:css
```

## Development Server Issues

### Port Conflicts

#### **Error: "Port 8080 already in use"**

**Symptoms:**
- Server won't start
- Port conflict messages
- Connection refused errors

**Solutions:**
```bash
# 1. Find process using port
lsof -i :8080  # macOS/Linux
netstat -ano | findstr :8080  # Windows

# 2. Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# 3. Use different port
npm run serve -- --port=8081

# 4. Let Eleventy find available port
npm run serve  # Will auto-find available port
```

### Hot Reload Issues

#### **Error: "Changes not reflecting"**

**Symptoms:**
- File changes not updating
- Browser not refreshing
- Stale content displayed

**Solutions:**
```bash
# 1. Restart development server
# Stop with Ctrl+C, then restart
npm run serve

# 2. Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (macOS)

# 3. Check file watching
# Ensure files are being watched by Eleventy

# 4. Verify file permissions
# Files should be readable by the process
```

### CSS Watching Issues

#### **Error: "CSS not updating"**

**Symptoms:**
- SCSS changes not compiling
- Styles not updating
- CSS watcher not working

**Solutions:**
```bash
# 1. Restart CSS watcher
npm run watch:css

# 2. Check SCSS syntax
sass --check src/sass/core.scss

# 3. Verify theme configuration
cat src/_data/site.json | grep theme

# 4. Check for file system issues
# Some file systems don't support watching properly

# 5. Use alternative approach
npm run build:css  # Manual compilation
```

## Content Management Issues

### Decap CMS Problems

#### **Error: "CMS not loading"**

**Symptoms:**
- Admin panel not accessible
- Authentication errors
- Backend connection issues

**Solutions:**
```bash
# 1. Check config.yml syntax
# Validate YAML syntax in src/admin/config.yml

# 2. Verify backend configuration
# Check git-gateway, test-repo, or proxy settings

# 3. Check authentication setup
# Ensure OAuth providers are configured

# 4. Verify network connectivity
# Check firewall and proxy settings

# 5. Test with local backend
# Set local_backend: true in config.yml
```

#### **Error: "Content not saving"**

**Symptoms:**
- Changes not persisting
- Save button not working
- Git commit failures

**Solutions:**
```bash
# 1. Check Git configuration
git config --list

# 2. Verify repository permissions
# Ensure write access to repository

# 3. Check branch configuration
# Verify correct branch in config.yml

# 4. Test Git operations manually
git status
git add .
git commit -m "Test commit"
```

### Content Structure Issues

#### **Error: "Content not appearing"**

**Symptoms:**
- New content not showing
- 404 errors for content
- Draft content appearing

**Solutions:**
```bash
# 1. Check draft status
grep -r "draft: true" src/content/

# 2. Verify file structure
# Content should be in: src/content/[type]/[ulid]/index.md

# 3. Check frontmatter
# Ensure required fields are present

# 4. Validate YAML syntax
# Check for proper indentation and quotes

# 5. Rebuild site
npm run build
```

#### **Error: "ULID generation failed"**

**Symptoms:**
- Content creation fails
- Invalid directory names
- Duplicate content IDs

**Solutions:**
```bash
# 1. Generate ULID manually
node -e "console.log(require('ulid').ulid())"

# 2. Check ULID format
# Should be 26 characters: 01J4QW0Z9K6QH8E6Z2GQW7C1ZR

# 3. Verify directory structure
# Create: src/content/posts/[ulid]/index.md

# 4. Check for duplicates
# Ensure unique ULIDs for each content item
```

## Template Issues

### Nunjucks Template Errors

#### **Error: "Template syntax error"**

**Symptoms:**
- Template rendering fails
- Syntax error messages
- Missing template variables

**Solutions:**
```bash
# 1. Check Nunjucks syntax
# Look for unclosed blocks, incorrect filters, etc.

# 2. Validate template includes
# Ensure include paths are correct

# 3. Check variable references
# Verify all variables are defined

# 4. Test with simple template
# Create minimal template to isolate issues
```

#### **Error: "Include not found"**

**Symptoms:**
- Template includes failing
- Missing partial errors
- 404 errors for includes

**Solutions:**
{% raw %}
```bash
# 1. Check include paths
# Should be relative to src/_includes/

# 2. Verify file existence
ls -la src/_includes/partials/
ls -la src/_includes/layouts/

# 3. Check file extensions
# Should be .njk for Nunjucks templates

# 4. Validate include syntax
# {% include "partials/header.njk" %}
```

### Layout Issues

#### **Error: "Layout not found"**

**Symptoms:**
- Pages not rendering
- Layout errors
- Missing base template

**Solutions:**
```bash
# 1. Check layout configuration
grep -r "layout:" src/content/

# 2. Verify layout files exist
ls -la src/_includes/layouts/

# 3. Check layout inheritance
# Ensure extends syntax is correct

# 4. Validate block structure
# Check for proper {% block %} usage
```
{% endraw %}

## Performance Issues

### Slow Build Times

#### **Problem: "Build taking too long"**

**Symptoms:**
- Build process is slow
- Development server lag
- High CPU usage

**Solutions:**
```bash
# 1. Check content size
du -sh src/content/

# 2. Optimize images
# Compress images before adding to content

# 3. Reduce SCSS complexity
# Simplify SCSS imports and nesting

# 4. Use incremental builds
# Only rebuild changed files

# 5. Check for infinite loops
# Look for circular dependencies
```

### Memory Issues

#### **Error: "Out of memory"**

**Symptoms:**
- Build process crashes
- High memory usage
- System slowdown

**Solutions:**
```bash
# 1. Increase Node.js memory limit
node --max-old-space-size=4096 npm run build

# 2. Check for memory leaks
# Look for large objects in code

# 3. Optimize content processing
# Reduce content size or complexity

# 4. Use streaming for large files
# Process files in chunks
```

## Deployment Issues

### Build Failures in Production

#### **Error: "Production build fails"**

**Symptoms:**
- Build succeeds locally but fails in production
- Different behavior in production
- Missing dependencies

**Solutions:**
```bash
# 1. Check Node.js version
node --version

# 2. Verify environment variables
echo $NODE_ENV
echo $NEUTRINO_CONTENT_PATH

# 3. Check production dependencies
npm ci --production

# 4. Validate build process
npm run build

# 5. Check for platform-specific issues
# Some packages behave differently on different platforms
```

### Content Not Updating

#### **Error: "Content not syncing"**

**Symptoms:**
- Changes not appearing in production
- Stale content displayed
- Cache issues

**Solutions:**
```bash
# 1. Check content path configuration
echo $NEUTRINO_CONTENT_PATH

# 2. Verify content files exist
ls -la src/content/

# 3. Check for draft content
grep -r "draft: true" src/content/

# 4. Clear build cache
rm -rf _site/
npm run build

# 5. Check CDN cache
# Clear CDN cache if using one
```

## Debugging Tools

### Eleventy Debug Mode

#### **Enable Debug Logging**

```bash
# Enable detailed Eleventy logging
DEBUG=Eleventy* npm run serve

# Enable specific debug categories
DEBUG=Eleventy:Template npm run serve
DEBUG=Eleventy:Collection npm run serve
DEBUG=Eleventy:Transform npm run serve
```

#### **Verbose Build Output**

```bash
# Verbose build with detailed output
npm run build -- --verbose

# Dry run to check what would be built
npm run build -- --dryrun
```

### Browser Developer Tools

#### **Console Debugging**

```javascript
// Check for JavaScript errors
console.log('Debug info:', data);

// Check for CSS issues
// Look for 404 errors in Network tab

// Check for template rendering
// Inspect HTML output for missing content
```

#### **Network Tab Analysis**

```bash
# Check for missing assets
# Look for 404 errors in Network tab

# Verify CSS and JS loading
# Check if all assets are loading correctly

# Check for CORS issues
# Look for cross-origin errors
```

### Content Validation

#### **Frontmatter Validation**

```bash
# Check for YAML syntax errors
grep -r "---" src/content/ | head -20

# Validate required fields
grep -r "title:" src/content/
grep -r "date:" src/content/

# Check for missing fields
find src/content -name "*.md" -exec grep -L "title:" {} \;
```

#### **Content Structure Validation**

```bash
# Check directory structure
find src/content -type d -name "*" | sort

# Verify file naming
find src/content -name "*.md" | head -10

# Check for duplicate content
find src/content -name "index.md" | wc -l
```

## Common Error Messages

### Build Error Messages

#### **"Content path not found"**
```
❌ Content path not found:
/path/to/content

Check your contentPath in site.json or the .env variable NEUTRINO_CONTENT_PATH
```

**Solution:** Set correct `NEUTRINO_CONTENT_PATH` environment variable.

#### **"Template not found"**
```
Template render error: Template not found
```

**Solution:** Check template file exists and path is correct.

#### **"Collection not found"**
```
Collection not found: posts
```

**Solution:** Verify content structure and file naming.

### Runtime Error Messages

#### **"Cannot read property of undefined"**
```
TypeError: Cannot read property 'title' of undefined
```

**Solution:** Check if variable exists before accessing properties.

#### **"Module not found"**
```
Error: Cannot find module 'module-name'
```

**Solution:** Install missing dependency with `npm install`.

## Prevention Strategies

### Best Practices

#### **Content Management**
- Always validate frontmatter before committing
- Use consistent naming conventions
- Keep content organized in proper directories
- Test content changes locally before deploying

#### **Development Workflow**
- Use version control for all changes
- Test builds regularly during development
- Keep dependencies updated
- Document custom configurations

#### **Performance Optimization**
- Optimize images before adding to content
- Minimize SCSS complexity
- Use efficient template structures
- Monitor build times and memory usage

### Monitoring

#### **Build Monitoring**
```bash
# Monitor build times
time npm run build

# Check memory usage
npm run build -- --verbose

# Monitor file changes
npm run serve -- --watch
```

#### **Content Monitoring**
```bash
# Check for broken links
# Use tools like linkchecker

# Validate HTML output
# Use HTML validators

# Check for accessibility issues
# Use accessibility testing tools
```

## Getting Help

### Community Resources

#### **Documentation**
- [Eleventy Documentation](https://www.11ty.dev/docs/)
- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Nunjucks Documentation](https://mozilla.github.io/nunjucks/)

#### **Support Channels**
- GitHub Issues for bug reports
- Community forums for questions
- Stack Overflow for technical issues

### Reporting Issues

#### **Bug Reports**
When reporting issues, include:
- Node.js version
- Operating system
- Error messages
- Steps to reproduce
- Expected vs actual behavior

#### **Feature Requests**
For feature requests, include:
- Use case description
- Proposed solution
- Benefits of the feature
- Implementation considerations

This comprehensive troubleshooting guide should help you resolve most issues encountered while working with Neutrino. If you continue to experience problems, please refer to the community resources or create a detailed issue report.