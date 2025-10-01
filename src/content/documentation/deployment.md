---
title: Deployment Guide
description: Complete deployment guide for Neutrino Electron static sites
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 7
lastUpdated: "2025-09-12"
---

# Deployment Guide

This comprehensive guide covers all aspects of deploying Neutrino static sites, from preparation and build optimization to various hosting platforms and deployment strategies.

## Pre-Deployment Preparation

### Build Verification

Before deploying, ensure your site builds correctly:

```bash
# Test production build
npm run build

# Verify build output
ls -la _site/

# Check for build errors
npm run build 2>&1 | grep -i error
```

### Content Validation

#### **Check for Draft Content**

```bash
# Find any draft content that shouldn't be published
grep -r "draft: true" src/content/

# Remove or set to false before deployment
find src/content -name "*.md" -exec sed -i 's/draft: true/draft: false/g' {} \;
```

#### **Validate Frontmatter**

```bash
# Check for missing required fields
find src/content -name "*.md" -exec grep -L "title:" {} \;
find src/content -name "*.md" -exec grep -L "date:" {} \;
```

### Environment Configuration

#### **Production Environment Variables**

Create a production `.env` file:

```bash
# .env.production
NEUTRINO_CONTENT_PATH=/path/to/production/content
NODE_ENV=production
```

#### **Site Configuration Update**

Update `src/_data/site.json` for production:

```json
{
  "name": "Your Production Site",
  "url": "https://yourdomain.com",
  "description": "Your production site description",
  "logo": "/assets/images/your-logo.svg",
  "favicon": "/assets/images/your-favicon.png",
  "theme": "neutrino-electron-core",
  "defaultVisualTheme": "dark",
  "contentPath": "${NEUTRINO_CONTENT_PATH}"
}
```

## Build Optimization

### Production Build Script

Create an optimized build script:

```json
{
  "scripts": {
    "build:prod": "NODE_ENV=production npm run build",
    "build:css:prod": "NODE_ENV=production npm run build:css",
    "prebuild": "npm run build:css:prod",
    "postbuild": "npm run optimize:assets"
  }
}
```

### Asset Optimization

#### **CSS Optimization**

```javascript
// In scripts/build.js - Production optimization
const command = `sass --no-source-map --style=compressed src/sass:src/assets/css src/themes/${theme}:src/assets/css`;
```

#### **Image Optimization**

```javascript
// In eleventy.config.js
eleventyConfig.addNunjucksAsyncShortcode("image", async function(src, alt, sizes) {
  let stats = await Image(src, {
    widths: [300, 600, 900, 1200],
    formats: ["webp", "jpeg"],
    outputDir: "./_site/assets/images/",
    urlPath: "/assets/images/",
    sharpWebpOptions: {
      quality: 80
    },
    sharpJpegOptions: {
      quality: 80
    }
  });
  
  return `<picture>
    <source srcset="${stats.webp.map(stat => stat.srcset).join(', ')}" type="image/webp">
    <img src="${stats.jpeg[0].url}" alt="${alt}" sizes="${sizes}" loading="lazy">
  </picture>`;
});
```

### Performance Optimization

#### **Critical CSS Extraction**

```scss
// Extract critical CSS for above-the-fold content
@import 'critical/base';
@import 'critical/header';
@import 'critical/navigation';
```

#### **Lazy Loading Implementation**

```html
<!-- In templates -->
<img src="/assets/images/placeholder.jpg" 
     data-src="/assets/images/actual-image.jpg" 
     alt="Description" 
     loading="lazy"
     class="lazy-load">
```

## Static Hosting Platforms

### Netlify Deployment

#### **Automatic Deployment**

1. **Connect Repository:**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository

2. **Build Settings:**
   ```
   Build command: pnpm build
   Publish directory: _site
   Node version: 18
   ```

3. **Environment Variables:**
   ```
   NEUTRINO_CONTENT_PATH=./content
   NODE_ENV=production
   ```

#### **Netlify Configuration File**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "_site"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

#### **Form Handling (Decap CMS)**

```toml
[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200

# Handle form submissions
[[redirects]]
  from = "/.netlify/functions/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

### Vercel Deployment

#### **Automatic Deployment**

1. **Connect Repository:**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Configure build settings

2. **Build Configuration:**

Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "_site",
  "framework": null,
  "installCommand": "npm install",
  "devCommand": "npm run serve",
  "env": {
    "NEUTRINO_CONTENT_PATH": "./content",
    "THEME": "neutrino-electron-core",
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/admin/(.*)",
      "destination": "/admin/index.html"
    }
  ]
}
```

