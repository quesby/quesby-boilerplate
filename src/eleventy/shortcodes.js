import path from "node:path";
import fs from "fs";
import Image from "@11ty/eleventy-img";

// Shortcode for images - ASYNC
async function imageShortcode(src, alt = "", sizes = "100vw") {
  if (!src) return "";
  if (!alt) throw new Error(`Missing alt for ${src}`);

  // Resolve always relative to "src/"
  const resolved = path.resolve("src", src);

  if (!fs.existsSync(resolved)) {
    console.warn(`[imageShortcode] File not found: ${resolved}`);
    return "";
  }

  const metadata = await Image(resolved, {
    widths: [320, 640, 960, 1280, null],
    formats: ["avif", "webp"],
    outputDir: "./_site/img/",
    urlPath: "/img/",
  });

  return Image.generateHTML(metadata, {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async"
  });
}

// Shortcode for images - SYNC
function imageShortcodeSync(src, alt = "", sizes = "100vw") {
  const resolved = path.resolve("src", src);
  const metadata = Image.statsSync(resolved, {
    widths: [320, 640, 960, 1280, null],
    formats: ["avif","webp"],
    outputDir: "./_site/img/",
    urlPath: "/img/",
  });
  return Image.generateHTML(metadata, { alt, sizes, loading:"lazy", decoding:"async" });
}


// Shortcode for SVG inline
function svgShortcode(svgPath, className = "") {
  console.log(`[DEBUG] SVG shortcode called with: ${svgPath}, ${className}`);
  try {
    const fullPath = path.join(process.cwd(), 'src', svgPath);
    console.log(`[DEBUG] Full path: ${fullPath}`);
    const svgContent = fs.readFileSync(fullPath, 'utf8');
    console.log(`[DEBUG] SVG content length: ${svgContent.length}`);
    
    // Remove existing <svg> tags and add the class
    const cleanSvg = svgContent
      .replace(/<svg([^>]*)>/, `<svg$1 class="${className}"`)
      .replace(/<\/svg>/, '');
      
    return cleanSvg;
  } catch (error) {
    console.error(`Error loading SVG: ${svgPath}`, error);
    return '';
  }
}

// Shortcode for simple images
function imageSimpleShortcode(src, alt, className = "") {
  // Ensure the path is correct
  const imagePath = src.startsWith('/') ? src : `/${src}`;
  return `<img src="${imagePath}" alt="${alt}" class="${className}" loading="lazy" decoding="async">`;
}

export default (cfg)=> {
  console.log('[DEBUG] Registering shortcodes...');
  cfg.addNunjucksAsyncShortcode("image", imageShortcode);
  cfg.addNunjucksShortcode("imageSync", imageShortcodeSync);
  cfg.addNunjucksShortcode("imageSimple", imageSimpleShortcode); // Add this line
  cfg.addNunjucksShortcode("svg", svgShortcode);
  console.log('[DEBUG] Shortcodes registered');
};
