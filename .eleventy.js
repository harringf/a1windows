const pluginRss = require("@11ty/eleventy-plugin-rss").default || require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  // Pass-through static assets that 11ty shouldn't process
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/css/styles.css": "css/styles.css" });
  eleventyConfig.addPassthroughCopy({ "src/css/tailwind.css": "css/tailwind.css" });

  // Watch the built tailwind.css so changes trigger a browser reload
  eleventyConfig.addWatchTarget("src/css/tailwind.css");

  // Date filter (used by post layout and blog index)
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  // ISO date filter (for <time datetime="..."> and RSS)
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return new Date(dateObj).toISOString();
  });

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
