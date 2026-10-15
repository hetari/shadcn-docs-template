import { defineEventHandler, useRuntimeConfig } from "nuxt/server";
import { getDocsVersion } from "../utils/docs-version";

export default defineEventHandler((event) => {
  const config = useRuntimeConfig();

  // Set cache headers directly in the handler
  event.res.headers.set("Cache-Control", "public, max-age=300, s-maxage=300");

  const version = config.docsVersion && config.docsVersion !== "unknown"
    ? config.docsVersion
    : getDocsVersion();

  return {
    version,
  };
});
