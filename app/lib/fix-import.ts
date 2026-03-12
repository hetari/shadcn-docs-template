const IMPORT_REGEX
  = /@\/[^/]+\/((?:.*?\/)?(?:components|ui|composables|lib))\/([\w-]+)/g;

export function fixImport(content: string): string {
  const replacement = (...args: any[]) => {
    const [match, type, component] = args;

    if (type.endsWith("components")) {
      return `@/components/${component}`;
    }
    else if (type.endsWith("ui")) {
      return `@/components/ui/${component}`;
    }
    else if (type.endsWith("composables")) {
      return `@/composables/${component}`;
    }
    else if (type.endsWith("lib")) {
      return `@/lib/${component}`;
    }

    return match;
  };

  return content.replace(IMPORT_REGEX, replacement);
}
