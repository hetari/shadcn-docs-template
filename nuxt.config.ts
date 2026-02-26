import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/a11y",
    "@nuxt/hints",
    "nuxt-og-image",
    "@nuxt/content",
    "nuxt-shiki",
  ],

  ogImage: {
    defaults: {
      width: 1200,
      height: 630,
    },
  },

  css: ["~/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },

  components: {
    dirs: [
      {
        path: "~/components/ui",
        global: true,
        pathPrefix: false,
        preload: true,
        prefetch: true,
      },
      "~/components",
    ],
  },

  shiki: {
    defaultTheme: {
      light: "github-light-default",
      dark: "github-dark",
    },
    bundledLangs: [
      "typescript",
      "javascript",
      "vue",
      "html",
      "bash",
    ],
  },
});
