---
id: memr8xyz123abc456def789ghi
title: "Implementing eleventy-img for Nunjucks Shortcodes and Markdown Images"
slug: eleventy-img-markdown-guide
description: "A practical guide to integrate eleventy-img in Eleventy: custom Nunjucks shortcodes and automatic Markdown image processing with responsive sourcesets."
date: 2025-09-12
author: Green Panda Studio
type: post
createdAt: 2025-09-12T12:00:00.000Z
aliases:
  - /blog/eleventy-img-markdown-guide/
tags:
  - eleventy
  - eleventy-img
  - nunjucks
  - markdown
  - performance
  - webp
  - avif
draft: false
templateEngineOverride: "md"
---

When you build a site with Eleventy, images can quickly become a performance bottleneck. Visitors expect sharp visuals that load fast on every device, and modern formats like AVIF and WebP can make a huge difference. The problem is: managing responsive images by hand is messy.  

This is where **[`eleventy-img`](https://www.11ty.dev/docs/plugins/image/)** comes in. With a small amount of setup, you can automatically generate multiple sizes and formats, then drop them into your pages using a simple shortcode—or even process standard Markdown images automatically.  

In this guide, we’ll walk through a complete setup that covers both approaches.

---

## Prerequisites

Before starting, you should have:

- An Eleventy project up and running  
- Node.js and npm installed  
- A basic understanding of Nunjucks templates and Markdown  

---

## Setting Up `eleventy-img`

First install the package:

```bash
npm install @11ty/eleventy-img
```

---

## Approach 1: A Custom Nunjucks Shortcode

Shortcodes are a clean way to embed optimized images directly in your templates. Create a file called `src/eleventy/shortcodes.js` and add the following:


```js
import path from "node:path";
import Image from "@11ty/eleventy-img";

async function imageShortcode(src, alt, sizes = "100vw") {
  if (!alt) throw new Error(`Missing alt for ${src}`);

  const resolved = path.resolve("src/assets/images", src.replace(/^\/?src\/assets\/images\/?/, ""));

  const metadata = await Image(resolved, {
    widths: [320, 640, 960, 1280, null],
    formats: ["avif", "webp"],
    outputDir: "./_site/img/",
    urlPath: "/img/"
  });

  return `<figure>${Image.generateHTML(metadata, {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async"
  })}</figure>`;
}

export default (cfg) => {
  cfg.addNunjucksAsyncShortcode("image", imageShortcode);
};
```


Then import it in your `eleventy.config.js`:


```js
import shortcodes from "./src/eleventy/shortcodes.js";

export default function(eleventyConfig) {
  shortcodes(eleventyConfig);
}
```


From now on you can write:


```njk
{% image "src/assets/images/hero.jpg", "Homepage hero image" %}
```


…and Eleventy will output a `<picture>` element with AVIF, WebP, and all the necessary widths.

---

## Approach 2: Automatically Handling Markdown Images

Markdown images like:


```markdown
![Screenshot](/assets/images/app.png)
```


are convenient, but Eleventy doesn’t optimize them by default. To fix this, we can extend the Markdown pipeline so every image goes through `eleventy-img` behind the scenes. The idea is:

1. Replace Markdown `<img>` tags with placeholders during rendering  
2. After Eleventy generates the HTML, run a transform that swaps those placeholders with fully optimized `<picture>` elements  

This takes a bit more code, but the result is seamless: authors keep using plain Markdown, while the build process ensures images are always responsive and optimized.

---

## Putting It All Together

With this setup:

- **Nunjucks shortcodes** are available when you want fine-grained control.  
- **Plain Markdown images** also get optimized automatically.  

The end result looks like this:

```html
<figure>
  <picture>
    <source srcset="/img/example-320.avif 320w, /img/example-640.avif 640w, ..." type="image/avif">
    <source srcset="/img/example-320.webp 320w, /img/example-640.webp 640w, ..." type="image/webp">
    <img src="/img/example-1280.webp" alt="Screenshot" sizes="100vw" loading="lazy" decoding="async">
  </picture>
</figure>
```

---

## Why Bother?

- **Performance:** AVIF and WebP drastically reduce file size without sacrificing quality  
- **Responsive design:** multiple widths ensure the browser always picks the right size  
- **Accessibility:** alt text is preserved everywhere  
- **Convenience:** authors can keep writing Markdown as usual  

---

## Wrapping Up

By combining a Nunjucks shortcode with a Markdown transform, you get the best of both worlds: flexibility for custom templates and simplicity for everyday content.  

This approach is a solid starting point for any Eleventy project that takes performance seriously. And once you’ve set it up, you’ll never need to worry about hand-crafting `<picture>` tags again.

---

*This article is part of Neutrino, an open-source boilerplate for modern static sites. See the [GitHub repository](https://github.com/greenpandastudio/neutrino-electron).*
