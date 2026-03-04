import { defineEventHandler } from "#imports";
import { getDocsVersion } from "../utils/docs-version";

export default defineEventHandler(() => {
  return {
    version: getDocsVersion(),
  };
});
