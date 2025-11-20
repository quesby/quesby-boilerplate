export function registerCollections(eleventyConfig) {
  // PERMALINKS CONFIGURATION ----------------------------------------------------
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      const input = (data.page?.inputPath || "").replace(/\\/g, "/");
      const slug = data.slug || data.page?.fileSlug;

      if (input.includes("/content/posts/")) {
        return `/blog/${slug}/`;
      }

      // Documentation collection removed - documentation is now hosted at quesby.dev
      // if (input.includes("/content/documentation/")) {
      //   return `/documentation/${slug}/`;
      // }

      return data.permalink;
    }
  });
}

