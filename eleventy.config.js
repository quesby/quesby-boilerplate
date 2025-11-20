import quesby from "@quesby/core";

export default function (eleventyConfig) {
  // Register core configuration
  const coreConfig = quesby(eleventyConfig);

  // Disable Eleventy's DOM diff / HMR for safer reloads
  eleventyConfig.setServerOptions({
    domDiff: false,     // no HTML delta updates
    hmr: false,         // no hot module replacement
    liveReload: true,   // full reload
    port: 8080          // optional, keep it if you want
  });
  
  // Return merged configuration
  return {
    ...coreConfig,
    dir: { 
      input: "src", 
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
}
