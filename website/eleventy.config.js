import neutrino from "@neutrino/core";

export default function (eleventyConfig) {
  neutrino(eleventyConfig); // registra core

  return {
    dir: { input: "src", output: "dist" }
  };
}
