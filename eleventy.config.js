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
    
    console.log(`✅ Contenuti copiati da: ${source} → ${destination}`);
  } catch (error) {
    console.error(`❌ Errore durante la copia: ${error.message}`);
    throw error;
  }
}

/**
 * Setup content directory automatically
 */
function setupContentDirectory() {
  // Expand and normalize the content path
  const raw = expandEnv(site.contentPath);
  const resolvedRaw = raw && raw.trim().length ? raw : "content";

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
    console.log(`🔄 Setup automatico directory contenuti...`);
    console.log(`📁 Percorso esterno: ${contentPath}`);
    console.log(`📁 Directory locale: ${localContentDir}`);
    
    // Copy contents from external path to local src/content
    copyDirectoryRecursive(contentPath, localContentDir);
  } else {
    console.log(`✅ Directory contenuti già configurata: ${localContentDir}`);
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

  // Pass-through per i media dei contenuti - copia solo le directory dei post
  eleventyConfig.addPassthroughCopy({ "src/content/posts": "/content/posts" });

  // Variabile globale per i template Nunjucks
  eleventyConfig.addGlobalData("theme", activeTheme);

  // add collections for posts and projects
  eleventyConfig.addCollection('posts', collection => {
    const posts = collection.getFilteredByGlob(['src/content/posts/*/*.md']);
    console.log(`[📝] Collection posts: trovati ${posts.length} post`);
    console.log(`[🔍] Pattern usato: src/content/posts/*/*.md`);
    return posts;
  });

  eleventyConfig.addFilter("slugify", str =>
    slugify(str, { lower: true, strict: true })
  );

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
    render(str) {
      return processor.process(str).toString();
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
        
        // Usa il processore unified con Expressive Code
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
        // Usa lo slug dal frontmatter, altrimenti fallback su fileSlug
        const slug = data.slug || data.page.fileSlug;
        return `/blog/${slug}/`;
      }
      if (input.includes("/content/documentation/")) {
        // Usa lo slug dal frontmatter, altrimenti fallback su fileSlug
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
