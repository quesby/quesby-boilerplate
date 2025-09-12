# Neutrino Theme System

## Overview

The Neutrino CMS theme system allows users to easily customize the appearance of their website without modifying the original theme files. The system is filesystem-based and supports versioning, design tokens, and smart overrides.

## System Structure

```
src/
├── themes/                          # Theme directory
│   └── neutrino-basic@1.0.0/       # Versioned theme
│       ├── layouts/                # Theme layouts
│       ├── includes/               # Reusable parts
│       ├── styles/                 # SCSS/CSS styles
│       ├── assets/                 # JavaScript and other assets
│       └── theme.config.json       # Theme configuration
├── overrides/                      # User customizations
│   ├── styles/                     # Custom CSS
│   ├── layouts/                    # Custom layouts
│   ├── includes/                   # Custom includes
│   └── theme.config.json           # Local override config
└── _data/
    └── site.json                   # Site + theme configuration
```

## Theme Configuration

### 1. Theme Selection

Inside `src/_data/site.json`:

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

### 2. Theme Configuration File

Each theme includes a `theme.config.json` defining:

* **Metadata**: name, version, author, license
* **Design Tokens**: colors, typography, spacing, breakpoints
* **Features**: supported features
* **Dependencies**: required modules
* **Compatibility**: minimum CMS version required

## Design Tokens

Design tokens are reusable values that define the visual identity of the theme:

### Colors

```json
"colors": {
  "primary": {
    "light": "#0af",
    "dark": "#00d"
  },
  "semantic": {
    "success": "#28a745",
    "warning": "#ffc107",
    "error": "#dc3545"
  }
}
```

### Typography

```json
"typography": {
  "fonts": {
    "heading": "Inter, sans-serif",
    "body": "Inter, sans-serif"
  },
  "weights": {
    "normal": 400,
    "bold": 700
  }
}
```

### Spacing

```json
"spacing": {
  "xs": "0.25rem",
  "sm": "0.5rem",
  "md": "1rem",
  "lg": "1.5rem"
}
```

## Override System

### 1. CSS Override

Users can create custom CSS files inside `src/overrides/styles/`:

```css
/* custom.css */
:root {
  --color-primary: #ff6b6b;  /* Override primary color */
}

.btn {
  border-radius: 25px;       /* Custom button styling */
}
```

### 2. Layout Override

Custom layouts go inside `src/overrides/layouts/`:

```njk
<!-- base.njk override -->
<!DOCTYPE html>
<html>
  <head>
    <!-- Custom head -->
  </head>
  <body>
    <!-- Custom layout -->
  </body>
</html>
```

### 3. Include Override

Custom includes go inside `src/overrides/includes/`:

```njk
<!-- header.njk override -->
<header class="custom-header">
  <!-- Custom header content -->
</header>
```

## Resolution Priority

The system resolves files in the following order:

1. **Overrides** (`src/overrides/`) - Highest priority
2. **Active theme** (`src/themes/{theme}/`) - Medium priority
3. **Fallback theme** - Lowest priority

## Theme Versioning

### Version Format

```
theme-name@major.minor.patch
e.g.: neutrino-basic@1.0.0
```

### Updates

* **Major**: Breaking changes
* **Minor**: Backward-compatible features
* **Patch**: Fixes and small improvements

## Usage in Templates

### Theme Include

```njk
{% include themePath + "/layouts/base.njk" %}
```

### Accessing Theme Data

```njk
{{ themeData.name }}           <!-- Theme name -->
{{ themeData.version }}        <!-- Theme version -->
{{ themeData.designTokens }}   <!-- Design tokens -->
```

### Theme Include Filter

```njk
{{ "styles/main.css" | themeInclude }}
```

## Advanced Customization

### 1. CSS Custom Properties

```css
:root {
  --color-primary: #custom-color;
  --spacing-lg: 2rem;
  --font-family-heading: 'Custom Font';
}
```

### 2. Custom Components

```scss
.custom-button {
  @extend .btn;
  background: var(--color-accent);
  border-radius: var(--radius-full);
}
```

### 3. Responsive Layout

```scss
@media (max-width: var(--breakpoint-md)) {
  .custom-layout {
    flex-direction: column;
  }
}
```

## Best Practices

### 1. Do Not Modify Original Themes

* Always use the override system
* Keep original themes untouched for updates

### 2. Organize Customizations

* Group related overrides
* Use descriptive file names
* Document any changes

### 3. Test Your Changes

* Check across different devices
* Ensure cross-browser compatibility
* Test with multiple themes

## Troubleshooting

### Theme Not Loading

* Check the theme name in `site.json`
* Ensure the theme folder exists
* Validate the JSON syntax

### Overrides Not Working

* Check the directory structure
* Ensure filenames are correct
* Verify resolution priority

### Compilation Errors

* Check SCSS/CSS syntax
* Confirm theme dependencies
* Verify compatibility versions

## Future Roadmap

* **Online Theme Builder**: Create themes via web UI
* **Theme Marketplace**: Community-driven theme repository
* **Import/Export**: Share theme configurations
* **CDN Integration**: Preinstalled themes with auto-updates
* **Plugin System**: Advanced theme extension support