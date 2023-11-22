<script lang="ts" setup>
const right = inject('right', false)
</script>

<template>
  <UButton square size="xs" color="gray" variant="ghost" type="button" :icon="right ? 'i-ph-arrow-line-right' : 'i-ph-arrow-line-left'" aria-label="close card" />
</template>
