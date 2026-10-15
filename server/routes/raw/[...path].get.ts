import { queryCollection } from "@nuxt/content/server";
import { createError, defineEventHandler, getRouterParam } from "nuxt/server";

const MD_EXT_REGEX = /\.md$/;

export default defineEventHandler(async (event) => {
  const path = getRouterParam(event, "path", { decode: true });
  if (!path) {
    throw createError({
      status: 400,
      statusText: "Missing path parameter",
    });
  }

  const contentPath = `/${path.replace(MD_EXT_REGEX, "")}`;

  const page = (await queryCollection(event as any, "content").path(contentPath).first()) as any;

  if (!page) {
    throw createError({
      status: 404,
      statusText: `Content not found at path: ${contentPath}`,
    });
  }

  event.res.headers.set("Content-Type", "text/markdown; charset=utf-8");

  return page.rawbody || "";
});
