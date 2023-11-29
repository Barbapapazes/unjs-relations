<script lang="ts" setup>
defineProps<{
  name: string
}>()
</script>

<template>
  <UAvatar icon="i-simple-icons-npm" :src="`https://api.iconify.design/logos/${name}-icon.svg`" aria-hidden="true" size="xs" :ui="{ rounded: '', icon: { base: 'text-inherit dark:text-inherit', size: { xs: 'w-6 h-6' } } }" />
</template>
