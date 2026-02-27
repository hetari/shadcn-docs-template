<template>
  <Tabs default-value="cli" class="w-full rounded-lg bg-white p-6 shadow-md dark:bg-gray-900">
    <TabsList class="mb-6 flex space-x-4 border-b border-gray-200 dark:border-gray-700">
      <TabsTrigger
        value="cli"
        class="
          rounded-t-lg px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        CLI
      </TabsTrigger>
      <TabsTrigger
        value="manual"
        class="
          rounded-t-lg px-4 py-2 font-semibold text-gray-700 hover:bg-gray-100 data-[state=active]:bg-blue-500 data-[state=active]:text-white dark:text-gray-200
          dark:hover:bg-gray-800
        "
      >
        Manual
      </TabsTrigger>
    </TabsList>

    <TabsContent value="cli" class="text-gray-700 dark:text-gray-200">
      <p class="text-lg font-medium">
        CLI content goes here.
      </p>
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        Execute commands and interact with your project directly from the terminal.
      </p>
    </TabsContent>

    <TabsContent value="manual" class="space-y-4 text-gray-700 dark:text-gray-200">
      <h3 class="text-xl font-semibold">
        Initialize Shadcn Vue
      </h3>
      <p>
        Follow the
        <a href="https://shadcn-vue.com/docs/installation.html" target="_blank" class="text-blue-600 hover:underline dark:text-blue-400">
          Shadcn Vue Installation Guide
        </a>
        to configure your project. Use <code class="rounded-sm bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">shadcn-vue</code> command.
      </p>

      <h3 class="text-xl font-semibold">
        Add Namespaces with <code class="rounded-sm bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">components.json</code>
      </h3>
      <p>
        The <code class="rounded-sm bg-gray-100 px-1.5 py-0.5 dark:bg-gray-800">components.json</code> file holds configuration for your project, allowing easy installation of any components.
      </p>
    </TabsContent>
  </Tabs>
</template>
