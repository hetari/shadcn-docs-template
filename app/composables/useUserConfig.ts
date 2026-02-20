import { isClient, watchImmediate } from "@vueuse/core";

export type Layout = "fixed" | "full";
export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";
export type InstallationType = "cli" | "manual";

export type IUserConfig = {
  layout: Layout;
  packageManager: PackageManager;
  installationType: InstallationType;
};

const LAYOUTS: Layout[] = ["fixed", "full"];

export const useConfig = createSharedComposable(() => {
  const config = useCookie<IUserConfig>("user-config", {
    default: () => ({
      layout: "fixed",
      packageManager: "pnpm",
      installationType: "cli",
    }),
    path: "/",
    maxAge: 31536000,
    sameSite: "lax",
  });

  watchImmediate(
    () => config.value.layout,
    (newLayout) => {
      if (!isClient) {
        return;
      }
      // Remove any existing layout classes
      document.documentElement.classList.remove(
        ...LAYOUTS.map(l => `layout-${l}`),
      );
      // Add the new layout class
      document.documentElement.classList.add(`layout-${newLayout}`);
    },
  );

  const isLayoutFull = computed(() => config.value.layout === "full");

  return {
    config,
    isLayoutFull,
  };
});
