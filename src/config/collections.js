export function registerCollections(eleventyConfig) {
  // PROJECTS ------------------------------------------------------------
  // Collection: projects
  eleventyConfig.addCollection('projects', (collectionApi) => {
    const patterns = [
      'src/content/projects/*/index.md',
      'src/content/projects/*--*/index.md'
    ];
    const items = collectionApi.getFilteredByGlob(patterns);
    console.log(`[🗂] Collection projects: found ${items.length} items`);
    console.log(`[🔍] Patterns used: ${patterns.join(' and ')}`);
    return items;
  });
  // END PROJECTS ------------------------------------------------------------

  // PROJECTS + POSTS + DOCS ----------------------------------------------------
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: (data) => {
      const input = (data.page?.inputPath || "").replace(/\\/g, "/");
      const slug = data.slug || data.page?.fileSlug;

      if (input.includes("/content/posts/")) {
        return `/blog/${slug}/`;
      }

      if (input.includes("/content/projects/")) {
        return `/projects/${slug}/`;
      }

      if (input.includes("/content/documentation/")) {
        return `/documentation/${slug}/`;
      }

      return data.permalink;
    }
  });
}

