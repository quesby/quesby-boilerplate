import { DateTime } from "luxon";

export default function(eleventyConfig) {
  // Format date to W3C (ISO 8601) for sitemaps
  eleventyConfig.addFilter("w3cDate", dateObj => {
    if (!dateObj) return "";
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-MM-dd");
  });
}
