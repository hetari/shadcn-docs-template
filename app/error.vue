<script setup lang="ts">
import type { NuxtError } from "#app";
import { ConfigProvider } from "reka-ui";

defineProps<{
  error: NuxtError;
}>();

const useIdFunction = () => useId();
</script>

<template>
  <SiteBody>
    <ConfigProvider>
      <NuxtLayout name="default" :use-id="useIdFunction">
        <div class="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
          <PageHeader>
            <PageHeaderHeading>{{ error.statusCode }}</PageHeaderHeading>
            <PageHeaderDescription>{{ error.message }}</PageHeaderDescription>
            <Button as-child class="mt-6 w-fit">
              <NuxtLink to="/">
                Go back home
              </NuxtLink>
            </Button>
          </PageHeader>
        </div>
      </NuxtLayout>
    </ConfigProvider>
  </SiteBody>
</template>
