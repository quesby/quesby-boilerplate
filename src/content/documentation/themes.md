---
title: Theme System
description: Complete guide to Neutrino Electron theme system and customization
layout: layouts/base.njk
aside: aside-documentation.njk
toc: toc-documentation.njk
navfooter: documentation-nav-footer.njk
class: documentation
order: 6
lastUpdated: "2025-09-12"
---

# Neutrino Theme System

## Overview

The Neutrino theme system is a SCSS-based styling architecture that allows you to customize the visual appearance of your website. The system uses modular SCSS files and CSS custom properties to provide flexible theming with support for multiple visual themes (light, dark, sepia).

## System Structure

```
src/
├── themes/                          # Theme directory
│   ├── neutrino-electron-core/      # Default theme
│   │   ├── _base.scss              # Base styles and CSS variables
│   │   ├── _blog.scss              # Blog-specific styles
│   │   ├── _components.scss        # Reusable components
│   │   ├── _documentation.scss     # Documentation styles
│   │   ├── _forms.scss             # Form elements
│   │   ├── _home.scss              # Homepage styles
│   │   ├── _page.scss              # General page styles
│   │   ├── _responsive.scss        # Responsive breakpoints
│   │   ├── _theme-header.scss      # Header component
│   │   ├── _theme-typography.scss  # Typography system
│   │   ├── _theme-variables.scss   # Theme color variables
│   │   └── skin.scss               # Main theme file
│   └── neutrino-brand-website/     # Alternative theme
│       └── [same structure]
├── sass/                           # Core SCSS files
│   ├── _mixins.scss               # SCSS mixins
│   ├── _reset.scss                # CSS reset
│   ├── _typography.scss           # Base typography
│   ├── _variables.scss            # Core variables
│   └── core.scss                  # Main core file
└── _data/
    └── site.json                  # Site configuration
```

## Theme Configuration

### 1. Theme Selection

Configure your active theme in `src/_data/site.json`:

```json
{
  "theme": "neutrino-electron-core",
  "defaultVisualTheme": "dark"
}
```

**Available Themes:**
- `neutrino-electron-core` (default)
- `neutrino-brand-website`

