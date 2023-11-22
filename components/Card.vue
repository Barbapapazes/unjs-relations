<script lang="ts" setup>
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="p-2 bg-white/40 backdrop-blur-sm ring-1 ring-gray-300 rounded-md text-sm space-y-1">
    <h2 v-if="title" class="font-medium">
      {{ title }}
    </h2>
    <slot />
  </div>
</template>
