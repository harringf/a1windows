const pluginRss = require("@11ty/eleventy-plugin-rss").default || require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  // Pass-through static assets — watch: true ensures re-copy on change during dev
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/videos": "videos" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" }, { watch: true });
  eleventyConfig.addPassthroughCopy({ "src/css/styles.css": "css/styles.css" }, { watch: true });
  eleventyConfig.addPassthroughCopy({ "src/css/tailwind.css": "css/tailwind.css" }, { watch: true });

  // Watch CSS and JS directories so changes trigger a browser reload
  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  // Use polling for file watch (more reliable for some editors/OS)
  eleventyConfig.setWatchThrottleWaitTime(100);

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
