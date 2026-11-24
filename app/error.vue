<script setup lang="ts">
import { ConfigProvider } from "reka-ui";
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

const errorCode = computed(() => {
  return (props.error as any).code || (props.error as any).cause?.code || null;
});

const isNuxtErrorCode = computed(() => {
  return typeof errorCode.value === "string" && errorCode.value.startsWith("NUXT_");
});

const useIdFunction = () => useId();
</script>

<template>
  <SiteBody>
    <ConfigProvider>
      <NuxtLayout name="default" :use-id="useIdFunction">
        <div class="flex min-h-[80vh] flex-col items-center justify-center gap-6 text-center">
          <PageHeader>
            <div v-if="errorCode" class="mb-2 flex items-center justify-center gap-2">
              <span
                class="inline-flex items-center rounded-md border border-border px-2.5 py-0.5 font-mono text-xs font-semibold text-muted-foreground"
              >
                {{ errorCode }}
              </span>
              <a
                v-if="isNuxtErrorCode"
                :href="`https://nuxt.com/docs/getting-started/error-codes#${errorCode.toLowerCase()}`"
                target="_blank"
                rel="noreferrer"
                class="text-xs text-primary underline underline-offset-4 hover:opacity-80"
              >
                Docs ↗
              </a>
            </div>
            <PageHeaderHeading>{{ error.status || error.statusCode }}</PageHeaderHeading>
            <PageHeaderDescription>{{ error.message || error.statusText }}</PageHeaderDescription>
            <Button as-child class="mt-6 w-fit">
              <NuxtLink to="/" prefetch-on="interaction">
                Go back home
              </NuxtLink>
            </Button>
          </PageHeader>
        </div>
      </NuxtLayout>
    </ConfigProvider>
  </SiteBody>
</template>
