// import Image from "@11ty/eleventy-img";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";

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
