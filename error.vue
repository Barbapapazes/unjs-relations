<script lang="ts" setup>
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: props.error.statusCode === 404 ? 'Page not found' : 'Error',
  description: props.error.message,
})
</script>

<template>
  <Body class="font-sans dark:bg-gray-900">
    <div class="px-4 h-screen w-screen container mx-auto xl:max-w-7xl">
      <Main class="h-full flex flex-col items-center justify-center">
        <h1 class="text-4xl font-bold">
          {{ error.statusCode }}
        </h1>
        <p class="mt-4 text-lg text-gray-500 dark:text-gray-400">
          {{ error.message }}
        </p>
      </Main>
    </div>
  </Body>
</template>
