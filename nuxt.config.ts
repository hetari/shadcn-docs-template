import tailwindcss from "@tailwindcss/vite";
import { createHash } from "node:crypto";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

// Compute the docs version at BUILD TIME by hashing all .md files.
// This avoids reading the filesystem at request time, which fails in serverless.
function computeDocsVersion(): string {
  try {
    const contentDir = join(__dirname, "content");
    const files = getAllMdFiles(contentDir);
    const hash = createHash("md5");
    for (const file of files.sort()) {
      const stats = statSync(file);
      hash.update(`${file}:${stats.mtimeMs}`);
    }
    return hash.digest("hex").slice(0, 8);
  }
  catch {
    return "unknown";
  }
}

function getAllMdFiles(dirPath: string, files: string[] = []): string[] {
  for (const entry of readdirSync(dirPath)) {
    const full = join(dirPath, entry);
    if (statSync(full).isDirectory()) {
      getAllMdFiles(full, files);
    }
    else if (entry.endsWith(".md")) {
      files.push(full);
    }
  }
  return files;
}

const DOCS_VERSION = computeDocsVersion();

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "shadcn-nuxt",
    "@vueuse/nuxt",
    "@nuxtjs/color-mode",
    "@nuxt/a11y",
    "@nuxt/hints",
    "nuxt-og-image",
    "@nuxt/content",
    "nuxt-shiki",
    "@nuxt/fonts",
    "@nuxt/eslint",
  ],

  runtimeConfig: {
    docsVersion: DOCS_VERSION,
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  routeRules: {
    "/": {
      prerender: true,
    },
    // Short aliases → real content paths (content lives under section folders)
    "/docs/introduction": {
      redirect: "/docs/getting-started/introduction",
    },
    "/docs/installation": {
      redirect: "/docs/getting-started/installation",
    },
    "/docs/animation": {
      redirect: "/docs/components",
    },

    // Docs layout - uses navigation data, all docs pages
    // ISR: Generate at build/first request, cache for 1 hour, regenerate in background
    "/docs/**": {
      isr: 3600,
    },
    // Raw markdown content endpoint
    "/raw/**": {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    },
  },

  ogImage: {
    defaults: {
      width: 1200,
      height: 630,
    },
  },

  css: ["~/assets/css/main.css"],

  vite: {
    optimizeDeps: {
      include: [
        "reka-ui",
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
        "lucide-vue-next",
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "shiki/langs/astro.mjs",
        "shiki/langs/bash.mjs",
        "shiki/langs/html.mjs",
        "shiki/langs/javascript.mjs",
        "shiki/langs/js.mjs",
        "shiki/langs/json.mjs",
        "shiki/langs/markdown.mjs",
        "shiki/langs/md.mjs",
        "shiki/langs/toml.mjs",
        "shiki/langs/ts.mjs",
        "shiki/langs/tsx.mjs",
        "shiki/langs/typescript.mjs",
        "shiki/langs/vue.mjs",
        "shiki/langs/yaml.mjs",
        "shiki/themes/github-dark.mjs",
        "shiki/themes/github-light-default.mjs",
        "shiki/themes/min-dark.mjs",
        "shiki/themes/min-light.mjs",
      ],
    },
    plugins: [
      // https://github.com/tailwindlabs/tailwindcss/discussions/19655
      tailwindcss(),
    ],
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

  components: [
    {
      path: "~/components",
      ignore: ["_internal/*", "_internal/**/*", "examples/*", "examples/**/*"],
    },
    { path: "~/components/demo", pathPrefix: false },
    { path: "~/components/content", global: true, pathPrefix: false },
  ],

  shiki: {
    defaultTheme: {
      light: "github-light-default",
      dark: "github-dark",
    },
    bundledLangs: [
      "ts",
      "tsx",
      "js",
      "vue",
      "html",
      "json",
      "bash",
      "astro",
      "toml",
      "yaml",
      "md",
      "markdown",
    ],
  },

  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ["normal"],
      subsets: ["latin"],
    },
    families: [
      { name: "Inter", global: true },
      { name: "Geist", weights: [400, 500, 600], global: true },
    ],
  },
  content: {
    build: {
      markdown: {
        highlight: false,
      },
    },
    // required to prevent error related to better-sqlite3 during build and deploy
    experimental: {
      sqliteConnector: "better-sqlite3",
    },
  },

  build: {
    transpile: ["vue-sonner"],
  },

  nitro: {
    devStorage: {
      cache: {
        driver: "memory",
      },
    },
    prerender: {
      crawlLinks: true,
      routes: ["/"],
      failOnError: false,
      autoSubfolderIndex: false,
    },
  },
  app: {
    head: {
      link: [
        // { rel: "manifest", href: "/site.webmanifest" },
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
      meta: [
        {
          name: "keywords",
          content: "Nuxt,Vue,Tailwind CSS,Components,shadcn",
        },
      ],
    },
  },
  hooks: {
    "content:file:afterParse": function ({ file, content }) {
      if (file.path && file.path.endsWith(".md")) {
        try {
          const stats = statSync(file.path);
          content.lastUpdated = stats.mtime.toISOString();
        }
        catch {
          // ignore
        }
      }
    },
  },
});