> **Note**: For detailed configuration options, see the [Configuration Guide](./configuration.md#theme-configuration).

### 2. Visual Theme Toggle

The system supports three visual themes that users can toggle:

- **Light Theme**: Default light appearance
- **Dark Theme**: Dark mode with inverted colors
- **Sepia Theme**: Warm, paper-like appearance

The theme toggle is handled by JavaScript in `src/assets/js/togglemode.js` and persists user preference in localStorage.

**JavaScript Implementation:**
```javascript
// assets/js/togglemode.js
document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'dark';
  
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  themeToggle?.addEventListener('click', function() {
    const themes = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  });
});
```

**CSS Fallback**: Users without JavaScript will see the `defaultVisualTheme` from `site.json`.

## Theme Architecture

### 1. Core SCSS Structure

Each theme follows this modular structure:

```scss
// skin.scss - Main theme file
@use 'sass:map';
@use 'sass:color';
@import '../../sass/core';           // Core styles

@import "_theme-variables";          // Color definitions
@import "_theme-typography";         // Typography system
@import "_base";                     // Base styles
@import "_forms";                    // Form elements

@import "_theme-header";             // Header component
@import "_page";                     // Page layouts
@import "_home";                     // Homepage
@import "_blog";                     // Blog styles
@import "_documentation";            // Documentation
@import "_responsive";               // Responsive design
```

### 2. Color System

Themes use SCSS maps to define colors for different visual themes:

```scss
// _theme-variables.scss
$theme-light: (
  text-fg: oklch(31.85% 0.018 18.1),
  link-fg: color.adjust(white, $lightness: -10%),
  bg: oklch(100% 0 0),
  // ... more colors
);
```

> **SCSS Compatibility Note**: `color.adjust()` requires Dart Sass 1.27.0+. For older versions, use `lighten()`, `darken()`, or `mix()` functions instead.

$theme-dark: (
  text-fg: oklch(93% 0 0),
  link-fg: oklch(84% 27% 45),
  bg: oklch(15% 0 0),
  // ... more colors
);

$theme-sepia: (
  text-fg: oklch(31.85% 0.018 18.1),
  link-fg: color.adjust(oklch(31.85% 0.018 18.1), $lightness: -10%),
  bg: oklch(98% 0.01 45),
  // ... more colors
);
```

### 3. CSS Custom Properties

Colors are converted to CSS custom properties for runtime theme switching:

```scss
// _base.scss
:root {
  @each $name, $value in $theme-light {
    --#{$name}: #{$value};
  }
}

.dark {
  @each $name, $value in $theme-dark {
    --#{$name}: #{$value};
  }
}

.sepia {
  @each $name, $value in $theme-sepia {
    --#{$name}: #{$value};
  }
}
```

## Build System

### 1. Sass Compilation

The build system compiles SCSS files using the following commands:

```bash
# Development (with watch)
npm run watch:css

# Production build
npm run build:css

# Serve with CSS watch
npm run serve
```

> **Note**: For detailed development workflow, see the [Development Guide](./development.md#development-workflow).
```

### 2. Build Process

The build system:
1. Compiles core SCSS from `src/sass/` to `src/assets/css/`
2. Compiles active theme SCSS from `src/themes/{theme}/` to `src/assets/css/`
3. Generates compressed CSS for production
4. Watches for changes during development

### 3. File Output

Compiled CSS files:
- `src/assets/css/core.css` - Core styles
- `src/assets/css/skin.css` - Theme styles
- `src/assets/css/expressive-code.css` - Code highlighting

## Creating Custom Themes

### 1. Theme Structure

To create a new theme:

1. Create a new directory in `src/themes/your-theme-name/`
2. Copy the structure from an existing theme
3. Modify the SCSS files to match your design
4. Update `site.json` to use your theme

### 2. Essential Files

**Required Files (Hard Requirements):**
- `skin.scss` - Main entry point (imports all other files)
- `_theme-variables.scss` - Color definitions for all visual themes
- `_theme-typography.scss` - Typography system
- `_base.scss` - Base styles and CSS variables

**Optional Files (Theme-specific):**
- `_blog.scss` - Blog-specific styles (only if theme includes blog)
- `_documentation.scss` - Documentation styles (only if theme includes docs)
- `_home.scss` - Homepage styles (only if theme has custom homepage)
- `_components.scss` - Reusable components
- `_forms.scss` - Form elements
- `_page.scss` - General page styles
- `_responsive.scss` - Responsive breakpoints
- `_theme-header.scss` - Header component

> **Note**: A minimal theme only needs the 4 required files. Optional files can be omitted if not needed.

### 3. Color Customization

Modify `_theme-variables.scss` to change colors:

```scss
$theme-light: (
  text-fg: #your-color,
  link-fg: #your-link-color,
  bg: #your-background,
  // ... define all required colors
);
```

### 4. Typography Customization

Update `_theme-typography.scss` for custom fonts:

```scss
:root {
  --font-family-heading: 'Your Font', sans-serif;
  --font-family-body: 'Your Body Font', sans-serif;
  --font-size-base: 16px;
  --line-height-base: 1.6;
}
```

## Advanced Customization

### 1. CSS Custom Properties

Override theme variables using CSS custom properties:

```css
:root {
  --text-fg: #custom-color;
  --bg: #custom-background;
  --font-family-heading: 'Custom Font';
}
```

### 2. Component Styling

Create custom component styles:

```scss
.custom-button {
  background: var(--link-fg);
  color: var(--bg);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  
  &:hover {
    opacity: 0.8;
  }
}
```

### 3. Responsive Design

Use the responsive mixins and breakpoints:

```scss
@import '../../sass/mixins';

.custom-layout {
  display: flex;
  
  @include mobile {
    flex-direction: column;
  }
  
  @include tablet {
    flex-wrap: wrap;
  }
}
```

## Theme Development

### 1. Development Workflow

1. Set your theme in `site.json`
2. Run `npm run serve` for development
3. Modify SCSS files in your theme directory
4. Changes are automatically compiled and reloaded

> **Note**: For detailed development workflow, see the [Development Guide](./development.md#development-workflow).

### 2. Testing Themes

Test your theme across:
- Different visual themes (light/dark/sepia)
- Various screen sizes
- Different browsers
- Content types (blog, pages, documentation)

### 3. Performance Considerations

- Use CSS custom properties for runtime theme switching
- Minimize the number of color variations
- Optimize SCSS compilation with proper imports
- Test build times with large themes

## Troubleshooting

### Theme Not Loading

**Problem**: Theme styles not appearing
**Solutions**:
- Check theme name in `site.json` matches directory name
- Ensure `skin.scss` exists in theme directory
- Verify SCSS compilation is working (`npm run build:css`)
- Check browser console for CSS errors

### Colors Not Changing

**Problem**: Visual theme toggle not working
**Solutions**:
- Verify CSS custom properties are defined in `_base.scss`
- Check JavaScript toggle functionality
- Ensure theme classes (`.dark`, `.sepia`) are applied
- Test localStorage theme persistence

### Build Errors

**Problem**: SCSS compilation fails
**Solutions**:
- Check SCSS syntax in theme files
- Verify all imports exist and are correct
- Ensure proper use of SCSS functions and mixins
- Check for circular imports

### Responsive Issues

**Problem**: Styles not responsive
**Solutions**:
- Verify `_responsive.scss` is imported
- Check breakpoint definitions
- Test media queries in browser dev tools
- Ensure proper viewport meta tag

## Best Practices

### 1. Theme Organization

- Keep related styles in appropriate files
- Use descriptive variable names
- Comment complex SCSS logic
- Maintain consistent naming conventions

### 2. Color Management

- Define all colors in `_theme-variables.scss`
- Use semantic color names (text-fg, bg, link-fg)
- Test colors in all visual themes
- Ensure sufficient contrast ratios

### 3. Performance

- Minimize CSS output size
- Use efficient selectors
- Avoid deep nesting in SCSS
- Optimize for critical rendering path

### 4. Maintainability

- Document custom variables and mixins
- Keep themes modular and focused
- Test changes across all content types
- Version control theme changes

## Integration with Eleventy

The theme system integrates with Eleventy through:

- **Global Data**: Theme name available as `{{ theme }}` in templates
- **Watch Targets**: Eleventy watches theme files for changes
- **Asset Pipeline**: Compiled CSS is served as static assets
- **Template Variables**: Theme information accessible in Nunjucks templates

## Planned Ideas

These are potential future improvements to the theme system (not commitments):

- **Theme Marketplace**: Community-driven theme repository
- **Visual Theme Builder**: Web-based theme creation tool
- **Advanced Color Tools**: Color palette generators and contrast checkers
- **Theme Validation**: Automated testing for theme compatibility
- **Performance Monitoring**: Built-in CSS performance metrics

> **Note**: These are ideas for future development. Implementation depends on community interest and project priorities.