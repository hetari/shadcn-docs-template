import { defineCollection, defineContentConfig, z } from "@nuxt/content";

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: "page",
      source: {
        include: "**/*.md",
        exclude: ["**/.*"],
      },
      schema: z.object({
        rawbody: z.string().optional(),
        links: z
          .object({
            doc: z.string().optional(),
            api: z.string().optional(),
          })
          .optional(),
        new: z.boolean().optional(),
        navigation: z
          .object({
            icon: z.string().optional(),
          })
          .optional(),
      }),
    }),
  },
});
