// import Image from "@11ty/eleventy-img";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
const site = JSON.parse(fs.readFileSync("./src/_data/site.json", "utf-8"));

dotenv.config();

// // Images Support Suported by Eleventy
// async function imageShortcode(src, alt, sizes) {
//   let fullSrc = path.join(__dirname, "src", src.replace(/^\//, ""));
//   let metadata = await Image(fullSrc, {
//     widths: [300, 600],
//     formats: ["jpeg", "png", "webp"],
//     urlPath: "/images/",
//     outputDir: "./_sites/images/"
//   });

//   let imageAttributes = {
//     alt,
//     sizes,
//     loading: "lazy",
//     decoding: "async",
//   };

//   return Image.generateHTML(metadata, imageAttributes);
// }

export default function(eleventyConfig) {
  // eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  // eleventyConfig.addLiquidShortcode("image", imageShortcode);
  // eleventyConfig.addJavaScriptFunction("image", imageShortcode);

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