#### **Vercel Functions (Optional)**

For dynamic functionality, create `api/` directory:

```javascript
// api/contact.js
export default function handler(req, res) {
  if (req.method === 'POST') {
    // Handle form submission
    res.status(200).json({ message: 'Form submitted successfully' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
```

### GitHub Pages Deployment

#### **GitHub Actions Workflow**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build site
      run: npm run build
      env:
        NEUTRINO_CONTENT_PATH: ./content
        THEME: neutrino-electron-core
        NODE_ENV: production
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./_site
```

#### **Repository Settings**

1. Go to repository Settings → Pages
2. Source: GitHub Actions
3. Enable the workflow

### Cloudflare Pages

#### **Automatic Deployment**

1. **Connect Repository:**
   - Go to [Cloudflare Pages](https://pages.cloudflare.com)
   - Connect your Git repository

2. **Build Settings:**
   ```
   Framework preset: None
   Build command: pnpm build
   Build output directory: _site
   Root directory: (leave empty)
   ```

3. **Environment Variables:**
   ```
   NEUTRINO_CONTENT_PATH=./content
   NODE_ENV=production
   ```

#### **Cloudflare Configuration**

Create `_headers` file in `_site` directory:

```
/assets/*
  Cache-Control: public, max-age=31536000

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/admin/*
  Cache-Control: public, max-age=0, must-revalidate
```

Create `_redirects` file:

```
/admin/*    /admin/index.html   200
```

## Traditional Web Hosting

### Shared Hosting (cPanel, etc.)

#### **Manual Upload**

1. **Build the site:**
   ```bash
   pnpm build
   ```

2. **Upload files:**
   - Use FTP/SFTP client
   - Upload contents of `_site/` to `public_html/`
   - Maintain directory structure

3. **Configure .htaccess:**
   ```apache
   # .htaccess for Apache servers
   RewriteEngine On
   
   # Handle admin routes
   RewriteRule ^admin/(.*)$ /admin/index.html [L]
   
   # Cache static assets
   <FilesMatch "\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
     ExpiresActive On
     ExpiresDefault "access plus 1 year"
   </FilesMatch>
   
   # Compress files
   <IfModule mod_deflate.c>
     AddOutputFilterByType DEFLATE text/plain
     AddOutputFilterByType DEFLATE text/html
     AddOutputFilterByType DEFLATE text/xml
     AddOutputFilterByType DEFLATE text/css
     AddOutputFilterByType DEFLATE application/xml
     AddOutputFilterByType DEFLATE application/xhtml+xml
     AddOutputFilterByType DEFLATE application/rss+xml
     AddOutputFilterByType DEFLATE application/javascript
     AddOutputFilterByType DEFLATE application/x-javascript
   </IfModule>
   ```

### VPS/Dedicated Server

#### **Nginx Configuration**

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/yourdomain.com/_site;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Handle admin routes
    location /admin {
        try_files $uri $uri/ /admin/index.html;
    }

    # Handle all other routes
    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

#### **SSL Configuration (Let's Encrypt)**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## CI/CD Pipeline

### GitHub Actions (Advanced)

#### **Multi-Environment Deployment**

```yaml
name: Deploy

on:
  push:
    branches: [ main, staging ]
  pull_request:
    branches: [ main ]

env:
  NODE_VERSION: '18'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build site
      run: npm run build
      env:
        NEUTRINO_CONTENT_PATH: ./content
        THEME: neutrino-electron-core
        NODE_ENV: production
        
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: site-build
        path: _site/

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/staging'
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: site-build
        
    - name: Deploy to staging
      run: |
        # Deploy to staging server
        rsync -avz --delete _site/ user@staging-server:/var/www/staging/
        
  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - name: Download build artifacts
      uses: actions/download-artifact@v3
      with:
        name: site-build
        
    - name: Deploy to production
      run: |
        # Deploy to production server
        rsync -avz --delete _site/ user@production-server:/var/www/production/
```

### GitLab CI/CD

#### **GitLab Pipeline**

Create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - deploy

variables:
  NODE_VERSION: "18"

build:
  stage: build
  image: node:${NODE_VERSION}
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - _site/
    expire_in: 1 hour

deploy_staging:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache rsync openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $STAGING_SERVER >> ~/.ssh/known_hosts
  script:
    - rsync -avz --delete _site/ $STAGING_USER@$STAGING_SERVER:/var/www/staging/
  only:
    - staging

deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache rsync openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - ssh-keyscan $PRODUCTION_SERVER >> ~/.ssh/known_hosts
  script:
    - rsync -avz --delete _site/ $PRODUCTION_USER@$PRODUCTION_SERVER:/var/www/production/
  only:
    - main
  when: manual
```

## Content Management System Integration

### Decap CMS Deployment

#### **Git Gateway Setup**

1. **Enable Git Gateway:**
   - Go to your Netlify site settings
   - Enable "Git Gateway" in Identity settings
   - Configure OAuth providers

2. **Update CMS Configuration:**

```yaml
# src/admin/config.yml
backend:
  name: git-gateway
  branch: main

# For production
publish_mode: editorial_workflow

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
      - {label: "Draft", name: "draft", widget: "boolean", default: true}
      - {label: "Body", name: "body", widget: "markdown"}
```

#### **Authentication Setup**

```yaml
# Identity settings in Netlify
identity:
  enabled: true
  external:
    - provider: github
      enabled: true
      client_id: ${GITHUB_CLIENT_ID}
      client_secret: ${GITHUB_CLIENT_SECRET}
```

### Headless CMS Integration

#### **Strapi Integration**

```javascript
// Fetch content from Strapi
async function getStrapiContent() {
  const response = await fetch('https://your-strapi-instance.com/api/posts');
  const data = await response.json();
  return data;
}

// In eleventy.config.js
eleventyConfig.addGlobalData("strapiPosts", async () => {
  return await getStrapiContent();
});
```

#### **Contentful Integration**

```javascript
// contentful.js
const contentful = require('contentful');

const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
});

async function getContentfulPosts() {
  const entries = await client.getEntries({
    content_type: 'blogPost'
  });
  return entries.items;
}
```

## Performance Monitoring

### Analytics Integration

#### **Google Analytics 4**

```html
<!-- In base.njk template -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### **Core Web Vitals Monitoring**

```javascript
// web-vitals.js
import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';

function sendToAnalytics(metric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_category: 'Web Vitals',
    event_label: metric.id,
    non_interaction: true,
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### Error Monitoring

#### **Sentry Integration**

```javascript
// sentry.js
import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV
});
```

## Security Considerations

### Content Security Policy

```html
<!-- In base.njk template -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://www.google-analytics.com;
">
```

### Security Headers

```nginx
# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Troubleshooting

### Common Deployment Issues

#### **Build Failures**

```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for syntax errors
npm run build 2>&1 | grep -i error
```

#### **Content Not Updating**

```bash
# Check content path configuration
echo $NEUTRINO_CONTENT_PATH

# Verify content files exist
ls -la src/content/

# Check for draft content
grep -r "draft: true" src/content/
```

#### **CSS Not Loading**

```bash
# Check CSS compilation
npm run build:css

# Verify CSS files exist
ls -la src/assets/css/

# Check for SCSS syntax errors
sass --check src/sass/core.scss
```

### Performance Issues

#### **Large Bundle Sizes**

```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer _site/assets/css/*.css

# Check for unused CSS
npm install -g purgecss
purgecss --css _site/assets/css/*.css --content _site/**/*.html
```

#### **Slow Loading Times**

```bash
# Check image optimization
ls -lh _site/assets/images/

