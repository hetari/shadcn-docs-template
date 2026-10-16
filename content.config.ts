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
        soon: z.boolean().optional(),
        hide: z.boolean().optional(),
        beta: z.boolean().optional(),
        lastUpdated: z.string().optional(),
        navigation: z
          .object({
            title: z.string().optional(),
            icon: z.string().optional(),
          })
          .optional(),
      }),
    }),
  },
});
