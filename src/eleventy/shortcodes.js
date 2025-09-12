import path from "node:path";
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

export default (cfg)=> {
  cfg.addNunjucksAsyncShortcode("image", imageShortcode);
};
