import path from "node:path";
import fs from "fs";
import Image from "@11ty/eleventy-img";

async function imageShortcode(src, alt, sizes="100vw") {
  if (!alt) throw new Error(`Missing alt for ${src}`);
  const resolved = path.resolve("src/assets/images", src.replace(/^\/?src\/assets\/images\/?/, ""));
  const metadata = await Image(resolved, {
    widths: [320, 640, 960, 1280, null],
    formats: ["avif","webp"],
    outputDir: "./_site/img/",
    urlPath: "/img/",
  });
  return `<figure>${Image.generateHTML(metadata, {alt, sizes, loading:"lazy", decoding:"async"})}</figure>`;
}

// Shortcode per SVG inline
function svgShortcode(svgPath, className = "") {
  console.log(`[DEBUG] SVG shortcode called with: ${svgPath}, ${className}`);
  try {
    const fullPath = path.join(process.cwd(), 'src', svgPath);
    console.log(`[DEBUG] Full path: ${fullPath}`);
    const svgContent = fs.readFileSync(fullPath, 'utf8');
    console.log(`[DEBUG] SVG content length: ${svgContent.length}`);
    
    // Rimuove i tag <svg> esistenti e aggiunge la classe
    const cleanSvg = svgContent
      .replace(/<svg([^>]*)>/, `<svg$1 class="${className}"`)
      .replace(/<\/svg>/, '');
      
    return cleanSvg;
  } catch (error) {
    console.error(`Error loading SVG: ${svgPath}`, error);
    return '';
  }
}

export default (cfg)=> {
  console.log('[DEBUG] Registering shortcodes...');
  cfg.addNunjucksAsyncShortcode("image", imageShortcode);
  cfg.addNunjucksShortcode("svg", svgShortcode);
  console.log('[DEBUG] Shortcodes registered');
};
