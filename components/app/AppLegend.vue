<script lang="ts" setup>
// TODO: add npm and github
const legend = [{
  color: 'bg-yellow-300 ring-yellow-500 dark:bg-yellow-900 dark:ring-yellow-600',
  text: 'Selected packages',
}, {
  color: 'bg-cyan-300 ring-cyan-500 dark:bg-cyan-900 dark:ring-cyan-600',
  text: 'UnJS Packages',
}, {
  color: 'bg-pink-300 ring-pink-500 dark:bg-pink-900 dark:ring-pink-800',
  text: 'Used as dependencies',
}, {
  color: 'bg-purple-300 ring-purple-500 dark:bg-purple-900 dark:ring-purple-800',
  text: 'Used as devDependencies',
}]
</script>

<template>
  <template v-for="item in legend" :key="item.text">
    <div class="flex items-center gap-2">
      <span class="block rounded-full w-3 h-3 ring-1" :class="item.color" />
      <span> {{ item.text }}</span>
    </div>
  </template>
</template>
