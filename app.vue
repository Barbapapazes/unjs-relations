<script lang="ts" setup>
useHead({
  htmlAttrs: {
    lang: 'en',
    dir: 'ltr',
    class: 'scroll-smooth',
  },
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#ECDC5A' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.svg' },
  ],
})
</script>

<template>
  <main class="font-sans dark:bg-gray-900">
    <NuxtPage />
  </main>

  <UNotifications />
</template>
