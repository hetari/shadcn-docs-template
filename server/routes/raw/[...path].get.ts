import { queryCollection } from "@nuxt/content/server";

export default defineEventHandler(async (event) => {
  const path = event.context.params?.path;
  if (!path) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing path parameter",
    });
  }

  const contentPath = `/${path.replace(/\.md$/, "")}`;

  const page = (await queryCollection(event, "content")
    .path(contentPath)
    .first()) as any;

  if (!page) {
    throw createError({
      statusCode: 404,
      statusMessage: `Content not found at path: ${contentPath}`,
    });
  }

  setHeader(event, "Content-Type", "text/markdown; charset=utf-8");

  return page.rawbody || "";
});
