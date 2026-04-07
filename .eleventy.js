module.exports = function (eleventyConfig) {
  // Pass-through static assets that 11ty shouldn't process
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/css/styles.css": "css/styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/css/tailwind.css": "css/tailwind.css" });

  // Watch the built tailwind.css so changes trigger a browser reload
  eleventyConfig.addWatchTarget("src/css/tailwind.css");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
