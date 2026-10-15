<script lang="ts" setup>
import { MAIN_NAVIGATION } from "~/lib/navigation";
import { siteConfig } from "~/lib/siteConfig";

const { data } = await useNavigation();
const docData = computed(() => data.value!.find(i => i.stem === "docs")!);
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-background">
    <div class="container-wrapper px-6 3xl:fixed:px-0">
      <div
        class="flex h-(--header-height) items-center 3xl:fixed:container"
      >
        <MobileNav :tree="data ?? []" :items="MAIN_NAVIGATION" class="flex lg:hidden" />
        <Button as-child variant="ghost" size="icon" class="hidden size-8 lg:flex">
          <NuxtLink to="/" prefetch-on="interaction">
            <div class="size-5 text-inherit">
              <img src="/logo.svg" alt="" class="size-5">
            </div>
            <span class="sr-only">{{ siteConfig.name }}</span>
          </NuxtLink>
        </Button>

        <MainNav :items="MAIN_NAVIGATION" class="hidden lg:flex" />
        <div class="ms-auto flex items-center gap-2 md:flex-1 md:justify-end">
          <div class="hidden w-full flex-1 md:flex md:w-auto md:flex-none">
            <CommandMenu :tree="docData" :nav-items="MAIN_NAVIGATION" />
          </div>
          <Separator orientation="vertical" class="ml-2 hidden h-4! lg:block" />
          <GitHubLink />
          <TwitterLink />
          <Separator orientation="vertical" class="hidden h-4! 3xl:flex" />

          <SiteConfig class="hidden 3xl:flex" />
          <Separator orientation="vertical" class="h-4!" />
          <ModeSwitcher />
        </div>
      </div>
    </div>
  </header>
</template>
