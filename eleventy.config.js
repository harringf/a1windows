import pluginRss from "@11ty/eleventy-plugin-rss";
import Image from "@11ty/eleventy-img";
import path from "node:path";

export default function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);

  // Responsive image shortcode — generates WebP + JPEG at multiple widths
  eleventyConfig.addShortcode("image", async function (src, alt, sizes = "100vw", widths = [400, 800, 1200]) {
    if (!alt) throw new Error(`Missing alt text for image: ${src}`);

    const inputPath = src.startsWith("/")
      ? path.join("src", src)
      : src;

    const metadata = await Image(inputPath, {
      widths,
      formats: ["webp", "jpeg"],
      outputDir: "_site/images/optimized",
      urlPath: "/images/optimized/",
    });

    const imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    return Image.generateHTML(metadata, imageAttributes);
  });

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
}
