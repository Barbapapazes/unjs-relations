<script lang="ts" setup>
// TODO: add npm and github
const legend = [{
  color: 'bg-yellow-500 ring-yellow-600',
  text: 'Selected packages',
}, {
  color: 'bg-cyan-300 ring-cyan-500',
  text: 'UnJS Packages',
}, {
  color: 'bg-pink-300 ring-pink-500',
  text: 'Used as dependencies',
}, {
  color: 'bg-purple-300 ring-purple-500',
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
