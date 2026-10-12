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
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.135418 193.289C1.60539 179.975 10.5091 168.828 24.0643 163.156C30.8997 160.369 30.8998 160.369 74.8519 159.748C111.969 159.233 119.78 158.816 124.904 157.272C133.21 154.902 137.851 152.319 143.216 147.367C150.177 140.861 152.498 135.394 152.13 127.14C151.763 120.119 151.763 120.119 98.0459 119.604C40.7906 118.983 42.1241 119.09 29.5558 113.622C18.0796 108.563 8.18878 98.4541 3.30637 86.4811C-0.725544 76.4695 -0.473595 62.0202 3.91532 50.9791C12.8296 28.7904 33.9447 11.3501 62.0316 2.8829C69.8435 0.513141 70.5785 0.513156 135.163 0.096008C200.356 -0.214634 200.356 -0.214648 199.747 7.32064C198.77 20.3232 190.35 31.0537 176.92 36.4233C168.867 39.6185 168.867 39.6185 122.468 40.1422C76.3219 40.657 76.0699 40.6569 69.9695 43.2397C66.6726 44.5799 60.8136 48.2988 56.9077 51.4939C49.3374 57.9997 46.1664 64.2924 46.1664 73.372C46.1664 78.3245 46.1665 78.3245 98.4239 78.3245C154.094 78.3245 158.252 78.6351 169.843 83.5877C197.92 95.7648 208.304 128.276 192.796 155.417C180.826 176.061 164.1 188.753 138.344 196.289C127.351 199.59 127.351 199.59 63.3756 199.901C-0.599589 200.211 -0.599567 200.211 0.135418 193.297V193.289Z"
                  fill="currentcolor"
                />
              </svg>
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
