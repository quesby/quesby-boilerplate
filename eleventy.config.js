import dotenv from "dotenv";
import path from "path";
import fs from "fs";
const site = JSON.parse(fs.readFileSync("./src/_data/site.json", "utf-8"));

dotenv.config();

export default function(eleventyConfig) {
  const activeTheme = process.env.THEME || "neutrino-electron-core";

  // Symlink dinamico per src/content
  const externalContentPath = path.isAbsolute(site.contentPath)
  ? site.contentPath
  : path.resolve(__dirname, site.contentPath);

  const localContentMount = path.join("src", "content");

  if (fs.existsSync(localContentMount)) {
    fs.rmSync(localContentMount, { recursive: true, force: true });
  }

  if (!fs.existsSync(externalContentPath)) {
    console.warn(`[⚠] Percorso contenuti non trovato: ${externalContentPath}`);
  } else {
    fs.symlinkSync(externalContentPath, localContentMount, "junction");
    console.log(`[✓] Collegato contenuto esterno da: ${externalContentPath}`);
  }

  // Watch folders
  eleventyConfig.addWatchTarget("src/_data");
  eleventyConfig.addWatchTarget("src/scss");
  eleventyConfig.addWatchTarget(`themes/${activeTheme}`);

  // Pass-through static files
  eleventyConfig.addPassthroughCopy({ "src/assets": "/assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "/admin" });

  // Variabile globale per i template Nunjucks
  eleventyConfig.addGlobalData("theme", activeTheme);

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
