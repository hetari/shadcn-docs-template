<script setup lang="ts">
import { ConfigProvider, TooltipProvider } from "reka-ui";

useHead({
  htmlAttrs: {
    lang: "en",
  },
});
const colorMode = useColorMode();
</script>

<template>
  <SiteBody>
    <ConfigProvider>
      <TooltipProvider>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </TooltipProvider>
    </ConfigProvider>

    <ClientOnly>
      <Toaster class="pointer-events-auto" :theme="colorMode.preference as any || 'system'" position="top-center" />
    </ClientOnly>
  </SiteBody>
</template>
