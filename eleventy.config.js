// import Image from "@11ty/eleventy-img";
import slugify from "slugify";
import MarkdownIt from 'markdown-it';
import MarkdownItLinkAttributes from 'markdown-it-link-attributes';
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeExpressiveCode from 'rehype-expressive-code';
import rehypeStringify from 'rehype-stringify';
import { DateTime } from "luxon";
import filters from "./src/eleventy/filters.js";
import rss from "./src/eleventy/utils/rss.js";
// import * as cheerio from 'cheerio'; // Removed cheerio dependency

// Import SEO utilities
import { register as registerSEO } from "./src/eleventy/seo.js";

dotenv.config();

const site = JSON.parse(fs.readFileSync("./src/_data/site.json", "utf-8"));

/**
 * Replace ${VARNAME} in a string with corresponding process.env values.
 * Example: "${NEUTRINO_CONTENT_PATH}" → "D:/..."
 */
function expandEnv(str) {
  if (typeof str !== "string") return str;
  return str.replace(/\$\{([^}]+)\}/g, (_, key) => process.env[key] ?? "");
}

/**
 * Copy directory recursively with proper error handling
 */
function copyDirectoryRecursive(source, destination) {
  try {
    // Ensure destination directory exists
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    // Read source directory
    const items = fs.readdirSync(source);
    
    for (const item of items) {
      const sourcePath = path.join(source, item);
      const destPath = path.join(destination, item);
      
      if (fs.statSync(sourcePath).isDirectory()) {
        // Recursively copy subdirectories
        copyDirectoryRecursive(sourcePath, destPath);
      } else {
        // Copy files
        fs.copyFileSync(sourcePath, destPath);
      }
    }
    
    console.log(`✅ Contents copied from: ${source} → ${destination}`);
  } catch (error) {
    console.error(`❌ Error during copy: ${error.message}`);
    throw error;
  }
}

/**
 * Setup content directory automatically
 */
function setupContentDirectory() {
  // Expand and normalize the content path
  const raw = expandEnv(site.contentPath);
  const resolvedRaw = raw && raw.trim().length ? raw : "src/content";

  // Resolve path relative to project root (process.cwd())
  const contentPath = path.isAbsolute(resolvedRaw)
    ? resolvedRaw
    : path.resolve(process.cwd(), resolvedRaw);

  // Check if external content path exists
  if (!fs.existsSync(contentPath)) {
    throw new Error(
      `❌ Content path not found:\n${contentPath}\n\n` +
      `Check your contentPath in site.json or the .env variable NEUTRINO_CONTENT_PATH`
    );
  }

  // Define local content directory
  const localContentDir = path.join(process.cwd(), "src", "content");
  
  // Check if we need to copy contents
  if (!fs.existsSync(localContentDir) || fs.readdirSync(localContentDir).length === 0) {
    console.log(`🔄 Automatic content directory setup...`);
    console.log(`📁 External path: ${contentPath}`);
    console.log(`📁 Local directory: ${localContentDir}`);
    
    // Copy contents from external path to local src/content
    copyDirectoryRecursive(contentPath, localContentDir);
  } else {
    console.log(`✅ Content directory already configured: ${localContentDir}`);
  }

  return localContentDir;
}

// Setup content directory before Eleventy configuration
const localContentPath = setupContentDirectory();

