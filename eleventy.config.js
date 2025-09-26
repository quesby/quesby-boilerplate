import neutrino from "@neutrino/core";

export default function (eleventyConfig) {
  // Register core configuration
  const coreConfig = neutrino(eleventyConfig);
  
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