# Verify compression
gzip -l _site/assets/css/*.css

# Test with Lighthouse
npx lighthouse http://localhost:8080 --output html
```

## Best Practices

### Pre-Deployment Checklist

- [ ] **Build verification**: Site builds without errors
- [ ] **Content validation**: No draft content in production
- [ ] **Asset optimization**: Images and CSS optimized
- [ ] **Performance testing**: Lighthouse score > 90
- [ ] **Security headers**: CSP and security headers configured
- [ ] **Analytics setup**: Tracking configured
- [ ] **Backup strategy**: Content and configuration backed up
- [ ] **Monitoring**: Error tracking and performance monitoring

### Post-Deployment Verification

- [ ] **Site accessibility**: All pages load correctly
- [ ] **Form functionality**: Contact forms and CMS work
- [ ] **Mobile responsiveness**: Site works on all devices
- [ ] **SEO verification**: Meta tags and structured data
- [ ] **Performance check**: Core Web Vitals within targets
- [ ] **Security scan**: No vulnerabilities detected

### Maintenance

- [ ] **Regular updates**: Keep dependencies updated
- [ ] **Content backups**: Regular content backups
- [ ] **Performance monitoring**: Track Core Web Vitals
- [ ] **Security updates**: Monitor for security patches
- [ ] **Analytics review**: Regular performance analysis

This comprehensive deployment guide covers all aspects of deploying Neutrino sites, from simple static hosting to advanced CI/CD pipelines and performance optimization.