export default function(eleventyConfig) {
  // eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  // eleventyConfig.addLiquidShortcode("image", imageShortcode);
  // eleventyConfig.addJavaScriptFunction("image", imageShortcode);

  const activeTheme = process.env.THEME || "neutrino-electron-core";

  // Watch folders
  eleventyConfig.addWatchTarget("src/_data");
  eleventyConfig.addWatchTarget("src/scss");
  eleventyConfig.addWatchTarget(`themes/${activeTheme}`);
  eleventyConfig.addWatchTarget(localContentPath); // Watch content directory

  // Pass-through static files
  eleventyConfig.addPassthroughCopy({ "src/assets": "/assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "/admin" });

  // Pass-through for content media - copy only post directories
  eleventyConfig.addPassthroughCopy({ "src/content/posts": "/content/posts" });

  // Global variable for Nunjucks templates
  eleventyConfig.addGlobalData("theme", activeTheme);

  // add collections for posts, projects, and documentation
  eleventyConfig.addCollection('posts', collection => {
    const posts = collection.getFilteredByGlob(['src/content/posts/*/*.md']);
    console.log(`[📝] Collection posts: found ${posts.length} posts`);
    console.log(`[🔍] Pattern used: src/content/posts/*/*.md`);
    return posts;
  });

  eleventyConfig.addCollection('documentation', collection => {
    const docs = collection.getFilteredByGlob(['src/content/documentation/*.md']);
    console.log(`[📚] Collection documentation: found ${docs.length} pages`);
    console.log(`[🔍] Pattern used: src/content/documentation/*.md`);
    return docs.sort((a, b) => {
      // Sort by order field first, then by title
      const orderA = a.data.order || 999;
      const orderB = b.data.order || 999;
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // If same order, sort by title
      const titleA = a.data.title || a.fileSlug || '';
      const titleB = b.data.title || b.fileSlug || '';
      return titleA.localeCompare(titleB);
    });
  });

  eleventyConfig.addFilter("slugify", str =>
    slugify(str, { lower: true, strict: true })
  );

  // Register SEO filters and utilities
  registerSEO(eleventyConfig);

  // Documentation navigation filters
  eleventyConfig.addFilter("getNextDoc", (currentUrl, docs) => {
    const currentIndex = docs.findIndex(doc => doc.url === currentUrl);
    return currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null;
  });

  eleventyConfig.addFilter("getPrevDoc", (currentUrl, docs) => {
    const currentIndex = docs.findIndex(doc => doc.url === currentUrl);
    return currentIndex > 0 ? docs[currentIndex - 1] : null;
  });

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExpressiveCode, {
      themes: ['github-light', 'github-dark'],
      defaultProps: {
        wrap: true
      }
    })
    .use(rehypeStringify);

  eleventyConfig.setLibrary("md", {
    async render(str) {
      const result = await processor.process(str);
      return result.toString();
    }
  });

  // Configure markdown-it
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(MarkdownItLinkAttributes, {
    pattern: /^https?:/,
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  });

  // Date formatting with Luxon
  eleventyConfig.addFilter("date", (dateObj, format = "dd LLLL yyyy") => {
    let dt;
    
    if (typeof dateObj === 'string') {
      // try different string formats
      dt = DateTime.fromISO(dateObj) || 
           DateTime.fromSQL(dateObj) || 
           DateTime.fromFormat(dateObj, 'yyyy-MM-dd');
    } else if (dateObj instanceof Date) {
      dt = DateTime.fromJSDate(dateObj);
    } else {
      // Fallback
      dt = DateTime.fromJSDate(new Date(dateObj));
    }
    
    return dt.setZone("utc").setLocale("it").toFormat(format);
  });

  // Filter to include markdown files with Expressive Code support
  eleventyConfig.addFilter("includeMarkdown", async function(markdownPath) {
    try {
      // Path relative to src/_includes directory
      const fullPath = path.join(process.cwd(), 'src', '_includes', markdownPath);
      
      console.log(`🔍 Looking for markdown file: ${fullPath}`);
      console.log(`🔍 File exists: ${fs.existsSync(fullPath)}`);
      
      if (fs.existsSync(fullPath)) {
        const markdownContent = fs.readFileSync(fullPath, 'utf-8');
        console.log(`✅ Successfully loaded: ${markdownPath}`);
        
        // Use unified processor with Expressive Code
        const result = await processor.process(markdownContent);
        return result.toString();
      } else {
        console.warn(`⚠️  Markdown file not found: ${fullPath}`);
        return `<p>⚠️ Content not found: ${markdownPath}</p>`;
      }
    } catch (error) {
      console.error(`❌ Error loading ${markdownPath}:`, error);
      return `<p>❌ Error loading content</p>`;
    }
  });

  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      const input = (data.page?.inputPath || "").replace(/\\/g, "/");
      if (input.includes("/content/posts/")) {
        // Use slug from frontmatter, otherwise fallback to fileSlug
        const slug = data.slug || data.page.fileSlug;
        return `/blog/${slug}/`;
      }
      if (input.includes("/content/documentation/")) {
        // Use slug from frontmatter, otherwise fallback to fileSlug
        const slug = data.slug || data.page.fileSlug;
        return `/documentation/${slug}/`;
      }
      return data.permalink;
    },
    layout: (data) => {
      const input = (data.page?.inputPath || "").replace(/\\/g, "/");
      if (input.includes("/content/posts/")) return "layouts/single-post.njk";
      return data.layout;
    },
    tags: (data) => {
      const input = (data.page?.inputPath || "").replace(/\\/g, "/");
      if (!input.includes("/content/posts/")) return data.tags;
      const prev = Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []);
      return Array.from(new Set([...prev, "blog"]));
    },
  });


  // Add transform to add IDs to headings and insert TOC in aside
  eleventyConfig.addTransform("addHeadingIdsAndTOC", function(content, outputPath) {
    // Only process HTML files in documentation
    if (outputPath && outputPath.endsWith('.html') && outputPath.includes('/documentation/')) {
      console.log(`Adding heading IDs and TOC for: ${outputPath}`);
      
      // Find all h2 elements and add IDs
      const h2Regex = /<h2([^>]*)>(.*?)<\/h2>/gi;
      const headings = [];
      let headingCount = 0;
      
      content = content.replace(h2Regex, (match, attributes, title) => {
        const cleanTitle = title.replace(/<[^>]*>/g, '').trim(); // Remove HTML tags
        const anchor = cleanTitle
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        
        // Add ID to the h2 element if it doesn't already have one
        const hasId = attributes.includes('id=');
        if (!hasId) {
          headingCount++;
          headings.push({
            title: cleanTitle,
            anchor: anchor
          });
          return `<h2${attributes} id="${anchor}">${title}</h2>`;
        } else {
          return match; // Keep existing ID
        }
      });
      
      // Generate TOC HTML if we have headings
      if (headings.length > 0) {
        let tocHTML = '<nav class="documentation-toc">\n';
        tocHTML += '  <h3>On this page</h3>\n';
        tocHTML += '  <ul>\n';
        
        headings.forEach(heading => {
          tocHTML += `    <li>\n`;
          tocHTML += `      <a href="#${heading.anchor}">${heading.title}</a>\n`;
          tocHTML += `    </li>\n`;
        });
        
        tocHTML += '  </ul>\n';
        tocHTML += '</nav>';
        
        // Replace the TOC placeholder in the aside
        const tocPlaceholderRegex = /<nav class="documentation-toc">[\s\S]*?<\/nav>/gi;
        content = content.replace(tocPlaceholderRegex, tocHTML);
        
        console.log(`Added IDs to ${headingCount} headings and inserted TOC for ${outputPath}`);
      }
      
      return content;
    }
    
    return content;
  });

  // Load filters
  filters(eleventyConfig);
  rss(eleventyConfig);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true
  };
}
