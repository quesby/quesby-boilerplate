export default function(eleventyConfig) {
  eleventyConfig.addWatchTarget("src/_data");
  eleventyConfig.addWatchTarget("src/scss");
  eleventyConfig.addPassthroughCopy({ "src/assets": "/assets" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "/admin" });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    passthroughFileCopy: true
  };
}
