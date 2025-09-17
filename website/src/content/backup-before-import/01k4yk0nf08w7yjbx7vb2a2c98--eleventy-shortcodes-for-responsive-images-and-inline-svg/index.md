---
id: 01K4YK0NF08W7YJBX7VB2A2C98
title: Eleventy shortcodes for responsive images and inline SVG
slug: eleventy-responsive-images-and-inline-svg
date: 2025-09-12T11:11:00.000+02:00
author: Green Panda Studio
draft: false
---
This guide shows how to add two production-ready shortcodes to Eleventy (ESM): a responsive image helper using `@11ty/eleventy-img` and an inline SVG helper that lets you inject CSS classes.

![An AI generated image](/assets/images/documentation/ai-gen.webp)

## Prerequisites

* Eleventy v2+ or v3 with ESM config.
* Nunjucks templates (examples use `{% %}` tags).
* Project layout with assets under `src/`.

Example folders:

```
src/
  assets/
    images/
    icons/
```

## Install

```bash
npm i @11ty/eleventy-img
```

## Shortcodes module

Create `eleventy/shortcodes/media.js`:

```js
import path from "node:path";
import fs from "node:fs";
import Image from "@11ty/eleventy-img";

/** Responsive image (async) */
async function imageShortcode(src, alt, sizes = "100vw") {
  if (!alt) throw new Error(`Missing alt for ${src}`);

  // Normalize to src/assets/images/
  const normalized = src.replace(/^\/?src\/assets\/images\/?/, "");
  const resolved = path.resolve("src/assets/images", normalized);

  const metadata = await Image(resolved, {
    widths: [320, 640, 960, 1280, null],  // null => original width
    formats: ["avif", "webp"],            // add "jpeg" if you want a fallback
    outputDir: "./_site/img/",
    urlPath: "/img/",
  });

  return `<figure>${Image.generateHTML(metadata, {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
  })}</figure>`;
}

/** Inline SVG with optional class */
function svgShortcode(svgPath, className = "") {
  const rel = svgPath.replace(/^\/?src\/?/, ""); // keep paths under src/
  const fullPath = path.join(process.cwd(), "src", rel);
  const svg = fs.readFileSync(fullPath, "utf8");

  if (!className) return svg;

  // Append or set class on the opening <svg ...>
  const hasClass = /<svg([^>]*?)\sclass="([^"]*)"/i.test(svg);
  if (hasClass) {
    return svg.replace(
      /<svg([^>]*?)\sclass="([^"]*)"([^>]*)>/i,
      (_m, pre, cls, post) => `<svg${pre} class="${cls} ${className}"${post}>`
    );
  }
  return svg.replace(/<svg([^>]*)>/i, `<svg$1 class="${className}">`);
}

export default (cfg) => {
  cfg.addNunjucksAsyncShortcode("image", imageShortcode);
  cfg.addNunjucksShortcode("svg", svgShortcode);
};
```

## Register in Eleventy config

In `eleventy.config.js` (ESM):

```js
import mediaShortcodes from "./eleventy/shortcodes/media.js";

export default function(eleventyConfig) {
  eleventyConfig.addPlugin(mediaShortcodes);
}
```

## Usage in Nunjucks

Responsive image (async shortcode):

```njk
{% image "hero/cover.jpg", "Site cover image", "(min-width: 768px) 75vw, 100vw" %}
```

Inline SVG with a custom class:

```njk
{% svg "assets/icons/github.svg", "icon-lg text-neutral-700" %}
```

### Alternative: expression style

If you prefer `{{ ... }}` output for SVG, also register:

```js
// in the plugin function
cfg.addShortcode("svg", svgShortcode);
```

Then:

```njk
{{ svg("assets/icons/github.svg", "icon-lg") | safe }}
```

## Notes and pitfalls

* **“Unable to call ‘svg’…”** means you registered with `addShortcode` but used `{% svg %}`. Use `addNunjucksShortcode` for tag syntax.
* **Paths**: keep inputs relative to `src/…`. The module normalizes `src/assets/images/...` automatically for images and `src/...` for SVGs.
* **Accessibility**: `alt` is required. Use empty `alt` only for decorative images.
* **Fallbacks**: if you need a bitmap fallback, add `"jpeg"` to `formats`.
* **Caching**: `@11ty/eleventy-img` caches processed assets. Commit the cache if you want stable builds in CI.

## Minimal CSS example

```css
.icon-lg { width: 1.5rem; height: 1.5rem; display: inline-block; }
```

## Commit message template

```bash
feat(shortcodes): add responsive image and inline SVG helpers (Nunjucks, ESM)
```
